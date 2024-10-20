import prisma from '@repo/db/client';
import { SigninSchema, SignupSchema } from '@repo/zodtypes/user-types';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createUser = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const parsedData = SignupSchema.safeParse(body);

    if (!parsedData.success) {
      return res.status(411).json({
        message: parsedData.error.errors.map((err) => err.message).join(', '),
      });
    }

    const userExists = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (userExists) {
      return res.status(403).json({
        message: 'User already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(parsedData.data.password, salt);

    const user = await prisma.user.create({
      data: {
        name: parsedData.data.name,
        email: parsedData.data.email,
        password: hashedPassword,
      },
    });

    await prisma.fighter.create({
      data: {
        name: user.name,
        age: 18,
        heightCm: 0,
        reachCm: 0,
        gender: 'Unknown',
        weightKg: 0,
        fightingStyle: 'Unknown',
        gym: 'None',
        userId: user.id,
      },
    });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        message: 'Internal server error: JWT secret is not defined',
      });
    }
    const token = jwt.sign(
      {
        id: user.id,
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      jwt: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const signin = async (req: Request, res: Response) => {
  const body = req.body;
  const parsedData = SigninSchema.safeParse(body);

  if (!parsedData.success) {
    return res.status(411).json({
      message: parsedData.error.errors.map((err) => err.message).join(', '),
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: parsedData.data.email,
    },
  });

  if (!user) {
    return res.status(403).json({
      message: 'User not found',
    });
  }

  const isPasswordValid = await bcrypt.compare(
    parsedData.data.password,
    user.password
  );

  if (!isPasswordValid) {
    return res.status(403).json({
      message: 'Invalid credentials',
    });
  }

  // sign the jwt
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({
      message: 'Internal server error: JWT secret is not defined',
    });
  }
  const token = jwt.sign(
    {
      id: user.id,
    },
    jwtSecret,
    { expiresIn: '7d' }
  );

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    jwt: token,
  });
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(403).json({
        message: 'Unauthorized',
      });
    }

    const fighter = await prisma.fighter.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!fighter) {
      return res.status(404).json({
        message: 'Fighter profile not found',
      });
    }

    const {
      name,
      age,
      heightCm,
      reachCm,
      weightKg,
      fightingStyle,
      gym,
      gender,
    } = req.body.payload;

    // console.log(req.body);

    await prisma.fighter.update({
      where: {
        id: fighter.id,
      },
      data: {
        name: name,
        age: Number(age),
        heightCm: Number(heightCm),
        reachCm: Number(reachCm),
        gender: gender,
        weightKg: Number(weightKg),
        fightingStyle: fightingStyle,
        gym: gym,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({
      message: 'Fighter profile updated',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(403).json({
        message: 'Unauthorized',
      });
    }

    const fighter = await prisma.fighter.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!fighter) {
      return res.status(404).json({
        message: 'Fighter profile not found',
      });
    }

    return res.status(200).json({
      data: {
        name: fighter.name,
        age: fighter.age,
        gender: fighter.gender,
        height: fighter.heightCm,
        weight: fighter.weightKg,
        reach: fighter.reachCm,
        style: fighter.fightingStyle,
        gym: fighter.gym,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const quickStats = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(403).json({
        message: 'Unauthorized',
      });
    }
    const userCount = await prisma.user.count();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSignupsCount = await prisma.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    return res.status(200).json({
      data: {
        totalFighters: userCount,
        recentSignups: recentSignupsCount,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const getUpcomingMatches = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(403).json({
        message: 'Unauthorized',
      });
    }

    const fighter = await prisma.fighter.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!fighter) {
      return res.status(404).json({
        message: 'Fighter profile not found',
      });
    }

    const upcomingMatches = await prisma.upcomingMatch.findMany({
      where: {
        OR: [
          {
            fighter1Id: fighter.id,
          },
          {
            fighter2Id: fighter.id,
          },
        ],
      },
      include: {
        fighter1: true,
        fighter2: true,
      },
    });

    const formattedMatches = upcomingMatches.map((match) => ({
      matchId: match.id,
      status: match.status,
      matchDate: match.matchDate,
      fighter1Name: match.fighter1.name,
      fighter2Name: match.fighter2.name,
    }));

    return res.status(200).json({
      data: formattedMatches,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export {
  createUser,
  signin,
  updateUser,
  getProfile,
  quickStats,
  getUpcomingMatches,
};
