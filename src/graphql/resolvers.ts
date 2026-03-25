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
        where: { id: user.id! },
        include: { students: true },
      });
      return teacher?.students ?? [];
    },
    myTeachers: async (_: unknown, __: unknown, ctx: Context) => {
      const user = requireAuth(ctx);
      const student = await prisma.user.findUnique({
        where: { id: user.id! },
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
        data: { email, password: hashed, name, role: (role as 'STUDENT' | 'TEACHER') ?? 'STUDENT' },
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
      return prisma.progress.upsert({
        where: { userId_wordId: { userId: user.id!, wordId } },
        update: { score },
        create: { userId: user.id!, wordId, wordSetId, score },
      });
    },

    addStudent: async (_: unknown, { studentId }: { studentId: string }, ctx: Context) => {
      const user = requireTeacher(ctx);
      return prisma.user.update({
        where: { id: user.id! },
        data: { students: { connect: { id: studentId } } },
        include: { students: true },
      });
    },

    removeStudent: async (_: unknown, { studentId }: { studentId: string }, ctx: Context) => {
      const user = requireTeacher(ctx);
      return prisma.user.update({
        where: { id: user.id! },
        data: { students: { disconnect: { id: studentId } } },
        include: { students: true },
      });
    },
  },
};
