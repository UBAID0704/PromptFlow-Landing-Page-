import React, { useState, useEffect } from 'react';

function AiModelsList() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetching the top 20 downloaded AI models publicly available
    fetch('https://huggingface.co/api/models?sort=downloads&direction=-1&limit=20')
      .then((res) => {
        if (!res.ok) throw new Error('Could not synchronize with model repository.');
        return res.json();
      })
      .then((data) => {
        // Ensure fetched data is an array before updating state
        setModels(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch active AI models.');
        setLoading(false);
      });
  }, []);

  // Safeguard against non-array model states during test mocks or API errors
  const safeModels = Array.isArray(models) ? models : [];

  // Filter models based on search query match with model ID or pipeline/task type
  const filteredModels = safeModels.filter((model) => {
    const query = searchQuery.toLowerCase();
    const idMatches = model?.id?.toLowerCase().includes(query);
    const pipelineMatches = model?.pipeline_tag?.toLowerCase().includes(query);
    return idMatches || pipelineMatches;
  });

  return (
    <section className="features-section" style={{ padding: '4rem 2rem', color: '#fff', textAlign: 'center' }}>
      <div className="features-header">
        <span className="hero-tag">LIVE MARKETPLACE</span>
        <h2>Explore Supported AI Models</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          Discover the live model pipelines fueling our Content Writer, Code Assistant, and Summarizer features.
        </p>
      </div>

      {/* Search Input Container */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'center' }}>
        <input
          type="text"
          placeholder="Search models (e.g., llama, summarization, whisper)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '500px',
            padding: '0.85rem 1.25rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(10, 12, 16, 0.5)',
            color: '#fff',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Conditional States Rendering */}
      {loading && (
        <div style={{ padding: '3rem', color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.2rem' }}>
          <div className="spinner" style={{ marginBottom: '1rem' }}>⏳</div>
          Connecting to Hugging Face Model Registries...
        </div>
      )}

      {error && (
        <div style={{ margin: '2rem auto', maxWidth: '500px', padding: '1.5rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171' }}>
          <strong>Engine Error:</strong> {error}
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: 'rgba(255,255,255,0.5)' }}>Please check your network status or try reloading.</p>
        </div>
      )}

      {/* Grid Results display */}
      {!loading && !error && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem', 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 1rem' 
        }}>
          {filteredModels.length > 0 ? (
            filteredModels.map((model) => (
              <a 
                key={model.id} 
                href={`https://huggingface.co/${model.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'rgba(17, 20, 24, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '2rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  minHeight: '180px',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(5px)',
                  WebkitBackdropFilter: 'blur(5px)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                    {model.pipeline_tag || 'Core Pipeline'}
                  </div>
                  <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', fontWeight: 600, wordBreak: 'break-all', color: '#fff', lineHeight: '1.4' }}>
                    {model.id ? (model.id.split('/')[1] || model.id) : 'Unknown Model'}
                  </h4>
                </div>
                
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '0.25rem' }}>
                    Author: <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{model.author || 'OpenSource'}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                    Downloads: <span style={{ color: '#a855f7', fontWeight: 600 }}>{model.downloads ? model.downloads.toLocaleString() : 0}</span>
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', padding: '3rem', color: 'rgba(255, 255, 255, 0.4)', fontSize: '1.1rem' }}>
              No active AI models found matching "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default AiModelsList;
