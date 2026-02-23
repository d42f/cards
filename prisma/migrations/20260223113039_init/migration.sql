-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WordSet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WordSet_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Word" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "term" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "wordSetId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Word_wordSetId_fkey" FOREIGN KEY ("wordSetId") REFERENCES "WordSet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "wordSetId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Progress_wordSetId_fkey" FOREIGN KEY ("wordSetId") REFERENCES "WordSet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Progress_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Progress_userId_wordId_key" ON "Progress"("userId", "wordId");
