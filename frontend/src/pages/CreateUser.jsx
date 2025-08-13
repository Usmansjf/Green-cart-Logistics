import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function CreateUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!username || !password) {
      setMsg('Please provide username & password');
      return;
    }
    try {
      const res = await api.post('/auth/register', { username, password });
      setMsg(res.data.message);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error creating user');
    }
  };

  return (
    <div className="auth-card">
      <h2>Create Manager User</h2>
      <p className="muted">Register a manager account for dashboard access</p>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {msg && <div className="alert">{msg}</div>}

        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          <button className="btn-primary" type="submit">
            Create User
          </button>
        </div>
      </form>
    </div>
  );
}
