import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!username || !password) {
      setErr('Please provide username & password');
      return;
    }
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (error) {
      setErr(error?.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="auth-card">
      <h2>Manager Login</h2>
      <p className="muted">Sign in to manage simulations & data</p>

      <form onSubmit={handleSubmit} className="form">
        <label>Username
          <input value={username} onChange={e => setUsername(e.target.value)} required />
        </label>
        <label>Password
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>

        {err && <div className="alert">{err}</div>}

        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          <button className="btn-primary" type="submit">Sign in</button>
        </div>
      </form>
    </div>
  );
}
