/*
  Warnings:

  - You are about to drop the `Thread` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_userId_fkey";

-- DropTable
DROP TABLE "Thread";
