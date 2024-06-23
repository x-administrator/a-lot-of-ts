-- CreateTable
CREATE TABLE "player_state" (
    "playerId" TEXT NOT NULL,
    "wave" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "isDoneWave" BOOLEAN NOT NULL DEFAULT false,
    "nextAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_state_pkey" PRIMARY KEY ("playerId")
);
