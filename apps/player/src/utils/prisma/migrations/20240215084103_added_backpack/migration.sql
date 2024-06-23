-- CreateTable
CREATE TABLE "Backpack" (
    "backpackId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Backpack_pkey" PRIMARY KEY ("backpackId")
);

-- CreateTable
CREATE TABLE "BackpackItem" (
    "backpackItemId" TEXT NOT NULL,
    "backpackId" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "data" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "BackpackItem_pkey" PRIMARY KEY ("backpackItemId")
);

-- AddForeignKey
ALTER TABLE "Backpack" ADD CONSTRAINT "Backpack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
