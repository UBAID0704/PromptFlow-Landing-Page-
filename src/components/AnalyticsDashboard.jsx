import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');

  const fetchAnalytics = async (category) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/analytics?category=${category}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(filterCategory);
  }, [filterCategory]);

  if (loading && !data) {
    return <div style={{ color: '#fff', textAlign: 'center', padding: '3rem' }}>Loading Dashboard Analytics...</div>;
  }

  // Safe references with empty fallbacks
  const summary = data?.summaryCards || {};
  const monthlyTrends = Array.isArray(data?.monthlyTrends) ? data.monthlyTrends : [];
  const categoryDistribution = Array.isArray(data?.categoryDistribution) ? data.categoryDistribution : [];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
      
      {/* HEADER & INTERACTIVE FILTER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, color: '#818cf8', fontSize: '1.8rem' }}>📊 Platform Performance Dashboard</h2>
          <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
            Real-time server metrics, usage trends, and system insights.
          </p>
        </div>

        {/* INTERACTIVE FILTER CONTROL */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <label htmlFor="categoryFilter" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)' }}>Filter Metric:</label>
          <select
            id="categoryFilter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ background: '#111827', color: '#fff', border: '1px solid #4f46e5', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', outline: 'none' }}
          >
            <option value="all">All Metrics</option>
            <option value="revenue">Revenue Growth</option>
            <option value="users">Active Users</option>
            <option value="usage">Storage Usage (MB)</option>
          </select>
        </div>
      </div>

      {/* 1. STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard title="Total Revenue" value={summary?.totalRevenue ?? '—'} change="+14.2% mo/mo" color="#818cf8" icon="💰" />
        <StatCard title="Active Users" value={summary?.activeUsers ?? '—'} change="+22.5% new" color="#38bdf8" icon="👥" />
        <StatCard title="Processed Files" value={summary?.totalUploads ?? '—'} change="+8.1% storage" color="#34d399" icon="📁" />
        <StatCard title="System Uptime" value={summary?.systemHealth ?? 'Healthy'} change="Healthy" color="#f43f5e" icon="⚡" />
      </div>

      {/* 2. CHARTS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
        
        {/* VISUALIZATION 1: LINE / AREA CHART (MONTHLY TRENDS) */}
        <div style={{ background: 'rgba(17, 24, 39, 0.8)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h3 style={{ marginTop: 0, fontSize: '1.1rem', color: '#e0e7ff', marginBottom: '1rem' }}>📈 Monthly Activity & Growth</h3>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <AreaChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="month" stroke="rgba(255, 255, 255, 0.5)" />
                <YAxis stroke="rgba(255, 255, 255, 0.5)" />
                <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend />
                {(filterCategory === 'all' || filterCategory === 'revenue') && (
                  <Area type="monotone" dataKey="revenue" stroke="#818cf8" fill="rgba(129, 140, 248, 0.3)" name="Revenue ($)" />
                )}
                {(filterCategory === 'all' || filterCategory === 'users') && (
                  <Area type="monotone" dataKey="users" stroke="#38bdf8" fill="rgba(56, 189, 248, 0.3)" name="Users" />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* VISUALIZATION 2: PIE / DONUT CHART (CATEGORY DISTRIBUTION) */}
        <div style={{ background: 'rgba(17, 24, 39, 0.8)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h3 style={{ marginTop: 0, fontSize: '1.1rem', color: '#e0e7ff', marginBottom: '1rem' }}>🍰 Usage Distribution by Feature</h3>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#818cf8'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* VISUALIZATION 3: BAR CHART (STORAGE USAGE) */}
        <div style={{ background: 'rgba(17, 24, 39, 0.8)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', gridColumn: '1 / -1' }}>
          <h3 style={{ marginTop: 0, fontSize: '1.1rem', color: '#e0e7ff', marginBottom: '1rem' }}>📊 Storage Consumed (MB)</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="month" stroke="rgba(255, 255, 255, 0.5)" />
                <YAxis stroke="rgba(255, 255, 255, 0.5)" />
                <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="storageMB" fill="#34d399" radius={[6, 6, 0, 0]} name="Storage (MB)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}

function StatCard({ title, value, change, color, icon }) {
  return (
    <div style={{ background: 'rgba(17, 24, 39, 0.8)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ fontSize: '2rem', padding: '0.6rem', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)' }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>{title}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.2rem 0', color }}>{value}</div>
        <div style={{ fontSize: '0.75rem', color: '#10b981' }}>{change}</div>
      </div>
    </div>
  );
}