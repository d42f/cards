import type { Session } from 'next-auth';
import bcrypt from 'bcryptjs';

import { prisma } from '@/lib/prisma';

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

  Query: {
    myStats: async (_: unknown, __: unknown, ctx: Context) => {
      const user = requireAuth(ctx);
      const [totalWords, studiedWords, wordSetCount, dbUser] = await Promise.all([
        prisma.word.count(),
        prisma.progress.count({ where: { userId: user.id } }),
        prisma.wordSet.count(),
        prisma.user.findUnique({
          where: { id: user.id },
          select: { streak: true },
        }),
      ]);
      return {
        totalWords,
        studiedWords,
        wordSetCount,
        streak: dbUser?.streak ?? 0,
      };
    },
    latestWordSet: async (_: unknown, __: unknown, ctx: Context) => {
      const user = requireAuth(ctx);
      const lastTrainedProgress = await prisma.progress.findFirst({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' },
        include: { wordSet: { include: { words: { select: { id: true } } } } },
      });
      if (lastTrainedProgress?.wordSet) return lastTrainedProgress.wordSet;
      return prisma.wordSet.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { words: { select: { id: true } } },
      });
    },
    wordSets: async (_: unknown, __: unknown, ctx: Context) => {
      requireAuth(ctx);
      return prisma.wordSet.findMany({ include: { words: true } });
    },
    wordSet: async (_: unknown, { id }: { id: string }, ctx: Context) => {
      requireAuth(ctx);
      return prisma.wordSet.findUnique({
        where: { id },
        include: { words: true },
      });
    },
    myProgress: async (_: unknown, { wordSetId }: { wordSetId: string }, ctx: Context) => {
      const user = requireAuth(ctx);
      return prisma.progress.findMany({
        where: { userId: user.id, wordSetId },
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
      return prisma.user.create({
        data: {
          email,
          password: hashed,
          name,
          role: (role as 'STUDENT' | 'TEACHER') ?? 'STUDENT',
        },
      });
    },

    createWordSet: async (_: unknown, { title }: { title: string }, ctx: Context) => {
      requireAuth(ctx);
      return prisma.wordSet.create({
        data: { title },
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

      const dbUser = await prisma.user.findUniqueOrThrow({
        where: { id: user.id },
      });
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const last = dbUser.lastActivityAt ? new Date(dbUser.lastActivityAt.setHours(0, 0, 0, 0)) : null;
      const diffDays = last ? Math.round((today.getTime() - last.getTime()) / 86400000) : null;

      const newStreak = diffDays === 0 ? dbUser.streak : diffDays === 1 ? dbUser.streak + 1 : 1;

      const [progress] = await prisma.$transaction([
        prisma.progress.upsert({
          where: { userId_wordId: { userId: user.id, wordId } },
          update: { score },
          create: { userId: user.id, wordId, wordSetId, score },
        }),
        prisma.user.update({
          where: { id: user.id },
          data: { streak: newStreak, lastActivityAt: new Date() },
        }),
      ]);

      return progress;
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
  },
};
