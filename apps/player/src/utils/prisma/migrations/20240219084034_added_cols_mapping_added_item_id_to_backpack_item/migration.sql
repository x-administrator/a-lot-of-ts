/*
  Warnings:

  - The primary key for the `Backpack` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `backpackId` on the `Backpack` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Backpack` table. All the data in the column will be lost.
  - The primary key for the `BackpackItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `backpackId` on the `BackpackItem` table. All the data in the column will be lost.
  - You are about to drop the column `backpackItemId` on the `BackpackItem` table. All the data in the column will be lost.
  - You are about to drop the column `item` on the `BackpackItem` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `nikName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.
  - The primary key for the `UsetAuth` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `publickey` on the `UsetAuth` table. All the data in the column will be lost.
  - You are about to drop the column `secretKey` on the `UsetAuth` table. All the data in the column will be lost.
  - You are about to drop the column `userAuthId` on the `UsetAuth` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UsetAuth` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Backpack` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nik_name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `backpack_id` was added to the `Backpack` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `user_id` to the `Backpack` table without a default value. This is not possible if the table is not empty.
  - Added the required column `backpack_id` to the `BackpackItem` table without a default value. This is not possible if the table is not empty.
  - The required column `backpack_item_id` was added to the `BackpackItem` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `item_id` to the `BackpackItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nik_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - The required column `user_id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `public_key` to the `UsetAuth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secret_key` to the `UsetAuth` table without a default value. This is not possible if the table is not empty.
  - The required column `user_auth_id` was added to the `UsetAuth` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `user_id` to the `UsetAuth` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Backpack" DROP CONSTRAINT "Backpack_userId_fkey";

-- DropForeignKey
ALTER TABLE "UsetAuth" DROP CONSTRAINT "UsetAuth_userId_fkey";

-- DropIndex
DROP INDEX "User_nikName_key";

-- AlterTable
ALTER TABLE "Backpack" DROP CONSTRAINT "Backpack_pkey",
DROP COLUMN "backpackId",
DROP COLUMN "userId",
ADD COLUMN     "backpack_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "Backpack_pkey" PRIMARY KEY ("backpack_id");

-- AlterTable
ALTER TABLE "BackpackItem" DROP CONSTRAINT "BackpackItem_pkey",
DROP COLUMN "backpackId",
DROP COLUMN "backpackItemId",
DROP COLUMN "item",
ADD COLUMN     "backpack_id" TEXT NOT NULL,
ADD COLUMN     "backpack_item_id" TEXT NOT NULL,
ADD COLUMN     "item_id" TEXT NOT NULL,
ADD CONSTRAINT "BackpackItem_pkey" PRIMARY KEY ("backpack_item_id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "nikName",
DROP COLUMN "userId",
ADD COLUMN     "nik_name" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");

-- AlterTable
ALTER TABLE "UsetAuth" DROP CONSTRAINT "UsetAuth_pkey",
DROP COLUMN "publickey",
DROP COLUMN "secretKey",
DROP COLUMN "userAuthId",
DROP COLUMN "userId",
ADD COLUMN     "public_key" TEXT NOT NULL,
ADD COLUMN     "secret_key" TEXT NOT NULL,
ADD COLUMN     "user_auth_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "UsetAuth_pkey" PRIMARY KEY ("user_auth_id");

-- CreateIndex
CREATE UNIQUE INDEX "Backpack_user_id_key" ON "Backpack"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_nik_name_key" ON "User"("nik_name");

-- AddForeignKey
ALTER TABLE "UsetAuth" ADD CONSTRAINT "UsetAuth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Backpack" ADD CONSTRAINT "Backpack_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BackpackItem" ADD CONSTRAINT "BackpackItem_backpack_id_fkey" FOREIGN KEY ("backpack_id") REFERENCES "Backpack"("backpack_id") ON DELETE RESTRICT ON UPDATE CASCADE;
