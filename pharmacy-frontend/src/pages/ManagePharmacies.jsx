import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api';

export default function ManagePharmacies() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('admin_token');

  const load = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/pharmacies`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load pharmacies');
      setItems(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); }, []);

  const update = async (id, body) => {
    setError('');
    const res = await fetch(`${API_BASE_URL}/api/admin/pharmacies/${id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) { setError(data.message || 'Update failed'); return; }
    setItems((prev) => prev.map((p) => (p._id === id ? data : p)));
  };

  const remove = async (id) => {
    if (!confirm('Delete this pharmacy? This action cannot be undone.')) return;
    const res = await fetch(`${API_BASE_URL}/api/admin/pharmacies/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) { setError(data.message || 'Delete failed'); return; }
    await load(); // Reload from server to reflect soft delete
    window.dispatchEvent(new Event('pharmacyChanged'));
    // If the user is on the dashboard, reload the page to update stats
    if (window.location.pathname === '/admin') {
      window.location.reload();
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Manage Pharmacies</h2>
        <Link to="/admin" style={navBtn}>Back to Dashboard</Link>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', borderRadius: 12, overflow: 'hidden' }}>
        <thead>
          <tr>
            <th style={th}>Email</th>
            <th style={th}>Name</th>
            <th style={th}>Status</th>
            <th style={th}>Active</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p._id}>
              <td style={td}>{p.email}</td>
              <td style={td}>{p.pharmacyName}</td>
              <td style={td}><Badge value={p.status} /></td>
              <td style={td}>{p.isActive ? 'Yes' : 'No'}</td>
              <td style={td}>
                <button onClick={() => remove(p._id)} style={btnDanger}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Badge({ value }) {
  const color = value === 'approved' ? '#059669' : value === 'rejected' ? '#b91c1c' : '#6b7280';
  const bg = value === 'approved' ? '#ecfdf5' : value === 'rejected' ? '#fef2f2' : '#f3f4f6';
  return <span style={{ background: bg, color, padding: '2px 8px', borderRadius: 999, fontSize: 12, textTransform: 'capitalize' }}>{value}</span>;
}

const th = { textAlign: 'left', padding: 12, background: '#f9fafb', borderBottom: '1px solid #e5e7eb' };
const td = { padding: 12, borderBottom: '1px solid #f3f4f6' };
const btn = { padding: '6px 10px', background: '#111827', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' };
const btnLight = { padding: '6px 10px', background: '#f3f4f6', color: '#111827', border: '1px solid #e5e7eb', borderRadius: 6, cursor: 'pointer' };
const btnSecondary = { padding: '6px 10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' };
const btnDanger = { padding: '6px 10px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' };
const navBtn = { display: 'inline-block', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, textDecoration: 'none', color: '#111827', background: '#f9fafb' };


