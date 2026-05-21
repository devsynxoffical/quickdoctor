import { Request, Response } from 'express';
import prisma from '../config/db';
import { getPrismaErrorMessage } from '../lib/prismaErrors';

export const listSpecialties = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.specialtyCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(categories);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const adminListSpecialties = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.specialtyCategory.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    res.json(categories);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const adminCreateSpecialty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, slug, description, icon, sortOrder } = req.body;
    const category = await prisma.specialtyCategory.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description,
        icon,
        sortOrder: sortOrder ?? 0,
      },
    });
    res.status(201).json(category);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const adminUpdateSpecialty = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const category = await prisma.specialtyCategory.update({
      where: { id },
      data: req.body,
    });
    res.json(category);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};
