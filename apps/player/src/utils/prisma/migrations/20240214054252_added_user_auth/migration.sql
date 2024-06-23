/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nikName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nikName` to the `User` table without a default value. This is not possible if the table is not empty.
  - The required column `userId` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "UsetAuthType" AS ENUM ('LOCAL', 'GOOGLE', 'APPLE');

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "email",
DROP COLUMN "id",
DROP COLUMN "name",
DROP COLUMN "password",
ADD COLUMN     "nikName" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- CreateTable
CREATE TABLE "UsetAuth" (
    "userAuthId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "publickey" TEXT NOT NULL,
    "type" "UsetAuthType" NOT NULL,

    CONSTRAINT "UsetAuth_pkey" PRIMARY KEY ("userAuthId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nikName_key" ON "User"("nikName");

-- AddForeignKey
ALTER TABLE "UsetAuth" ADD CONSTRAINT "UsetAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
