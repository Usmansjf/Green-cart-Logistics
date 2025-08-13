import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    setToken(!!localStorage.getItem('token'));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(false);
    navigate('/', { replace: true }); // Go directly to login page
  };

  return (
    <motion.header
      className="nav"
      style={{ width: '100%' }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-left">
        <div
          className="brand"
          onClick={() => navigate(token ? '/dashboard' : '/')}
          style={{ cursor: 'pointer' }}
        >
          <div className="logo">🟣</div>
          <div>
            <div className="brand-title">GreenCart Logistics</div>
            <div className="brand-sub">Operations Dashboard</div>
          </div>
        </div>
      </div>

      <nav className="nav-right">
        {token ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/simulate" className="nav-link">Simulation</Link>
            <Link to="/manage" className="nav-link">Manage</Link>
            <motion.button
              className="btn-outline"
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </>
        ) : (
          <Link to="/register" className="nav-link">Create User</Link>
        )}
      </nav>
    </motion.header>
  );
}
