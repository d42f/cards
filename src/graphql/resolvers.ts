import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Session } from "next-auth";

interface Context {
  session: Session | null;
}

function requireAuth(ctx: Context) {
  if (!ctx.session?.user) throw new Error("Not authenticated");
  return ctx.session.user;
}

function requireTeacher(ctx: Context) {
  const user = requireAuth(ctx);
  if (user.role !== "TEACHER") throw new Error("Requires TEACHER role");
  return user;
}

export const resolvers = {
  Query: {
    wordSets: async (_: unknown, __: unknown, ctx: Context) => {
      requireAuth(ctx);
      return prisma.wordSet.findMany({ include: { teacher: true, words: true } });
    },
    wordSet: async (_: unknown, { id }: { id: string }, ctx: Context) => {
      requireAuth(ctx);
      return prisma.wordSet.findUnique({
        where: { id },
        include: { teacher: true, words: true },
      });
    },
    myProgress: async (_: unknown, { wordSetId }: { wordSetId: string }, ctx: Context) => {
      const user = requireAuth(ctx);
      return prisma.progress.findMany({
        where: { userId: user.id, wordSetId },
      });
    },
  },

  Mutation: {
    register: async (
      _: unknown,
      {
        email,
        password,
        name,
        role,
      }: { email: string; password: string; name?: string; role?: string }
    ) => {
      const hashed = await bcrypt.hash(password, 10);
      return prisma.user.create({
        data: { email, password: hashed, name, role: (role as "STUDENT" | "TEACHER") ?? "STUDENT" },
      });
    },

    createWordSet: async (_: unknown, { title }: { title: string }, ctx: Context) => {
      const user = requireTeacher(ctx);
      return prisma.wordSet.create({
        data: { title, teacherId: user.id! },
        include: { teacher: true, words: true },
      });
    },

    addWord: async (
      _: unknown,
      { wordSetId, term, definition }: { wordSetId: string; term: string; definition: string },
      ctx: Context
    ) => {
      requireTeacher(ctx);
      return prisma.word.create({ data: { wordSetId, term, definition } });
    },

    updateProgress: async (
      _: unknown,
      { wordId, wordSetId, score }: { wordId: string; wordSetId: string; score: number },
      ctx: Context
    ) => {
      const user = requireAuth(ctx);
      return prisma.progress.upsert({
        where: { userId_wordId: { userId: user.id!, wordId } },
        update: { score },
        create: { userId: user.id!, wordId, wordSetId, score },
      });
    },
  },
};
