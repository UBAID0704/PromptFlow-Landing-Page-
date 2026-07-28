import React from 'react';

function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      desc: "Perfect for students and beginners exploring AI tools.",
      features: ["1,000 monthly generations", "Access to standard models", "Community support"],
      buttonText: "Get Started Free",
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "month",
      desc: "For power creators and developers who need high-speed tools.",
      features: ["Unlimited generations", "Access to premium models", "Priority API keys", "24/7 dedicated support"],
      buttonText: "Upgrade to Pro",
      popular: true
    }
  ];

  return (
    <section className="pricing-section" id="pricing">
      <div className="features-header">
        <span className="hero-tag">PLANS</span>
        <h2>Simple, Transparent Pricing</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 1.5rem auto', fontSize: '1.1rem' }}>
          Choose the plan that fits your workflow. Cancel or upgrade at any time.
        </p>
      </div>
      <div className="features-grid" style={{ maxWidth: '900px', margin: '3rem auto 0 auto' }}>
        {plans.map((plan, idx) => (
          <div 
            key={idx} 
            className="feature-card" 
            style={{ 
              borderColor: plan.popular ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.05)',
              background: plan.popular ? 'rgba(22, 28, 38, 0.9)' : 'var(--bg-card)',
              position: 'relative',
              textAlign: 'left'
            }}
          >
            {plan.popular && (
              <span className="hero-tag" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', margin: 0 }}>
                MOST POPULAR
              </span>
            )}
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>{plan.name}</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>{plan.desc}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff' }}>{plan.price}</span>
              <span style={{ color: 'var(--text-muted)' }}>/{plan.period}</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {plan.features.map((feat, fIdx) => (
                <li key={fIdx} style={{ margin: '0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#60a5fa' }}>✓</span> {feat}
                </li>
              ))}
            </ul>
            <button className={plan.popular ? 'btn-primary' : 'btn-secondary'} style={{ width: '100%' }}>
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Pricing;