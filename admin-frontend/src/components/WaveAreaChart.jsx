import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { ArrowUp } from 'lucide-react';

// Custom Tooltip component matching exact screenshot badge overlay ($451 style)
const CustomWaveTooltip = ({ active, payload, label, unit = '₹' }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-[#121e19]/90 backdrop-blur-md border border-[#38bdf8]/40 px-3 py-1.5 rounded-xl shadow-xl text-center transform -translate-y-4 animate-in fade-in zoom-in-95 duration-150">
        <span className="text-xs font-bold text-[#38bdf8] flex items-center justify-center gap-0.5">
          <span className="text-[10px] opacity-80">{unit}</span>
          <span>{typeof val === 'number' ? val.toLocaleString() : val}</span>
        </span>
        <p className="text-[10px] text-[#8ba398] font-medium">{label}</p>
      </div>
    );
  }
  return null;
};

// Custom X-Axis Tick renderer to highlight active tick
const CustomXAxisTick = ({ x, y, payload, activeIndex }) => {
  const isActive = activeIndex === payload.index;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={14}
        textAnchor="middle"
        fontSize={11}
        fontWeight={isActive ? '700' : '500'}
        fill={isActive ? '#38bdf8' : '#6b8577'}
        className="transition-colors duration-200 cursor-pointer"
      >
        {payload.value}
      </text>
    </g>
  );
};

export const WaveAreaChart = ({
  data,
  dataKey = 'value',
  xAxisKey = 'date',
  color = '#38bdf8',
  gradientId = 'waveBlueGradient',
  unit = '₹',
  height = 240,
  theme = 'dark',
}) => {
  const [activeIndex, setActiveIndex] = useState(1); // default active index (Feb)

  const isLight = theme === 'light';
  const axisColor = isLight ? '#3b5247' : '#577064';

  const defaultData = data || [
    { date: 'Jan', value: 110 },
    { date: 'Feb', value: 451 },
    { date: 'Mar', value: 370 },
    { date: 'Apr', value: 280 },
    { date: 'May', value: 390 },
    { date: 'Jun', value: 480 },
  ];

  return (
    <div className="w-full relative">
      {/* Top Left Y-Axis Arrow Indicator */}
      <div className="absolute top-0 left-0 flex items-center gap-1 text-[11px] text-[#577064] font-mono z-10">
        <ArrowUp size={14} className="text-[#38bdf8]" />
      </div>

      <div style={{ height: `${height}px` }} className="w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={defaultData}
            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
            onMouseMove={(state) => {
              if (state && state.activeTooltipIndex !== undefined) {
                setActiveIndex(state.activeTooltipIndex);
              }
            }}
          >
            <defs>
              {/* Ultra smooth wave gradient matching screenshot */}
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.45} />
                <stop offset="50%" stopColor={color} stopOpacity={0.18} />
                <stop offset="100%" stopColor={color} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey={xAxisKey}
              axisLine={false}
              tickLine={false}
              tick={(props) => (
                <CustomXAxisTick {...props} activeIndex={activeIndex} />
              )}
            />

            <YAxis
              stroke={axisColor}
              fontSize={11}
              axisLine={false}
              tickLine={false}
              ticks={[100, 200, 300, 400, 500]}
              domain={[0, 520]}
            />

            {/* Light Vertical Guideline passing through active point */}
            <Tooltip
              content={<CustomWaveTooltip unit={unit} />}
              cursor={{
                stroke: isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.25)',
                strokeWidth: 1.5,
              }}
            />

            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{
                r: 6,
                fill: '#ffffff',
                stroke: color,
                strokeWidth: 3,
                className: 'drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
