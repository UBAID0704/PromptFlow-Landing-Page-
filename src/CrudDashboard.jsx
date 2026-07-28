import React, { useState, useEffect } from 'react';

export default function CrudDashboard() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'UI UX Bug',
    date: '',
    feedback: ''
  });
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/feedback');
      const data = await res.json();
      // Ensure state is always an array
      if (Array.isArray(data)) {
        setReviews(data);
      } else if (data && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name || !formData.email || !formData.category || !formData.date || !formData.feedback || !file) {
      setErrorMessage('Please fill in all fields and attach a file before submitting.');
      return;
    }

    try {
      // The backend expects multipart/form-data with fullName / experienceDate / comments / rating / attachment
      const payload = new FormData();
      payload.append('fullName', formData.name);
      payload.append('email', formData.email);
      payload.append('category', formData.category);
      payload.append('rating', 5); // this quick-review widget doesn't collect a star rating, so default to 5
      payload.append('experienceDate', formData.date);
      payload.append('comments', formData.feedback);
      payload.append('attachment', file);

      const res = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        body: payload
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        fetchReviews();
      } else if (data.fieldErrors) {
        const details = Object.values(data.fieldErrors).join(' ');
        setErrorMessage(`${data.message || 'Validation failed.'} ${details}`);
      } else {
        setErrorMessage(data.message || 'Something went wrong submitting your feedback. Please check your inputs and try again.');
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setErrorMessage('Network error. Please try again.');
    }
  };

  // Guard against non-array values before rendering
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
      <h2>Detailed User Feedback & Reviews</h2>

      {submitted ? (
        <div style={{ padding: '1rem', background: '#10b981', borderRadius: '8px', marginBottom: '1.5rem' }}>
          Thank you for your feedback!
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
          {errorMessage && (
            <div style={{ padding: '0.8rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgb(239, 68, 68)', color: 'rgb(248, 113, 113)', fontSize: '0.9rem' }}>
              {errorMessage}
            </div>
          )}
          <input
            type="text"
            name="name"
            placeholder="e.g. Ubaidullah"
            value={formData.name}
            onChange={handleChange}
            style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #374151', background: '#1f2937', color: '#fff' }}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #374151', background: '#1f2937', color: '#fff' }}
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #374151', background: '#1f2937', color: '#fff' }}
          >
            <option value="UI UX Bug">UI UX Bug</option>
            <option value="Feature Request">Feature Request</option>
            <option value="General Feedback">General Feedback</option>
          </select>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #374151', background: '#1f2937', color: '#fff' }}
          />
          <input
            type="file"
            name="attachment"
            onChange={handleFileChange}
            style={{ color: '#9ca3af' }}
          />
          <textarea
            name="feedback"
            placeholder="Describe your feedback"
            value={formData.feedback}
            onChange={handleChange}
            rows={4}
            style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #374151', background: '#1f2937', color: '#fff' }}
          />
          <button
            type="submit"
            style={{ padding: '0.8rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Submit Review
          </button>
        </form>
      )}

      <h3>Submitted Feedback</h3>
      {loading ? (
        <div>Loading feedback...</div>
      ) : safeReviews.length === 0 ? (
        <div>No feedback recorded yet.</div>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
          {safeReviews.map((rev) => (
            <div key={rev.id || rev._id || Math.random()} style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <strong>{rev.fullName || rev.name || 'Anonymous'}</strong>
                <span style={{ fontSize: '0.8rem', color: '#818cf8' }}>{rev.category}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#d1d5db' }}>{rev.comments || rev.feedback}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}