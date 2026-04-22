-- CreateTable
CREATE TABLE "DailyActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "DailyActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyActivity_userId_date_key" ON "DailyActivity"("userId", "date");
