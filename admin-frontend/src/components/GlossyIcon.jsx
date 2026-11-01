import React from 'react';

export const GlossyIcon = ({
  icon: Icon,
  variant = 'emerald',
  size = 20,
  containerSize = 'w-10 h-10',
  className = '',
}) => {
  const variantStyles = {
    emerald: {
      bg: 'bg-gradient-to-br from-[#00FF87] via-[#00D26A] to-[#047857]',
      glow: 'shadow-[0_4px_16px_rgba(0,210,106,0.4)]',
      border: 'border-white/40',
      text: 'text-black',
    },
    amber: {
      bg: 'bg-gradient-to-br from-[#FCD34D] via-[#F59E0B] to-[#B45309]',
      glow: 'shadow-[0_4px_16px_rgba(245,158,11,0.4)]',
      border: 'border-white/40',
      text: 'text-black',
    },
    sky: {
      bg: 'bg-gradient-to-br from-[#38BDF8] via-[#0284C7] to-[#0369A1]',
      glow: 'shadow-[0_4px_16px_rgba(2,132,199,0.4)]',
      border: 'border-white/40',
      text: 'text-white',
    },
    rose: {
      bg: 'bg-gradient-to-br from-[#FB7185] via-[#E11D48] to-[#9F1239]',
      glow: 'shadow-[0_4px_16px_rgba(225,29,72,0.4)]',
      border: 'border-white/40',
      text: 'text-white',
    },
    indigo: {
      bg: 'bg-gradient-to-br from-[#818CF8] via-[#6366F1] to-[#4338CA]',
      glow: 'shadow-[0_4px_16px_rgba(99,102,241,0.4)]',
      border: 'border-white/40',
      text: 'text-white',
    },
    purple: {
      bg: 'bg-gradient-to-br from-[#C084FC] via-[#9333EA] to-[#6B21A8]',
      glow: 'shadow-[0_4px_16px_rgba(147,51,234,0.4)]',
      border: 'border-white/40',
      text: 'text-white',
    },
    cyan: {
      bg: 'bg-gradient-to-br from-[#22D3EE] via-[#0891B2] to-[#155E75]',
      glow: 'shadow-[0_4px_16px_rgba(8,145,178,0.4)]',
      border: 'border-white/40',
      text: 'text-white',
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.emerald;

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-xl ${containerSize} ${currentVariant.bg} ${currentVariant.glow} border ${currentVariant.border} backdrop-blur-md transition-all duration-300 group-hover:scale-105 overflow-hidden ${className}`}
    >
      {/* Specular Top Gloss Highlight Overlay */}
      <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/50 via-white/20 to-transparent pointer-events-none rounded-t-xl" />

      {/* Radial Glass Reflection */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-white/30 rounded-full blur-sm pointer-events-none" />

      {/* Render Icon */}
      {Icon && (
        <Icon
          size={size}
          className={`relative z-10 ${currentVariant.text} drop-shadow-sm transition-transform duration-200 group-hover:scale-110`}
        />
      )}
    </div>
  );
};
