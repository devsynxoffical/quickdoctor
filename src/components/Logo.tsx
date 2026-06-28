import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  href?: string;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const sizes = {
  sm: { icon: 32, text: 'text-lg' },
  md: { icon: 36, text: 'text-xl sm:text-2xl' },
  lg: { icon: 48, text: 'text-2xl sm:text-3xl' },
};

export default function Logo({ href = '/', className = '', showText = true, size = 'md' }: LogoProps) {
  const s = sizes[size];
  const content = (
    <span className={`inline-flex items-center gap-2.5 group ${className}`}>
      <Image
        src="/logo.png"
        alt="QuickDoctor"
        width={s.icon}
        height={s.icon}
        className="rounded-lg group-hover:scale-105 transition-transform shadow-md shadow-primary/20"
        priority
      />
      {showText && (
        <span className={`${s.text} font-extrabold tracking-tight text-dark-slate dark:text-white`}>
          Quick<span className="text-primary">Doctor</span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }
  return content;
}
