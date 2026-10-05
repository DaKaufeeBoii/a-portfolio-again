import React from 'react';

interface KatamariIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  animated?: boolean;
}

export const KatamariIcon: React.FC<KatamariIconProps> = ({
  size = 32,
  className = '',
  style = {},
  animated = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        filter: 'drop-shadow(0 4px 10px rgba(245, 166, 35, 0.25))',
        animation: animated ? 'spin-slow 12s linear infinite' : undefined,
        ...style,
      }}
    >
      <defs>
        {/* Core sphere gradient */}
        <radialGradient id="katamari-core" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#EEF2F6" />
          <stop offset="85%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#94A3B8" />
        </radialGradient>

        {/* Red / Coral knob */}
        <linearGradient id="knob-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF7676" />
          <stop offset="100%" stopColor="#E11D48" />
        </linearGradient>

        {/* Orange knob */}
        <linearGradient id="knob-orange" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDBA74" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>

        {/* Yellow knob */}
        <linearGradient id="knob-yellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>

        {/* Green knob */}
        <linearGradient id="knob-green" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>

        {/* Blue knob */}
        <linearGradient id="knob-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        {/* Light Blue ring */}
        <linearGradient id="knob-cyan" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
      </defs>

      {/* Background knobs (peeking from behind) */}
      {/* Top knob */}
      <circle cx="50" cy="18" r="14" fill="url(#knob-red)" />
      <circle cx="50" cy="18" r="9" fill="#FFA4A4" />

      {/* Top right knob */}
      <circle cx="76" cy="30" r="12" fill="url(#knob-green)" />

      {/* Top left knob */}
      <circle cx="24" cy="32" r="12" fill="url(#knob-red)" />

      {/* Bottom left knob */}
      <circle cx="28" cy="74" r="13" fill="url(#knob-yellow)" />
      <circle cx="28" cy="74" r="8" fill="#FEF9C3" />

      {/* Bottom right knob */}
      <circle cx="72" cy="74" r="13" fill="url(#knob-blue)" />
      <circle cx="72" cy="74" r="8" fill="#BFDBFE" />

      {/* Core Sphere */}
      <circle cx="50" cy="50" r="34" fill="url(#katamari-core)" />

      {/* Facet polygon shadow lines for classic low-poly Katamari look */}
      <polygon points="50,16 65,35 50,50 35,35" fill="rgba(255,255,255,0.4)" />
      <polygon points="65,35 84,50 65,65 50,50" fill="rgba(0,0,0,0.06)" />
      <polygon points="35,35 50,50 35,65 16,50" fill="rgba(255,255,255,0.25)" />
      <polygon points="50,50 65,65 50,84 35,65" fill="rgba(0,0,0,0.08)" />

      {/* Front-facing Center-Right Blue Knob (with iconic concentric ring) */}
      <circle cx="60" cy="52" r="15" fill="url(#knob-blue)" />
      <circle cx="60" cy="52" r="10" fill="#93C5FD" />
      <circle cx="60" cy="52" r="6" fill="#1D4ED8" />

      {/* Left Orange Knob */}
      <circle cx="26" cy="48" r="12" fill="url(#knob-orange)" />
      <circle cx="26" cy="48" r="7" fill="#FED7AA" />

      {/* Center Shine */}
      <circle cx="44" cy="40" r="4" fill="rgba(255,255,255,0.85)" />
    </svg>
  );
};
