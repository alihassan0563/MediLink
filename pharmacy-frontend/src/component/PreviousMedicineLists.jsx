import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../api';

const PreviousMedicineLists = ({ onClose, onUseList }) => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const token = localStorage.getItem('customer_token');
        if (!token) {
          setError('You need to login to view saved lists.');
          setLoading(false);
          return;
        }
        const res = await fetch(`${API_BASE_URL}/api/customer/saved-lists`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error('Failed to load saved lists');
        }
        const data = await res.json();
        setLists(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || 'Failed to load saved lists');
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('customer_token');
    if (!token) {
      setError('You need to login to delete saved lists.');
      return;
    }
    const proceed = window.confirm('Delete this saved list? This action cannot be undone.');
    if (!proceed) return;
    try {
      setDeletingId(id);
      const res = await fetch(`${API_BASE_URL}/api/customer/saved-lists/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const contentType = res.headers.get('content-type') || '';
        let serverMsg = '';
        if (contentType.includes('application/json')) {
          const payload = await res.json().catch(() => ({}));
          serverMsg = payload.message || payload.error || '';
        } else {
          serverMsg = await res.text().catch(() => '');
        }
        const msg = serverMsg ? `(${res.status}) ${serverMsg}` : `(${res.status}) Failed to delete list`;
        throw new Error(msg);
      }
      setLists(prev => prev.filter(l => l._id !== id));
    } catch (e) {
      setError(e.message || 'Failed to delete list');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={{ margin: 0, color: '#2ca7a0' }}>Previous Medicine Lists</h3>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        <div style={styles.body}>
          {loading && <div>Loading...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {!loading && !error && lists.length === 0 && (
            <div>No saved lists yet.</div>
          )}
          {!loading && lists.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {lists.map((list) => (
                <div key={list._id} style={styles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#2ca7a0' }}>{list.name || 'Unnamed List'}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>{new Date(list.createdAt).toLocaleString()}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={styles.primaryBtn} onClick={() => onUseList(list.medicines)}>Use This List</button>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(list._id)}
                        disabled={deletingId === list._id}
                        title="Delete this saved list"
                      >
                        {deletingId === list._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {list.medicines.map((m, idx) => (
                        <li key={idx} style={{ fontSize: 14 }}>
                          <b>{m.name}</b> {m.type ? `• ${m.type}` : ''} {m.strength ? `• ${m.strength}` : ''} • Qty: {m.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  modal: {
    background: '#fff', borderRadius: 10, width: 'min(820px, 92vw)', maxHeight: '84vh', overflow: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #eee'
  },
  body: {
    padding: 18
  },
  closeBtn: {
    border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer'
  },
  card: {
    border: '1px solid #e0f2f1', borderRadius: 8, padding: 12, background: '#f9fffe'
  },
  primaryBtn: {
    background: '#2ca7a0', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px', cursor: 'pointer', fontWeight: 700
  },
  secondaryBtn: {
    background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px', cursor: 'pointer', fontWeight: 700
  }
};

// Add a dedicated delete button style
styles.deleteBtn = {
  background: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '8px 12px',
  cursor: 'pointer',
  fontWeight: 700
};

export default PreviousMedicineLists;
