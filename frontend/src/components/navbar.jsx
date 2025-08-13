import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react'; 

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(!!localStorage.getItem('token'));
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setToken(!!localStorage.getItem('token'));
    setMenuOpen(false); // Close menu on route change
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(false);
    navigate('/', { replace: true });
  };

  return (
    <motion.header
      className="w-full bg-white shadow-md flex justify-between items-center px-4 py-3 md:px-8"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left: Brand */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate(token ? '/dashboard' : '/')}
      >
        <div className="text-2xl">🟣</div>
        <div>
          <div className="font-bold text-lg">GreenCart Logistics</div>
          <div className="text-sm text-gray-500">Operations Dashboard</div>
        </div>
      </div>

      {/* Desktop Menu */}
      <nav className="hidden md:flex items-center gap-4">
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

      {/* Mobile Hamburger */}
      <button
        className="md:hidden p-2"
        onClick={() => setMenuOpen(prev => !prev)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 w-full bg-white shadow-lg flex flex-col items-start gap-3 p-4 md:hidden z-50"
          >
            {token ? (
              <>
                <Link to="/dashboard" className="nav-link w-full">Dashboard</Link>
                <Link to="/simulate" className="nav-link w-full">Simulation</Link>
                <Link to="/manage" className="nav-link w-full">Manage</Link>
                <button
                  onClick={handleLogout}
                  className="btn-outline w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/register" className="nav-link w-full">Create User</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
