import React from 'react';

function Hero() {
  return (
    <section className="hero-section">
      {/* Visual background ambient glow */}
      <div className="hero-glow"></div>

      <div className="hero-content">
        <span className="hero-tag">INTRODUCING PROMPTFLOW 1.0</span>
        <h1 className="hero-title">
          Your All-in-One <br />
          <span>AI Workspace</span>
        </h1>
        <p className="hero-desc">
          PromptFlow AI helps students, developers, and creators write content, 
          generate clean code, and summarize lengthy documents effortlessly.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary">Start Free Trial</button>
          <button className="btn-secondary">Watch Demo</button>
        </div>
      </div>

      <div className="hero-visual">
        <div className="glass-card">
          <div className="card-icon">⚡</div>
          <h3>AI Dashboard</h3>
          <p>
            An integrated developer canvas built to generate high-performing content, 
            debug structural code, and deliver smart analytics instantly.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;