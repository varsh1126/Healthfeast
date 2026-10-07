import React from 'react';

export default function MacroRing({
  label,
  current = 0,
  target = 100,
  unit = 'g',
  color = '#10b981',
  size = 110,
  strokeWidth = 9,
  icon: Icon
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeTarget = Math.max(1, target);
  const percentage = Math.min(100, Math.round((current / safeTarget) * 100));
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '12px',
      background: 'rgba(255, 255, 255, 0.75)',
      borderRadius: '16px',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      minWidth: '120px'
    }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          />
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          {Icon && <Icon size={14} color={color} style={{ marginBottom: '2px' }} />}
          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
            {Math.round(current)}
          </span>
          <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>
            /{Math.round(target)}{unit}
          </span>
        </div>
      </div>

      <div style={{ marginTop: '8px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
          {label}
        </div>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: color }}>
          {percentage}% fulfilled
        </div>
      </div>
    </div>
  );
}
