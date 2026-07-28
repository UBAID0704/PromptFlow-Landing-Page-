import React from 'react';
import { useApp } from './context/AppContext.jsx';

function Navbar() {
  const { 
    user, 
    activeTab, 
    setActiveTab, 
    handleLogout, 
    isAdminView, 
    setIsAdminView 
  } = useApp();

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem 2rem', 
      background: 'rgba(10, 12, 16, 0.8)', 
      borderBottom: '1px solid rgba(255,255,255,0.08)', 
      position: 'sticky', 
      top: 0, 
      zIndex: 100, 
      backdropFilter: 'blur(10px)' 
    }}>
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} 
        onClick={() => { setActiveTab('landing'); setIsAdminView(false); }}
      >
        <span style={{ fontSize: '1.25rem' }}>⚡</span>
        <strong style={{ color: '#fff', fontSize: '1.1rem' }}>AI Flow</strong>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button 
          onClick={() => { setActiveTab('landing'); setIsAdminView(false); }} 
          style={{ background: 'transparent', border: 'none', color: activeTab === 'landing' && !isAdminView ? '#818cf8' : 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.9rem' }}
        >
          Home
        </button>

        <button 
          onClick={() => { setActiveTab('upload'); setIsAdminView(false); }} 
          style={{ background: 'transparent', border: 'none', color: activeTab === 'upload' ? '#818cf8' : 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.9rem' }}
        >
          Upload
        </button>

        <button 
          onClick={() => { setActiveTab('analytics'); setIsAdminView(false); }} 
          style={{ background: 'transparent', border: 'none', color: activeTab === 'analytics' ? '#818cf8' : 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.9rem' }}
        >
          Analytics
        </button>

        <button 
          onClick={() => { setActiveTab('feedback'); setIsAdminView(false); }} 
          style={{ background: 'transparent', border: 'none', color: activeTab === 'feedback' ? '#818cf8' : 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.9rem' }}
        >
          Feedback
        </button>

        {user ? (
          <>
            <button 
              onClick={() => { setActiveTab('dashboard'); setIsAdminView(false); }} 
              style={{ background: 'transparent', border: 'none', color: activeTab === 'dashboard' ? '#818cf8' : 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              👤 Dashboard
            </button>
            <button 
              onClick={handleLogout} 
              style={{ padding: '0.4rem 0.85rem', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Logout
            </button>
          </>
        ) : (
          <button 
            onClick={() => { setActiveTab('auth'); setIsAdminView(false); }} 
            style={{ padding: '0.4rem 1rem', borderRadius: '6px', border: 'none', background: '#6366f1', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Log In / Sign Up
          </button>
        )}

        {/* Admin Mode Toggle Button */}
        <button 
          onClick={() => setIsAdminView(!isAdminView)} 
          style={{ 
            padding: '0.4rem 0.85rem', 
            borderRadius: '6px', 
            border: '1px solid rgba(99, 102, 241, 0.6)', 
            background: isAdminView ? '#6366f1' : 'rgba(99, 102, 241, 0.15)', 
            color: '#fff', 
            fontWeight: 600, 
            cursor: 'pointer', 
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          {isAdminView ? 'Exit Admin' : '🔒 Admin Mode'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;