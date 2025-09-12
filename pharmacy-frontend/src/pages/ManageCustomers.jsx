import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ManageCustomers() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('admin_token');

  const load = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/customers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load customers');
      setItems(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Delete this customer? This action cannot be undone.')) return;
    const res = await fetch(`http://localhost:5000/api/admin/customers/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) { setError(data.message || 'Delete failed'); return; }
    setItems((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Manage Customers</h2>
        <Link to="/admin" style={navBtn}>Back to Dashboard</Link>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', borderRadius: 12, overflow: 'hidden' }}>
        <thead>
          <tr>
            <th style={th}>Email</th>
            <th style={th}>Phone</th>
            <th style={th}>Active</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c._id}>
              <td style={td}>{c.email}</td>
              <td style={td}>{c.phone}</td>
              <td style={td}>{c.isActive ? 'Yes' : 'No'}</td>
              <td style={td}>
                <button onClick={() => remove(c._id)} style={btnDanger}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { textAlign: 'left', padding: 12, background: '#f9fafb', borderBottom: '1px solid #e5e7eb' };
const td = { padding: 12, borderBottom: '1px solid #f3f4f6' };
const btnSecondary = { padding: '6px 10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' };
const btnDanger = { padding: '6px 10px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' };
const navBtn = { display: 'inline-block', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, textDecoration: 'none', color: '#111827', background: '#f9fafb' };


