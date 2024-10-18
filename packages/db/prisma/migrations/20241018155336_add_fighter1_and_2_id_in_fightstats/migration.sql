/*
  Warnings:

  - You are about to drop the column `fighter1Name` on the `FightStat` table. All the data in the column will be lost.
  - You are about to drop the column `fighter2Name` on the `FightStat` table. All the data in the column will be lost.
  - You are about to drop the column `fighterId` on the `FightStat` table. All the data in the column will be lost.
  - Added the required column `fighter1Id` to the `FightStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fighter2Id` to the `FightStat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FightStat" DROP CONSTRAINT "FightStat_fighterId_fkey";

-- AlterTable
ALTER TABLE "FightStat" DROP COLUMN "fighter1Name",
DROP COLUMN "fighter2Name",
DROP COLUMN "fighterId",
ADD COLUMN     "fighter1Id" INTEGER NOT NULL,
ADD COLUMN     "fighter2Id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "FightStat" ADD CONSTRAINT "FightStat_fighter1Id_fkey" FOREIGN KEY ("fighter1Id") REFERENCES "Fighter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FightStat" ADD CONSTRAINT "FightStat_fighter2Id_fkey" FOREIGN KEY ("fighter2Id") REFERENCES "Fighter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
