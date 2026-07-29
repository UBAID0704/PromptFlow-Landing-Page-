import React, { useState } from 'react';
import FileUpload from './components/FileUpload.jsx';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const FEEDBACK_API = `${API_BASE}/feedback`;

export default function UserFeedbackForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('General');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [attachment, setAttachment] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    // Only include attachment if a file was uploaded
    const payload = {
      fullName,
      email,
      category,
      rating: Number(rating),
      comments,
      ...(attachment ? { attachment } : {})
    };

    try {
      const res = await fetch(FEEDBACK_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to submit feedback.');
      }

      setMessage('Thank you! Your feedback has been submitted successfully.');
      setFullName('');
      setEmail('');
      setCategory('General');
      setRating(5);
      setComments('');
      setAttachment('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(17, 20, 24, 0.95)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
      <h2 style={{ marginTop: 0, color: '#fff' }}>💬 Send Us Feedback</h2>
      <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>Help us improve AI Flow by submitting your thoughts or bug reports.</p>

      {message && <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', color: '#4ade80', borderRadius: '8px' }}>{message}</div>}
      {error && <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', borderRadius: '8px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.3rem' }}>Full Name</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.3rem' }}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.3rem' }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#111418', color: '#fff', boxSizing: 'border-box' }}>
              <option value="General">General Feedback</option>
              <option value="UI UX Bug">UI/UX Bug</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Performance">Performance Issue</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.3rem' }}>Rating</label>
            <select value={rating} onChange={e => setRating(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#111418', color: '#fff', boxSizing: 'border-box' }}>
              <option value={5}>5 Stars ★★★★★</option>
              <option value={4}>4 Stars ★★★★☆</option>
              <option value={3}>3 Stars ★★★☆☆</option>
              <option value={2}>2 Stars ★★☆☆☆</option>
              <option value={1}>1 Star ★☆☆☆☆</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.3rem' }}>Comments / Feedback</label>
          <textarea value={comments} onChange={e => setComments(e.target.value)} rows="4" required style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.3rem' }}>Attachment (Optional)</label>
          <FileUpload onUploadSuccess={(url) => setAttachment(url)} />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '0.75rem', borderRadius: '8px', border: 'none', background: '#6366f1', color: '#fff', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}
