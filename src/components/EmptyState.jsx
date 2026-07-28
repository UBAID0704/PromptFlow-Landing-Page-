import React from 'react';

export function EmptyState({
  icon = '📭',
  title = 'No Reviews Found',
  description = 'Be the first community member to leave a review above!',
}) {
  return (
    <div
      style={{
        padding: '2.5rem 1rem',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '12px',
        border: '1px dashed rgba(255, 255, 255, 0.1)',
        color: 'rgba(255, 255, 255, 0.6)',
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <h4 style={{ color: '#fff', margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{title}</h4>
      <p style={{ margin: 0, fontSize: '0.85rem' }}>{description}</p>
    </div>
  );
}