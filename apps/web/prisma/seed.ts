import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { readFileSync } from 'fs';
import path from 'path';

import { PrismaClient } from '../src/generated/prisma/client';

import 'dotenv/config';

interface SeedFile {
  title: string;
  words: { term: string; definition: string }[];
}

const SEED_FILES = [
  'oxford3000_a1.json',
  'oxford3000_a2.json',
  'oxford3000_b1.json',
  'oxford3000_b2.json',
  'oxford5000_b2.json',
  'oxford5000_c1.json',
];

const dbUrl = process.env['DATABASE_URL'];
if (!dbUrl) throw new Error('DATABASE_URL is not set');

const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const seedsDir = path.join(__dirname, 'seeds');

  for (const fileName of SEED_FILES) {
    const raw = readFileSync(path.join(seedsDir, fileName), 'utf-8');
    const { title, words } = JSON.parse(raw) as SeedFile;

    const existing = await prisma.wordSet.findFirst({ where: { title } });
    if (existing) {
      console.log(`Skipping "${title}" — already exists`);
      continue;
    }

    const wordSet = await prisma.wordSet.create({
      data: {
        title,
        words: {
          create: words.map(w => ({ term: w.term, definition: w.definition })),
        },
      },
    });

    console.log(`Created "${title}" — ${words.length} words (id: ${wordSet.id})`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
