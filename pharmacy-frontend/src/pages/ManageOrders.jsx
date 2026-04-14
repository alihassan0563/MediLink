import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../api';

export default function ManageOrders() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('admin_token');

  const load = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load orders');
      // Filter out orders deleted by admin
      setItems(data.filter(o => o.status !== 'deleted by admin'));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Reject this order request? This will notify both customer and pharmacy.')) return;
    const res = await fetch(`${API_BASE_URL}/api/admin/orders/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) { setError(data.message || 'Action failed'); return; }
    setItems((prev) => prev.filter((o) => o._id !== id));
    window.dispatchEvent(new Event('orderChanged'));
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
              <td style={td}><Badge value={o.status} /> {o.statusMessage ? <span style={{ marginLeft: 8, color: '#6b7280' }}>({o.statusMessage})</span> : null}</td>
              <td style={td}>
                <button onClick={() => remove(o._id)} style={btnDanger}>Delete (Reject)</button>
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
const btnDanger = { padding: '6px 10px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' };


