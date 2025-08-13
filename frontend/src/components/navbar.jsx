import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(!!localStorage.getItem('token'));
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setToken(!!localStorage.getItem('token'));
    setMenuOpen(false); 
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(false);
    navigate('/', { replace: true });
  };

  return (
    <motion.header
      className="nav"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        position: 'relative',
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      
      <div
        className="brand"
        onClick={() => navigate(token ? '/dashboard' : '/')}
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}
      >
        <div className="logo">🟣</div>
        <div>
          <div className="brand-title">GreenCart Logistics</div>
          <div className="brand-sub">Operations Dashboard</div>
        </div>
      </div>

      
      <nav
        className="nav-right"
        style={{
          display: 'flex',
          gap: '1rem',
        }}
      >
        <div className="desktop-menu" style={{ display: 'flex', gap: '1rem' }}>
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
        </div>

    
        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(prev => !prev)}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
          }}
        >
          {menuOpen ? '✖' : '☰'}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              left: 0,
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              zIndex: 50,
            }}
          >
            {token ? (
              <>
                <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/simulate" className="nav-link" onClick={() => setMenuOpen(false)}>Simulation</Link>
                <Link to="/manage" className="nav-link" onClick={() => setMenuOpen(false)}>Manage</Link>
                <button
                  className="btn-outline"
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  style={{ textAlign: 'left' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/register" className="nav-link" onClick={() => setMenuOpen(false)}>Create User</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

     
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none;
          }
          .mobile-menu-button {
            display: block;
          }
        }
      `}</style>
    </motion.header>
  );
}
