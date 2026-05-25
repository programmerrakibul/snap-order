-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastResetAttempt" TIMESTAMP(3),
ADD COLUMN     "resetPasswordAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "resetPasswordCode" TEXT,
ADD COLUMN     "resetPasswordExpiry" TIMESTAMP(3);
