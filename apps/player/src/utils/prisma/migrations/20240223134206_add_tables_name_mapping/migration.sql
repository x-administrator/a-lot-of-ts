/*
  Warnings:

  - You are about to drop the `Backpack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BackpackItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsetAuth` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Backpack" DROP CONSTRAINT "Backpack_user_id_fkey";

-- DropForeignKey
ALTER TABLE "BackpackItem" DROP CONSTRAINT "BackpackItem_backpack_id_fkey";

-- DropForeignKey
ALTER TABLE "UsetAuth" DROP CONSTRAINT "UsetAuth_user_id_fkey";

-- DropTable
DROP TABLE "Backpack";

-- DropTable
DROP TABLE "BackpackItem";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UsetAuth";

-- CreateTable
CREATE TABLE "user" (
    "user_id" TEXT NOT NULL,
    "nik_name" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_auth" (
    "user_auth_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "secret_key" TEXT NOT NULL,
    "public_key" TEXT NOT NULL,
    "type" "UsetAuthType" NOT NULL,

    CONSTRAINT "user_auth_pkey" PRIMARY KEY ("user_auth_id")
);

-- CreateTable
CREATE TABLE "backpack" (
    "backpack_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "backpack_pkey" PRIMARY KEY ("backpack_id")
);

-- CreateTable
CREATE TABLE "backback_item" (
    "backpack_item_id" TEXT NOT NULL,
    "backpack_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "data" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "backback_item_pkey" PRIMARY KEY ("backpack_item_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_nik_name_key" ON "user"("nik_name");

-- CreateIndex
CREATE UNIQUE INDEX "backpack_user_id_key" ON "backpack"("user_id");

-- AddForeignKey
ALTER TABLE "user_auth" ADD CONSTRAINT "user_auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backpack" ADD CONSTRAINT "backpack_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backback_item" ADD CONSTRAINT "backback_item_backpack_id_fkey" FOREIGN KEY ("backpack_id") REFERENCES "backpack"("backpack_id") ON DELETE RESTRICT ON UPDATE CASCADE;
