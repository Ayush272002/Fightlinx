-- CreateTable
CREATE TABLE "UpcomingMatch" (
    "id" SERIAL NOT NULL,
    "fighter1Id" INTEGER NOT NULL,
    "fighter2Id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "matchDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UpcomingMatch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UpcomingMatch" ADD CONSTRAINT "UpcomingMatch_fighter1Id_fkey" FOREIGN KEY ("fighter1Id") REFERENCES "Fighter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpcomingMatch" ADD CONSTRAINT "UpcomingMatch_fighter2Id_fkey" FOREIGN KEY ("fighter2Id") REFERENCES "Fighter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
