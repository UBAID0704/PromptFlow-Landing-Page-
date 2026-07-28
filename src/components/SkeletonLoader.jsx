import React from 'react';

export function SkeletonCard() {
  return (
    <div
      style={{
        padding: '1rem',
        borderRadius: '8px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        marginBottom: '0.75rem',
      }}
    >
      <div
        className="skeleton-pulse"
        style={{ width: '35%', height: '14px', borderRadius: '4px', marginBottom: '0.6rem' }}
      ></div>
      <div
        className="skeleton-pulse"
        style={{ width: '85%', height: '12px', borderRadius: '4px', marginBottom: '0.4rem' }}
      ></div>
      <div
        className="skeleton-pulse"
        style={{ width: '50%', height: '12px', borderRadius: '4px' }}
      ></div>

      <style>{`
        .skeleton-pulse {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}