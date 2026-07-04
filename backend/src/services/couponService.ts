import prisma from '../config/db';

export type CouponApplyResult = {
  couponId: string;
  code: string;
  originalCents: number;
  discountCents: number;
  finalCents: number;
};

export async function applyCoupon(
  code: string | undefined,
  originalCents: number
): Promise<CouponApplyResult> {
  if (!code?.trim()) {
    return {
      couponId: '',
      code: '',
      originalCents,
      discountCents: 0,
      finalCents: originalCents,
    };
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!coupon || !coupon.isActive) {
    throw new Error('Invalid or inactive coupon code');
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw new Error('This coupon has expired');
  }

  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
    throw new Error('This coupon has reached its usage limit');
  }

  if (coupon.minAmountCents != null && originalCents < coupon.minAmountCents) {
    throw new Error(
      `Minimum order amount is €${(coupon.minAmountCents / 100).toFixed(2)} for this coupon`
    );
  }

  let discountCents = 0;
  if (coupon.discountType === 'PERCENT') {
    discountCents = Math.floor((originalCents * coupon.discountValue) / 100);
  } else {
    discountCents = coupon.discountValue;
  }

  discountCents = Math.min(discountCents, originalCents);
  const finalCents = Math.max(0, originalCents - discountCents);

  return {
    couponId: coupon.id,
    code: coupon.code,
    originalCents,
    discountCents,
    finalCents,
  };
}

export async function incrementCouponUsage(couponId: string | null | undefined) {
  if (!couponId) return;
  await prisma.coupon.update({
    where: { id: couponId },
    data: { usedCount: { increment: 1 } },
  });
}
