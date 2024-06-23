/*
  Warnings:

  - The primary key for the `player_state` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `isDoneWave` on the `player_state` table. All the data in the column will be lost.
  - You are about to drop the column `nextAt` on the `player_state` table. All the data in the column will be lost.
  - You are about to drop the column `playerId` on the `player_state` table. All the data in the column will be lost.
  - Added the required column `player_id` to the `player_state` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "player_state" DROP CONSTRAINT "player_state_pkey",
DROP COLUMN "isDoneWave",
DROP COLUMN "nextAt",
DROP COLUMN "playerId",
ADD COLUMN     "is_done_wave" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "next_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "player_id" TEXT NOT NULL,
ADD CONSTRAINT "player_state_pkey" PRIMARY KEY ("player_id");
