/*
  Warnings:

  - You are about to drop the `DailyActivity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DailyActivity";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "TrainingSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "wordSetId" TEXT NOT NULL,
    "totalWords" INTEGER NOT NULL,
    "knownWords" INTEGER NOT NULL,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TrainingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TrainingSession_wordSetId_fkey" FOREIGN KEY ("wordSetId") REFERENCES "WordSet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
