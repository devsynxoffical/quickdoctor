import { Star } from 'lucide-react';

type DoctorStarsProps = {
  averageRating?: number | null;
  reviewCount?: number;
  className?: string;
};

export default function DoctorStars({
  averageRating,
  reviewCount = 0,
  className = '',
}: DoctorStarsProps) {
  if (averageRating == null || reviewCount === 0) {
    return (
      <span className={`text-xs font-bold text-slate-400 ${className}`}>No reviews yet</span>
    );
  }

  const label = `${averageRating.toFixed(1)} out of 5, ${reviewCount} review${reviewCount === 1 ? '' : 's'}`;

  return (
    <div
      className={`flex items-center gap-1.5 ${className}`}
      role="img"
      aria-label={label}
      title={label}
    >
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 shrink-0" />
      <span className="text-sm font-black text-dark-slate dark:text-white">
        {averageRating.toFixed(1)}
      </span>
      <span className="text-xs font-bold text-slate-400">({reviewCount})</span>
    </div>
  );
}
