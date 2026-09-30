import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

// 1. Eye of Agamotto Icon
export const EyeIcon: React.FC<IconProps> = ({
  size = 16,
  strokeWidth = 1.5,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Outer eye contour */}
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
    {/* Concentric aperture rings */}
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    {/* Mystic radial ticks */}
    <path d="M12 3v1.5M12 19.5V21M3.5 12H5M19 12h1.5" strokeWidth={1} />
  </svg>
);

// 2. Mystic Seal Icon
export const SealIcon: React.FC<IconProps> = ({
  size = 16,
  strokeWidth = 1.5,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="6" strokeDasharray="2 2" strokeWidth={1} />
    <polygon points="12,5 15,10 20,10 16,14 18,19 12,16 6,19 8,14 4,10 9,10" strokeWidth={1} />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

// 3. Precision Hash Glyph Icon
export const HashIcon: React.FC<IconProps> = ({
  size = 16,
  strokeWidth = 1.5,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" />
    <line x1="16" y1="3" x2="14" y2="21" />
    <circle cx="9" cy="9" r="1" fill="currentColor" />
    <circle cx="15" cy="15" r="1" fill="currentColor" />
  </svg>
);

// 4. Temporal Hourglass Icon
export const HourglassIcon: React.FC<IconProps> = ({
  size = 16,
  strokeWidth = 1.5,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M5 3h14M5 21h14" />
    <path d="M6 3v4c0 3 3 5 6 5s6-2 6-5V3" />
    <path d="M6 21v-4c0-3 3-5 6-5s6 2 6 5v4" />
    {/* Reversed time sand dots */}
    <circle cx="12" cy="9" r="0.75" fill="currentColor" />
    <circle cx="12" cy="15" r="0.75" fill="currentColor" />
    <circle cx="10.5" cy="16.5" r="0.75" fill="currentColor" />
    <circle cx="13.5" cy="16.5" r="0.75" fill="currentColor" />
  </svg>
);

// 5. Energy Thread Link Icon
export const ThreadIcon: React.FC<IconProps> = ({
  size = 16,
  strokeWidth = 1.5,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="5" cy="6" r="3" />
    <circle cx="19" cy="18" r="3" />
    <path d="M8 8.5 L16 15.5" strokeDasharray="2 2" />
    <polygon points="12,10 14,12 12,14 10,12" fill="currentColor" strokeWidth={1} />
  </svg>
);

// 6. Mystic Sigil Spell Ring Icon
export const SigilIcon: React.FC<IconProps> = ({
  size = 16,
  strokeWidth = 1.5,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <line x1="12" y1="3" x2="12" y2="6" strokeWidth={1} />
    <line x1="12" y1="18" x2="12" y2="21" strokeWidth={1} />
    <line x1="3" y1="12" x2="6" y2="12" strokeWidth={1} />
    <line x1="18" y1="12" x2="21" y2="12" strokeWidth={1} />
    <polygon points="12,7 15,12 12,17 9,12" strokeWidth={0.75} />
  </svg>
);

// 7. Temporal Lock Vault Icon
export const LockIcon: React.FC<IconProps> = ({
  size = 16,
  strokeWidth = 1.5,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="4" y="10" width="16" height="12" rx="1" />
    <path d="M7 10V6a5 5 0 0 1 10 0v4" />
    {/* Inner time sigil keyhole */}
    <circle cx="12" cy="15" r="1.75" fill="currentColor" />
    <line x1="12" y1="16.75" x2="12" y2="19" />
    {/* Corner crop indicators */}
    <path d="M6 12h1M17 12h1" strokeWidth={1} />
  </svg>
);

// 8. Rewind Time Loop Icon
export const RewindIcon: React.FC<IconProps> = ({
  size = 16,
  strokeWidth = 1.5,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 4A8 8 0 1 0 20 12" />
    <polyline points="12 1 12 6 7 3" />
    <circle cx="12" cy="12" r="3" strokeDasharray="1.5 1.5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

// 9. Registration Crosshair Mark
export const RegistrationMark: React.FC<IconProps> = ({
  size = 12,
  strokeWidth = 1,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    className={className}
    {...props}
  >
    <circle cx="6" cy="6" r="4.5" />
    <line x1="6" y1="0" x2="6" y2="12" />
    <line x1="0" y1="6" x2="12" y2="6" />
  </svg>
);
