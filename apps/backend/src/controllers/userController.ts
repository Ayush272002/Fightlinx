import prisma from "@repo/db/client";
import { SigninSchema, SignupSchema } from "@repo/zodtypes/user-types";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createUser = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const parsedData = SignupSchema.safeParse(body);

    if (!parsedData.success) {
      return res.status(411).json({
        message: parsedData.error.errors.map((err) => err.message).join(", "),
      });
    }

    const userExists = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (userExists) {
      return res.status(403).json({
        message: "User already exists",
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

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        message: "Internal server error: JWT secret is not defined",
      });
    }
    const token = jwt.sign(
      {
        id: user.id,
      },
      jwtSecret,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      jwt: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const signin = async (req: Request, res: Response) => {
  const body = req.body;
  const parsedData = SigninSchema.safeParse(body);

  if (!parsedData.success) {
    return res.status(411).json({
      message: parsedData.error.errors.map((err) => err.message).join(", "),
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: parsedData.data.email,
    },
  });

  if (!user) {
    return res.status(403).json({
      message: "User not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(
    parsedData.data.password,
    user.password,
  );

  if (!isPasswordValid) {
    return res.status(403).json({
      message: "Invalid credentials",
    });
  }

  // sign the jwt
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({
      message: "Internal server error: JWT secret is not defined",
    });
  }
  const token = jwt.sign(
    {
      id: user.id,
    },
    jwtSecret,
    { expiresIn: "7d" },
  );

  return res.status(200).json({
    jwt: token,
  });
};

export { createUser, signin };
