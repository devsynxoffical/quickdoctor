import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { getPrismaErrorMessage } from '../lib/prismaErrors';
import { applyCoupon } from '../services/couponService';

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

export const listCoupons = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(coupons);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const createCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minAmountCents,
      maxUses,
      expiresAt,
      isActive,
    } = req.body;

    if (!code || !discountType || discountValue == null) {
      res.status(400).json({ message: 'code, discountType, and discountValue are required' });
      return;
    }

    if (!['PERCENT', 'FIXED'].includes(discountType)) {
      res.status(400).json({ message: 'discountType must be PERCENT or FIXED' });
      return;
    }

    const value = Number(discountValue);
    if (!Number.isFinite(value) || value <= 0) {
      res.status(400).json({ message: 'discountValue must be a positive number' });
      return;
    }

    if (discountType === 'PERCENT' && (value < 1 || value > 100)) {
      res.status(400).json({ message: 'Percent discount must be between 1 and 100' });
      return;
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: normalizeCode(String(code)),
        description: description || null,
        discountType: discountType as 'PERCENT' | 'FIXED',
        discountValue: Math.floor(value),
        minAmountCents: minAmountCents != null ? Math.floor(Number(minAmountCents)) : null,
        maxUses: maxUses != null ? Math.floor(Number(maxUses)) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: isActive !== false,
      },
    });

    res.status(201).json(coupon);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const updateCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      description,
      discountType,
      discountValue,
      minAmountCents,
      maxUses,
      expiresAt,
      isActive,
    } = req.body;

    const data: Record<string, unknown> = {};
    if (description !== undefined) data.description = description || null;
    if (discountType !== undefined) data.discountType = discountType;
    if (discountValue != null) data.discountValue = Math.floor(Number(discountValue));
    if (minAmountCents !== undefined) {
      data.minAmountCents = minAmountCents != null ? Math.floor(Number(minAmountCents)) : null;
    }
    if (maxUses !== undefined) {
      data.maxUses = maxUses != null ? Math.floor(Number(maxUses)) : null;
    }
    if (expiresAt !== undefined) {
      data.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    const coupon = await prisma.coupon.update({
      where: { id: String(req.params.id) },
      data,
    });

    res.json(coupon);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const deleteCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.coupon.delete({ where: { id: String(req.params.id) } });
    res.json({ message: 'Coupon deleted' });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const validateCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code, amountCents } = req.body;
    if (!code || amountCents == null) {
      res.status(400).json({ message: 'code and amountCents are required' });
      return;
    }

    const result = await applyCoupon(String(code), Math.floor(Number(amountCents)));
    res.json(result);
  } catch (error: unknown) {
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Invalid coupon',
    });
  }
};
