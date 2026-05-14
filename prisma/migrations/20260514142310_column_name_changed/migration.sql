/*
  Warnings:

  - You are about to drop the column `lastRestocked` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "lastRestocked",
ADD COLUMN     "lastRestockedAt" TIMESTAMP(3);
