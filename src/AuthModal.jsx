import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with your actual admin password logic
    if (password === 'admin123') {
      onAuthSuccess();
      setError('');
      setPassword('');
      onClose();
    } else {
      setError('Invalid password. Access denied.');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#111418', border: '1px solid #374151', padding: '2rem', borderRadius: '12px', width: '320px', color: '#fff' }}>
        <h3 style={{ marginTop: 0 }}>🔐 Admin Password Required</h3>
        {error && <p style={{ color: '#f87171', fontSize: '0.85rem' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #374151', background: '#1f2937', color: '#fff', marginBottom: '1rem', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #374151', color: '#ccc', borderRadius: '6px', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" style={{ padding: '0.5rem 1rem', background: '#6366f1', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}