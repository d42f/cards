import { NextRequest, NextResponse } from 'next/server';
import type { Session } from 'next-auth';
import { ApolloServer } from '@apollo/server';
import { typeDefs } from '@cards/graphql';

import { auth } from '@/auth';
import { resolvers } from '@/graphql/resolvers';
import { prisma } from '@/lib/prisma';

interface GraphQLContext {
  session: Session | null;
  prisma: typeof prisma;
}

const server = new ApolloServer<GraphQLContext>({ typeDefs, resolvers });

let serverStarted = false;
async function ensureStarted() {
  if (!serverStarted) {
    await server.start();
    serverStarted = true;
  }
}

async function handler(req: NextRequest): Promise<NextResponse> {
  await ensureStarted();

  const session = await auth();
  const contextValue: GraphQLContext = { session, prisma };

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ errors: [{ message: 'Invalid JSON' }] }, { status: 400 });
  }

  const { query, variables, operationName } = body as {
    query?: string;
    variables?: Record<string, unknown>;
    operationName?: string;
  };

  const result = await server.executeOperation({ query: query ?? '', variables, operationName }, { contextValue });

  const responseBody = result.body.kind === 'single' ? result.body.singleResult : result.body;

  return NextResponse.json(responseBody);
}

export async function GET(req: NextRequest) {
  return handler(req);
}

export async function POST(req: NextRequest) {
  return handler(req);
}
