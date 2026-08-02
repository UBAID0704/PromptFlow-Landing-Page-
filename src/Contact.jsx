import React, { useState } from 'react';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/contacts`;

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      if (!res.ok) throw new Error('Failed to send message.');

      setName('');
      setEmail('');
      setMessage('');
      setStatus({ type: 'success', text: 'Message sent successfully! Our team will reach out soon.' });
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Server error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section" style={{ padding: '4rem 2rem', color: '#fff', textAlign: 'center' }}>
      <div className="features-header">
        <span className="hero-tag">GET IN TOUCH</span>
        <h2>Contact Our AI Engineering Team</h2>
      </div>

      <div style={{ maxWidth: '500px', margin: '2rem auto 0 auto' }}>
        {status.text && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            borderRadius: '8px',
            background: status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            border: status.type === 'error' ? '1px solid #ef4444' : '1px solid #22c55e',
            color: status.type === 'error' ? '#f87171' : '#4ade80'
          }}>
            {status.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: 'rgba(17, 20, 24, 0.6)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'left' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box' }} required />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box' }} required />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows="4" placeholder="How can we help?" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', resize: 'none', boxSizing: 'border-box' }} required />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: '#fff', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Sending Message...' : 'Send Inquiry'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
