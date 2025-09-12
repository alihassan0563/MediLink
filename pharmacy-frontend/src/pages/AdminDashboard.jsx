import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const load = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load stats');
        setStats(data);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
    // Listen for pharmacy and order changes
    const handler = () => load();
    window.addEventListener('pharmacyChanged', handler);
    window.addEventListener('orderChanged', handler);
    return () => {
      window.removeEventListener('pharmacyChanged', handler);
      window.removeEventListener('orderChanged', handler);
    };
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/admin/pharmacies" style={navBtn}>Pharmacies</Link>
          <Link to="/admin/customers" style={navBtn}>Customers</Link>
          <Link to="/admin/orders" style={navBtn}>Orders</Link>
        </div>
      </div>
      {admin && <div style={{ marginBottom: 12, color: '#555' }}>Welcome, {admin.email}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {stats ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <StatCard title="Customers" value={stats.customers} />
          <StatCard title="Pharmacies" value={stats.pharmacies} />
          <StatCard title="Orders" value={stats.orders} />
          <StatCard title="Pending Approvals" value={stats.pendingPharmacies} />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div style={{ fontSize: 14, color: '#666' }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 'bold' }}>{value}</div>
    </div>
  );
}

const navBtn = {
  display: 'inline-block',
  padding: '8px 12px',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  textDecoration: 'none',
  color: '#111827',
  background: '#f9fafb'
};


