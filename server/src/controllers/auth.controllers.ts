// src/controllers/auth.controllers.ts
import { RequestHandler, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const handleGoogleAuth: RequestHandler = async (req, res, next) => {
  const { name, email, image } = req.body;

  if (!email || !name) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { name, image },
      create: { name, email, image },
    });
    res.status(200).json({ user });
    return;
  } catch (err) {
    console.error("Prisma error:", err);
    next(err);
    return;
  }
};
