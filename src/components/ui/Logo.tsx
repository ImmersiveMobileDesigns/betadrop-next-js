import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  showText?: boolean;
  href?: string;
  asLink?: boolean;
}

export default function Logo({ 
  className = '', 
  width = 40, 
  height = 40,
  showText = true,
  href = '/',
  asLink = true
}: LogoProps) {
  const content = (
    <>
      <div className="relative" style={{ width, height }}>
        <Image
          src="/images/logo/BetaDropLogo.png"
          alt="BetaDrop Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <span className="text-2xl font-bold text-white tracking-tight">
          BetaDrop
        </span>
      )}
    </>
  );

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {asLink ? (
        <Link href={href} className="flex items-center gap-2 transition-opacity hover:opacity-80">
          {content}
        </Link>
      ) : (
        <div className="flex items-center gap-2">
          {content}
        </div>
      )}
    </div>
  );
}
