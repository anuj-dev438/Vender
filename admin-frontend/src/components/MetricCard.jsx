import React from 'react';
import {
  Car,
  Calendar,
  Key,
  Clock,
  IndianRupee,
  Users,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { GlossyIcon } from './GlossyIcon';

const iconMap = {
  Car,
  Calendar,
  Key,
  Clock,
  IndianRupee,
  Users,
};

const variantMap = {
  Car: 'emerald',
  Calendar: 'rose',
  Key: 'emerald',
  Clock: 'sky',
  IndianRupee: 'amber',
  Users: 'indigo',
};

export const MetricCard = (props) => {
  const m = props.metric || props;
  const IconComponent = props.icon || iconMap[m.iconName] || Car;
  const glossyVariant = props.variant || variantMap[m.iconName] || 'emerald';
  const isUp = m.changeType === 'up' || m.isPositive !== false;

  return (
    <div className="bg-[#121e19] border border-[#1c3229] rounded-2xl p-4 hover:border-[#00D26A]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#00D26A]/10 group flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <GlossyIcon
          icon={IconComponent}
          variant={glossyVariant}
          size={19}
          containerSize="w-10 h-10"
        />
        <span className="text-xs text-[#8ba398] font-medium">{m.title}</span>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">
          {m.value}
        </h2>

        <div className="flex items-center gap-1.5 text-xs">
          <span
            className={`flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded-md ${
              isUp
                ? 'bg-[#00D26A]/15 text-[#00D26A]'
                : 'bg-rose-500/15 text-rose-400'
            }`}
          >
            {isUp ? (
              <TrendingUp size={13} />
            ) : (
              <TrendingDown size={13} />
            )}
            <span>{m.change}</span>
          </span>
          <span className="text-[#577064] truncate">{m.subtitle}</span>
        </div>
      </div>
    </div>
  );
};
