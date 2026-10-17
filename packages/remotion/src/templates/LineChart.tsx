import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DataPoint {
  label: string;
  value: number;
}

export interface LineChartProps {
  title: string;
  data: DataPoint[];
  unit?: string;
  lineColor?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  title,
  data,
  unit = '',
  lineColor = '#38bdf8'
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const maxVal = Math.max(...data.map((d) => d.value), 10);
  const minVal = Math.min(...data.map((d) => d.value), 0);
  const range = maxVal - minVal || 1;

  const width = 1200;
  const height = 500;
  const padding = 60;

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(1, data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.value - minVal) / range) * (height - padding * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1]?.x} ${height - padding} L ${points[0]?.x} ${height - padding} Z`;

  const drawProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 }
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#090d16',
        padding: '80px',
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      <h2 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '40px', color: '#f8fafc' }}>
        {title}
      </h2>

      <div style={{ position: 'relative', width: `${width}px`, height: `${height}px`, margin: '0 auto' }}>
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = height - padding - pct * (height - padding * 2);
            return (
              <line
                key={idx}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#1e293b"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Area fill */}
          <path d={areaD} fill="url(#lineGrad)" opacity={drawProgress} />

          {/* Main animated line */}
          <path
            d={pathD}
            fill="none"
            stroke={lineColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="3000"
            strokeDashoffset={3000 * (1 - drawProgress)}
          />

          {/* Animated data points */}
          {points.map((p, idx) => {
            const dotSpring = spring({
              frame: frame - idx * 6 - 15,
              fps,
              config: { damping: 12, stiffness: 120 }
            });

            return (
              <g key={idx} opacity={dotSpring}>
                <circle cx={p.x} cy={p.y} r="8" fill="#090d16" stroke={lineColor} strokeWidth="4" />
                <text
                  x={p.x}
                  y={p.y - 18}
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="18"
                  fontWeight="700"
                >
                  {p.value}
                  {unit}
                </text>
                <text
                  x={p.x}
                  y={height - padding + 30}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="16"
                  fontWeight="600"
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </AbsoluteFill>
  );
};
