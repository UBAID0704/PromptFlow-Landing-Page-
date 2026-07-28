import React from 'react';

function Features() {
  return (
    <section className="features-section" id="features">
      <div className="features-header">
        <h2>Powerful AI Features</h2>
      </div>
      <div className="features-grid">
        <div className="feature-card">
          <h3>AI Content Writer</h3>
          <p>Create blogs, emails, reports, and social media content quickly.</p>
        </div>
        <div className="feature-card">
          <h3>AI Code Assistant</h3>
          <p>Write, debug, explain, and improve your code with AI.</p>
        </div>
        <div className="feature-card">
          <h3>Document Summarizer</h3>
          <p>Convert long documents into short and meaningful summaries.</p>
        </div>
      </div>
    </section>
  );
}

export default Features;