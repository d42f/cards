import type { Session } from 'next-auth';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import path from 'path';

import { startOfDay } from '@/lib/date';
import { prisma } from '@/lib/prisma';

interface SeedWord {
  term: string;
  definition: string;
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

function requireTeacher(ctx: Context) {
  const user = requireAuth(ctx);
  if (user.role !== 'TEACHER') throw new Error('Requires TEACHER role');
  return user;
}

export const resolvers = {
  User: {
    students: async (parent: { id: string }) => {
      const user = await prisma.user.findUnique({
        where: { id: parent.id },
        include: { students: true },
      });
      return user?.students ?? [];
    },
    teachers: async (parent: { id: string }) => {
      const user = await prisma.user.findUnique({
        where: { id: parent.id },
        include: { teachers: true },
      });
      return user?.teachers ?? [];
    },
  },

  WordSet: {
    studiedCount: async (parent: { id: string }, _: unknown, ctx: Context) => {
      const user = requireAuth(ctx);
      return prisma.progress.count({
        where: { userId: user.id, wordSetId: parent.id, score: { gte: 3 } },
      });
    },
    dueCount: async (parent: { id: string }, _: unknown, ctx: Context) => {
      const user = requireAuth(ctx);
      const [totalWords, studiedCount] = await Promise.all([
        prisma.word.count({ where: { wordSetId: parent.id } }),
        prisma.progress.count({ where: { userId: user.id, wordSetId: parent.id, score: { gte: 3 } } }),
      ]);
      return totalWords - studiedCount;
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
      const weekStart = startOfDay(now);
      const dow = weekStart.getDay();
      weekStart.setDate(weekStart.getDate() - (dow === 0 ? 6 : dow - 1));

      const [totalWords, studiedWords, wordSetCount, sessions] = await Promise.all([
        prisma.word.count({ where: { wordSet: { userId: user.id } } }),
        prisma.progress.count({ where: { userId: user.id } }),
        prisma.wordSet.count({ where: { userId: user.id } }),
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

      return { totalWords, studiedWords, wordSetCount, streak, todayCount, weekActivity };
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

    myStudents: async (_: unknown, __: unknown, ctx: Context) => {
      const user = requireTeacher(ctx);
      const teacher = await prisma.user.findUnique({
        where: { id: user.id },
        include: { students: true },
      });
      return teacher?.students ?? [];
    },

    myTeachers: async (_: unknown, __: unknown, ctx: Context) => {
      const user = requireAuth(ctx);
      const student = await prisma.user.findUnique({
        where: { id: user.id },
        include: { teachers: true },
      });
      return student?.teachers ?? [];
    },
  },

  Mutation: {
    register: async (
      _: unknown,
      { email, password, name, role }: { email: string; password: string; name: string; role?: string },
    ) => {
      const hashed = await bcrypt.hash(password, 10);
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
            term: w.term,
            definition: w.definition,
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
      { wordSetId, term, definition }: { wordSetId: string; term: string; definition: string },
      ctx: Context,
    ) => {
      requireAuth(ctx);
      return prisma.word.create({ data: { wordSetId, term, definition } });
    },

    updateProgress: async (
      _: unknown,
      { wordId, wordSetId, score }: { wordId: string; wordSetId: string; score: number },
      ctx: Context,
    ) => {
      const user = requireAuth(ctx);
      return prisma.progress.upsert({
        where: { userId_wordId: { userId: user.id, wordId } },
        update: { score },
        create: { userId: user.id, wordId, wordSetId, score },
      });
    },

    addStudent: async (_: unknown, { studentId }: { studentId: string }, ctx: Context) => {
      const user = requireTeacher(ctx);
      return prisma.user.update({
        where: { id: user.id },
        data: { students: { connect: { id: studentId } } },
        include: { students: true },
      });
    },

    removeStudent: async (_: unknown, { studentId }: { studentId: string }, ctx: Context) => {
      const user = requireTeacher(ctx);
      return prisma.user.update({
        where: { id: user.id },
        data: { students: { disconnect: { id: studentId } } },
        include: { students: true },
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
