import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  href?: string | null;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Prefer white-friendly mark on dark backgrounds (same asset, still works). */
  variant?: 'default' | 'onDark';
};

const sizes = {
  sm: { icon: 44, text: 'text-lg' },
  md: { icon: 56, text: 'text-xl sm:text-2xl' },
  lg: { icon: 72, text: 'text-2xl sm:text-3xl' },
  xl: { icon: 96, text: 'text-3xl' },
};

export default function Logo({
  href = '/',
  className = '',
  showText = false,
  size = 'md',
  variant = 'default',
}: LogoProps) {
  const s = sizes[size];
  const content = (
    <span className={`inline-flex items-center gap-2.5 group ${className}`}>
      <span
        className={
          variant === 'onDark'
            ? 'inline-flex items-center justify-center rounded-2xl bg-white p-2 shadow-sm'
            : 'inline-flex'
        }
      >
        <Image
          src="/logo.png"
          alt="QuickDoctor"
          width={s.icon}
          height={s.icon}
          className="object-contain group-hover:scale-[1.03] transition-transform"
          priority
        />
      </span>
      {showText && (
        <span
          className={`${s.text} font-extrabold tracking-tight ${
            variant === 'onDark' ? 'text-white' : 'text-dark-slate dark:text-white'
          }`}
        >
          Quick<span className="text-primary">Doctor</span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex" aria-label="QuickDoctor home">
        {content}
      </Link>
    );
  }
  return content;
}
