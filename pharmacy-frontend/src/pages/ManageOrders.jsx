import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ManageOrders() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('admin_token');

  const load = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load orders');
      setItems(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); }, []);

  const update = async (id, status) => {
    setError('');
    const res = await fetch(`http://localhost:5000/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) { setError(data.message || 'Update failed'); return; }
    setItems((prev) => prev.map((o) => (o._id === id ? data : o)));
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Manage Orders</h2>
        <Link to="/admin" style={navBtn}>Back to Dashboard</Link>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', borderRadius: 12, overflow: 'hidden' }}>
        <thead>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Customer</th>
            <th style={th}>Selected Pharmacies</th>
            <th style={th}>Accepted By</th>
            <th style={th}>Status</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((o) => (
            <tr key={o._id}>
              <td style={td}>{o._id}</td>
              <td style={td}>{o.customer ? o.customer.email : '-'}</td>
              <td style={td}>{(o.pharmacyNames || []).join(', ')}</td>
              <td style={td}>{o.acceptedBy ? o.acceptedBy.pharmacyName : '-'}</td>
              <td style={td}><Badge value={o.status} /></td>
              <td style={td}>
                <button onClick={() => update(o._id, 'completed')} style={{ ...btn, marginRight: 8 }}>Mark Completed</button>
                <button onClick={() => update(o._id, 'cancelled')} style={btnLight}>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Badge({ value }) {
  const color = value === 'completed' ? '#059669' : value === 'cancelled' ? '#b91c1c' : '#6b7280';
  const bg = value === 'completed' ? '#ecfdf5' : value === 'cancelled' ? '#fef2f2' : '#f3f4f6';
  return <span style={{ background: bg, color, padding: '2px 8px', borderRadius: 999, fontSize: 12, textTransform: 'capitalize' }}>{value}</span>;
}

const th = { textAlign: 'left', padding: 12, background: '#f9fafb', borderBottom: '1px solid #e5e7eb' };
const td = { padding: 12, borderBottom: '1px solid #f3f4f6' };
const btn = { padding: '6px 10px', background: '#111827', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' };
const btnLight = { padding: '6px 10px', background: '#f3f4f6', color: '#111827', border: '1px solid #e5e7eb', borderRadius: 6, cursor: 'pointer' };
const navBtn = { display: 'inline-block', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, textDecoration: 'none', color: '#111827', background: '#f9fafb' };


