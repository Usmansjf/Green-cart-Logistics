import React, { useState } from 'react';
import api from '../api';

export default function LoadDataButton({ onDone }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleLoad = async () => {
    setMsg('');
    setLoading(true);
    try {
      const res = await api.post('/load-data');
      setMsg(res.data?.message || 'Data loaded');
      onDone && onDone();
    } catch (err) {
      setMsg(err?.response?.data?.error || 'Load failed');
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 5000);
    }
  };

  return (
    <div className="load-data">
      <button className="btn-primary" onClick={handleLoad} disabled={loading}>
        {loading ? 'Loading…' : 'Load Data'}
      </button>
      {msg && <div className="muted">{msg}</div>}
    </div>
  );
}
