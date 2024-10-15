-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fighter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "heightCm" DOUBLE PRECISION NOT NULL,
    "reachCm" DOUBLE PRECISION NOT NULL,
    "gender" TEXT NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "fightingStyle" TEXT NOT NULL,
    "gym" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fighter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FightStat" (
    "id" SERIAL NOT NULL,
    "fightId" INTEGER NOT NULL,
    "event" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "fighter1Name" TEXT NOT NULL,
    "fighter2Name" TEXT NOT NULL,
    "fighter1Age" INTEGER NOT NULL,
    "fighter2Age" INTEGER NOT NULL,
    "fighter1HeightCm" DOUBLE PRECISION NOT NULL,
    "fighter2HeightCm" DOUBLE PRECISION NOT NULL,
    "fighter1ReachCm" DOUBLE PRECISION NOT NULL,
    "fighter2ReachCm" DOUBLE PRECISION NOT NULL,
    "fighter1Gender" TEXT NOT NULL,
    "fighter2Gender" TEXT NOT NULL,
    "fighter1WeightKg" DOUBLE PRECISION NOT NULL,
    "fighter2WeightKg" DOUBLE PRECISION NOT NULL,
    "fighter1Style" TEXT NOT NULL,
    "fighter2Style" TEXT NOT NULL,
    "fighter1Gym" TEXT NOT NULL,
    "fighter2Gym" TEXT NOT NULL,
    "rounds" INTEGER NOT NULL,
    "roundEnd" INTEGER NOT NULL,
    "timeEnd" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "winner" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "significantStrikesF1" INTEGER NOT NULL,
    "significantStrikesF2" INTEGER NOT NULL,
    "takedownsLandedF1" INTEGER NOT NULL,
    "takedownsLandedF2" INTEGER NOT NULL,
    "knockdownsF1" INTEGER NOT NULL,
    "knockdownsF2" INTEGER NOT NULL,
    "fighterId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FightStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Fighter" ADD CONSTRAINT "Fighter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FightStat" ADD CONSTRAINT "FightStat_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "Fighter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
