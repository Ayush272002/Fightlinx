import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import csvParser from 'csv-parser';
import bcrypt from 'bcrypt';
import path from 'path';

const prisma = new PrismaClient();

interface FightCSV {
  Fight_ID: number;
  Event: string;
  Location: string;
  Fighter_1_Name: string;
  Fighter_2_Name: string;
  Fighter_1_Age: number;
  Fighter_2_Age: number;
  'Fighter_1_Height (cm)': number;
  'Fighter_2_Height (cm)': number;
  'Fighter_1_Reach (cm)': number;
  'Fighter_2_Reach (cm)': number;
  Fighter_1_Gender: string;
  Fighter_2_Gender: string;
  'Fighter_1_Weight (kg)': number;
  'Fighter_2_Weight (kg)': number;
  Fighter_1_Style: string;
  Fighter_2_Style: string;
  Fighter_1_Gym: string;
  Fighter_2_Gym: string;
  Rounds: number;
  Round_End: number;
  Time_End: string;
  Outcome: string;
  Winner: string;
  Method: string;
  'Significant_Strikes_Landed (F1)': number;
  'Significant_Strikes_Landed (F2)': number;
  'Takedowns_Landed (F1)': number;
  'Takedowns_Landed (F2)': number;
  'Knockdowns (F1)': number;
  'Knockdowns (F2)': number;
}

async function genPass() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Test@1234', salt);
  return hashedPassword;
}

async function main() {
  const fightData: FightCSV[] = [];

  const pass = await genPass();
  const filePath = path.join(__dirname, '..', 'seed.csv');

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => fightData.push(row))
    .on('end', async () => {
      console.log('CSV file successfully processed');

      for (const fight of fightData) {
        const fighter1Email =
          `${fight.Fighter_1_Name.replace(/\s+/g, '.')}`.toLowerCase() +
          '@fighter.com';

        const fighter2Email =
          `${fight.Fighter_2_Name.replace(/\s+/g, '.')}`.toLowerCase() +
          '@fighter.com';

        let user1 = await prisma.user.findUnique({
          where: { email: fighter1Email },
        });
        if (!user1) {
          user1 = await prisma.user.create({
            data: {
              email: fighter1Email,
              name: fight.Fighter_1_Name,
              password: pass,
              fighters: {
                create: {
                  name: fight.Fighter_1_Name,
                  age: parseInt(fight.Fighter_1_Age.toString(), 10),
                  heightCm: parseFloat(
                    fight['Fighter_1_Height (cm)'].toString()
                  ),
                  reachCm: parseFloat(fight['Fighter_1_Reach (cm)'].toString()),
                  gender: fight.Fighter_1_Gender,
                  weightKg: parseFloat(
                    fight['Fighter_1_Weight (kg)'].toString()
                  ),
                  fightingStyle: fight.Fighter_1_Style,
                  gym: fight.Fighter_1_Gym,
                },
              },
            },
            include: { fighters: true },
          });
        }

        let fighter1 = await prisma.fighter.findFirst({
          where: {
            userId: user1.id,
            name: fight.Fighter_1_Name,
          },
        });

        if (!fighter1) {
          console.error(`Fighter 1 not found for fight ID ${fight.Fight_ID}`);
          continue;
        }

        let user2 = await prisma.user.findUnique({
          where: { email: fighter2Email },
        });
        if (!user2) {
          user2 = await prisma.user.create({
            data: {
              email: fighter2Email,
              name: fight.Fighter_2_Name,
              password: pass,
              fighters: {
                create: {
                  name: fight.Fighter_2_Name,
                  age: parseInt(fight.Fighter_2_Age.toString(), 10),
                  heightCm: parseFloat(
                    fight['Fighter_2_Height (cm)'].toString()
                  ),
                  reachCm: parseFloat(fight['Fighter_2_Reach (cm)'].toString()),
                  gender: fight.Fighter_2_Gender,
                  weightKg: parseFloat(
                    fight['Fighter_2_Weight (kg)'].toString()
                  ),
                  fightingStyle: fight.Fighter_2_Style,
                  gym: fight.Fighter_2_Gym,
                },
              },
            },
            include: { fighters: true },
          });
        }

        let fighter2 = await prisma.fighter.findFirst({
          where: {
            userId: user2.id,
            name: fight.Fighter_2_Name,
          },
        });

        if (!fighter2) {
          console.error(`Fighter 2 not found for fight ID ${fight.Fight_ID}`);
          continue;
        }

        await prisma.fightStat.create({
          data: {
            fightId: parseInt(fight.Fight_ID.toString(), 10),
            event: fight.Event,
            location: fight.Location,
            fighter1Id: fighter1.id, // Use fighter1Id
            fighter2Id: fighter2.id, // Use fighter2Id
            fighter1Age: parseInt(fight.Fighter_1_Age.toString(), 10),
            fighter2Age: parseInt(fight.Fighter_2_Age.toString(), 10),
            fighter1HeightCm: parseFloat(
              fight['Fighter_1_Height (cm)'].toString()
            ),
            fighter2HeightCm: parseFloat(
              fight['Fighter_2_Height (cm)'].toString()
            ),
            fighter1ReachCm: parseFloat(
              fight['Fighter_1_Reach (cm)'].toString()
            ),
            fighter2ReachCm: parseFloat(
              fight['Fighter_2_Reach (cm)'].toString()
            ),
            fighter1Gender: fight.Fighter_1_Gender,
            fighter2Gender: fight.Fighter_2_Gender,
            fighter1WeightKg: parseFloat(
              fight['Fighter_1_Weight (kg)'].toString()
            ),
            fighter2WeightKg: parseFloat(
              fight['Fighter_2_Weight (kg)'].toString()
            ),
            fighter1Style: fight.Fighter_1_Style,
            fighter2Style: fight.Fighter_2_Style,
            fighter1Gym: fight.Fighter_1_Gym,
            fighter2Gym: fight.Fighter_2_Gym,
            rounds: parseInt(fight.Rounds.toString(), 10),
            roundEnd: parseInt(fight.Round_End.toString(), 10),
            timeEnd: fight.Time_End,
            outcome: fight.Outcome,
            winner: fight.Winner,
            method: fight.Method,
            significantStrikesF1: parseInt(
              fight['Significant_Strikes_Landed (F1)'].toString(),
              10
            ),
            significantStrikesF2: parseInt(
              fight['Significant_Strikes_Landed (F2)'].toString(),
              10
            ),
            takedownsLandedF1: parseInt(
              fight['Takedowns_Landed (F1)'].toString(),
              10
            ),
            takedownsLandedF2: parseInt(
              fight['Takedowns_Landed (F2)'].toString(),
              10
            ),
            knockdownsF1: parseInt(fight['Knockdowns (F1)'].toString(), 10),
            knockdownsF2: parseInt(fight['Knockdowns (F2)'].toString(), 10),
          },
        });
      }

      console.log('Seeding completed.');
      await prisma.$disconnect();
    });
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
