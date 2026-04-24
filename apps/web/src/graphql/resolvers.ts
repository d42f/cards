import type { Session } from 'next-auth';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import path from 'path';

import { type DueWord } from '@/entities/word';
import { shuffle } from '@/lib/array';
import { daysFromNow, startOfDay, startOfWeek } from '@/lib/date';
import { prisma } from '@/lib/prisma';
import { INITIAL_EASE_FACTOR, LEARNING_INTERVALS, QUALITY_KNOWN, sm2 } from '@/lib/spaced-repetition';

interface SeedWord {
  word: string;
  translation: string;
  transcription: string | null;
}
interface SeedSet {
  title: string;
  words: SeedWord[];
}

const SEED_FILES = [
  'oxford3000_a1.json',
  'oxford3000_a2.json',
  'oxford3000_b1.json',
  'oxford3000_b2.json',
  'oxford5000_b2.json',
  'oxford5000_c1.json',
];

function loadSeedSets(): SeedSet[] {
  const dir = path.join(process.cwd(), 'prisma', 'seeds');
  return SEED_FILES.map(f => JSON.parse(readFileSync(path.join(dir, f), 'utf-8')) as SeedSet);
}

interface Context {
  session: Session | null;
}

function requireAuth(ctx: Context) {
  if (!ctx.session?.user) throw new Error('Not authenticated');
  return ctx.session.user;
}

export const resolvers = {
  WordSet: {
    studiedCount: async (parent: { id: string }, _: unknown, ctx: Context) => {
      const user = requireAuth(ctx);
      return prisma.progress.count({
        where: { userId: user.id, wordSetId: parent.id, repetitions: { gte: LEARNING_INTERVALS.length } },
      });
    },

    wordsCount: async (parent: { id: string }) => {
      return prisma.word.count({ where: { wordSetId: parent.id } });
    },

    dueCount: async (parent: { id: string }, _: unknown, ctx: Context) => {
      const user = requireAuth(ctx);
      const now = new Date();
      const [totalWords, notDueCount] = await Promise.all([
        prisma.word.count({ where: { wordSetId: parent.id } }),
        prisma.progress.count({
          where: { userId: user.id, wordSetId: parent.id, nextReviewAt: { gt: now } },
        }),
      ]);
      return totalWords - notDueCount;
    },
  },

  Query: {
    me: async (_: unknown, __: unknown, ctx: Context) => {
      const user = requireAuth(ctx);
      return prisma.user.findUnique({ where: { id: user.id } });
    },

    myStats: async (_: unknown, __: unknown, ctx: Context) => {
      const user = requireAuth(ctx);

      const now = new Date();
      const todayStart = startOfDay(now);
      const weekStart = startOfWeek(now);

      const [totalWords, sessions] = await Promise.all([
        prisma.word.count({ where: { wordSet: { userId: user.id } } }),
        prisma.trainingSession.findMany({
          where: { userId: user.id },
          select: { completedAt: true, totalWords: true },
        }),
      ]);

      const todayCount = sessions.filter(s => s.completedAt >= todayStart).reduce((sum, s) => sum + s.totalWords, 0);

      const weekActivity = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        const next = new Date(day);
        next.setDate(next.getDate() + 1);
        return sessions.some(s => s.completedAt >= day && s.completedAt < next);
      });

      const activeDays = new Set(sessions.map(s => startOfDay(s.completedAt).getTime()));
      let streak = 0;
      const cursor = startOfDay(now);
      while (activeDays.has(cursor.getTime())) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      }

      return { totalWords, streak, todayCount, weekActivity };
    },

    wordSets: async (_: unknown, __: unknown, ctx: Context) => {
      const user = requireAuth(ctx);
      return prisma.wordSet.findMany({ where: { userId: user.id }, include: { words: true } });
    },

    wordSet: async (_: unknown, { id }: { id: string }, ctx: Context) => {
      const user = requireAuth(ctx);
      return prisma.wordSet.findUnique({
        where: { id, userId: user.id },
        include: { words: true },
      });
    },

    dueWords: async (_: unknown, { wordSetId }: { wordSetId: string }, ctx: Context) => {
      const user = requireAuth(ctx);
      const now = new Date();

      const fullUser = await prisma.user.findUnique({ where: { id: user.id }, select: { dailyGoal: true } });
      if (!fullUser) throw new Error('User not found');
      const limit = fullUser.dailyGoal;

      const dueProgress = await prisma.progress.findMany({
        where: { userId: user.id, wordSetId, nextReviewAt: { lte: now } },
        include: { word: true },
        orderBy: { nextReviewAt: 'asc' },
        take: limit,
      });
      const dueWords: DueWord[] = dueProgress.map(p => ({
        ...p.word,
        progress: {
          id: p.id,
          nextReviewAt: p.nextReviewAt?.toISOString() ?? null,
          easeFactor: p.easeFactor,
          interval: p.interval,
          repetitions: p.repetitions,
        },
      }));

      const newWords: DueWord[] = [];
      if (dueWords.length < limit) {
        const allNew = await prisma.word.findMany({
          where: { wordSetId, progress: { none: { userId: user.id } } },
        });
        shuffle(allNew);
        newWords.push(...allNew.slice(0, limit - dueWords.length).map(w => ({ ...w, progress: null })));
      }

      const combined = [...dueWords, ...newWords];
      shuffle(combined);
      return combined;
    },
  },

  Mutation: {
    register: async (
      _: unknown,
      { email, password, name, role }: { email: string; password: string; name: string; role?: string },
    ) => {
      const hashed = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS));
      const user = await prisma.user.create({
        data: {
          email,
          password: hashed,
          name,
          role: (role as 'STUDENT' | 'TEACHER') ?? 'STUDENT',
        },
      });
      for (const seed of loadSeedSets()) {
        const wordSet = await prisma.wordSet.create({ data: { title: seed.title, userId: user.id } });
        await prisma.word.createMany({
          data: seed.words.map(w => ({
            word: w.word,
            translation: w.translation,
            transcription: w.transcription,
            wordSetId: wordSet.id,
          })),
        });
      }
      return user;
    },

    createWordSet: async (_: unknown, { title }: { title: string }, ctx: Context) => {
      const user = requireAuth(ctx);
      return prisma.wordSet.create({
        data: { title, userId: user.id },
        include: { words: true },
      });
    },

    addWord: async (
      _: unknown,
      { wordSetId, word, translation }: { wordSetId: string; word: string; translation: string },
      ctx: Context,
    ) => {
      requireAuth(ctx);
      return prisma.word.create({ data: { wordSetId, word, translation } });
    },

    reviewWord: async (
      _: unknown,
      { wordId, wordSetId, quality }: { wordId: string; wordSetId: string; quality: number },
      ctx: Context,
    ) => {
      const user = requireAuth(ctx);

      const fields =
        quality === QUALITY_KNOWN
          ? {
              easeFactor: INITIAL_EASE_FACTOR,
              interval: LEARNING_INTERVALS.at(-1)!,
              repetitions: LEARNING_INTERVALS.length,
            }
          : sm2(
              (await prisma.progress.findUnique({ where: { userId_wordId: { userId: user.id, wordId } } })) ?? {
                easeFactor: INITIAL_EASE_FACTOR,
                interval: 0,
                repetitions: 0,
              },
              quality,
            );

      return prisma.progress.upsert({
        where: { userId_wordId: { userId: user.id, wordId } },
        update: { ...fields, nextReviewAt: daysFromNow(fields.interval) },
        create: { userId: user.id, wordId, wordSetId, ...fields, nextReviewAt: daysFromNow(fields.interval) },
      });
    },

    finishSession: async (
      _: unknown,
      { wordSetId, totalWords, knownWords }: { wordSetId: string; totalWords: number; knownWords: number },
      ctx: Context,
    ) => {
      const user = requireAuth(ctx);
      const session = await prisma.trainingSession.create({
        data: { userId: user.id, wordSetId, totalWords, knownWords },
      });
      return { ...session, completedAt: session.completedAt.toISOString() };
    },
  },
};
