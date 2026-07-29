import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext.jsx';
import { SkeletonCard } from './components/SkeletonLoader.jsx';
import { EmptyState } from './components/EmptyState.jsx';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const CONTACTS_API = `${API_BASE}/contacts`;
const FEEDBACK_API = `${API_BASE}/feedback`;
const LOGIN_URL = `${API_BASE}/admin/login`;

function AdminPanel({ onSwitchToPublic }) {
  const { fetchReviews } = useApp();

  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(null);

  const [activeAdminTab, setActiveAdminTab] = useState('feedback');

  const [feedbacks, setFeedbacks] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dedicated Inquiry Edit State (No Rating)
  const [editingInquiryId, setEditingInquiryId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editMessage, setEditMessage] = useState('');

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response (Backend Offline or 404).");
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed.');

      localStorage.setItem('adminToken', data.token);
      setToken(data.token);
      setPasswordInput('');
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [fbRes, inqRes] = await Promise.all([
        fetch(FEEDBACK_API),
        fetch(CONTACTS_API)
      ]);

      if (fbRes.ok) {
        const fbData = await fbRes.json();
        setFeedbacks(Array.isArray(fbData) ? fbData : fbData.reviews || []);
      }

      if (inqRes.ok) {
        const inqData = await inqRes.json();
        setInquiries(Array.isArray(inqData) ? inqData : inqData.inquiries || []);
      }
    } catch (err) {
      setError('Could not fetch database records.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeedback = async (item) => {
    const targetId = item._id || item.id;
    if (!targetId) return;

    if (!window.confirm('Delete this feedback entry?')) return;

    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`${FEEDBACK_API}/${targetId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to delete feedback entry.');

      setFeedbacks(prev => prev.filter(fb => (fb._id || fb.id) !== targetId));
      if (fetchReviews) fetchReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteInquiry = async (item) => {
    const targetId = item._id || item.id;
    if (!targetId) return;

    if (!window.confirm('Delete this inquiry?')) return;

    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`${CONTACTS_API}/${targetId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to delete inquiry.');

      setInquiries(prev => prev.filter(inq => (inq._id || inq.id) !== targetId));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const startEditInquiry = (item) => {
    setEditingInquiryId(item._id || item.id);
    setEditName(item.name || item.fullName || '');
    setEditEmail(item.email && item.email.includes('@') ? item.email : '');
    setEditMessage(item.message || item.inquiry || item.comments || '');
  };

  const cancelEditInquiry = () => {
    setEditingInquiryId(null);
    setEditName('');
    setEditEmail('');
    setEditMessage('');
  };

  const handleUpdateInquiry = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);

    try {
      const res = await fetch(`${CONTACTS_API}/${editingInquiryId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name: editName, 
          email: editEmail, 
          message: editMessage 
        })
      });

      if (!res.ok) throw new Error('Failed to update entry.');

      cancelEditInquiry();
      await fetchAllData();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (!token) {
    return (
      <section style={{ padding: '3rem 2rem', color: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', background: 'rgba(17, 20, 24, 0.95)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#fff' }}>🔒 Admin Verification</h3>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Enter password to access admin console.</p>

          {loginError && <div style={{ marginBottom: '1rem', padding: '0.6rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', fontSize: '0.85rem' }}>{loginError}</div>}

          <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Admin Password</label>
              <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} placeholder="Enter password..." style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box' }} required />
            </div>
            <button type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none', background: '#6366f1', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Unlock Dashboard</button>
          </form>
          <button onClick={onSwitchToPublic} style={{ marginTop: '1.25rem', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>⬅️ Return to Public Site</button>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: '2rem 1rem', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2>🛡️ Verified Admin Console</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={onSwitchToPublic} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', cursor: 'pointer' }}>⬅️ Back to Public View</button>
          <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', cursor: 'pointer' }}>🚪 Log Out</button>
        </div>
      </div>

      {error && <div style={{ marginBottom: '1.5rem', padding: '0.75rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        <button onClick={() => setActiveAdminTab('feedback')} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: activeAdminTab === 'feedback' ? '#6366f1' : 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Feedback Responses ({feedbacks.length})</button>
        <button onClick={() => setActiveAdminTab('inquiries')} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: activeAdminTab === 'inquiries' ? '#6366f1' : 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Inquiries ({inquiries.length})</button>
      </div>

      {loading ? (
        <><SkeletonCard /><SkeletonCard /></>
      ) : activeAdminTab === 'feedback' ? (
        feedbacks.length === 0 ? (
          <EmptyState icon="📝" title="No Feedback Found" description="There are no feedback submissions." />
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {feedbacks.map((fb, idx) => (
              <div key={fb._id || fb.id || idx} style={{ background: 'rgba(17, 20, 24, 0.8)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <strong>{fb.fullName || fb.name || 'Anonymous'}</strong>
                    {fb.email && <span style={{ color: '#818cf8', fontSize: '0.85rem', marginLeft: '0.5rem' }}>({fb.email})</span>}
                  </div>
                  <span style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', color: '#a5b4fc' }}>
                    {fb.category || 'General'} | Rating: {fb.rating || 5}★
                  </span>
                </div>
                <p style={{ color: '#d1d5db', fontSize: '0.9rem', margin: '0.5rem 0' }}>{fb.comments || fb.feedback || fb.message}</p>
                {fb.attachment && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <a href={fb.attachment} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#38bdf8', textDecoration: 'underline' }}>📎 View Attachment</a>
                  </div>
                )}
                <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
                  <button onClick={() => handleDeleteFeedback(fb)} disabled={actionLoading} style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>Delete Entry</button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        inquiries.length === 0 ? (
          <EmptyState icon="📬" title="No Inquiries Found" description="There are no contact inquiries." />
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {/* INLINE EDIT FORM (CLEANED OF STARS) */}
            {editingInquiryId && (
              <form onSubmit={handleUpdateInquiry} style={{ background: 'rgba(17, 20, 24, 0.95)', padding: '1.25rem', borderRadius: '12px', border: '1px solid #6366f1', marginBottom: '1rem' }}>
                <h4 style={{ marginTop: 0, color: '#6366f1' }}>📝 Edit Inquiry Entry</h4>
                <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af' }}>Name</label>
                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box' }} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af' }}>Email</label>
                    <input type="text" value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="name@example.com" style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af' }}>Message</label>
                  <textarea value={editMessage} onChange={e => setEditMessage(e.target.value)} rows="2" style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box' }} required />
                </div>
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" disabled={actionLoading} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: '#6366f1', color: '#fff', cursor: 'pointer' }}>{actionLoading ? 'Saving...' : 'Save Changes'}</button>
                  <button type="button" onClick={cancelEditInquiry} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', cursor: 'pointer' }}>Cancel</button>
                </div>
              </form>
            )}

            {inquiries.map((inq, idx) => (
              <div key={inq._id || inq.id || idx} style={{ background: 'rgba(17, 20, 24, 0.8)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <strong>{inq.name || inq.fullName || 'Anonymous'}</strong>
                    {inq.email && <span style={{ color: '#9ca3af', fontSize: '0.85rem', marginLeft: '0.5rem' }}>({inq.email})</span>}
                  </div>
                </div>
                <p style={{ color: '#d1d5db', fontSize: '0.9rem', margin: '0.5rem 0' }}>{inq.message || inq.inquiry || inq.comments}</p>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                  <button onClick={() => startEditInquiry(inq)} disabled={actionLoading} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDeleteInquiry(inq)} disabled={actionLoading} style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '0.35rem 0.75rem', borderRadius: '6px', color: '#f87171', fontSize: '0.8rem', cursor: 'pointer' }}>Delete Entry</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </section>
  );
}

export default AdminPanel;
