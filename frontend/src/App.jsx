import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SimulationPage from './pages/SimulationPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Navbar from './components/navbar';
import { motion } from 'framer-motion';
import CreateUser from './pages/CreateUser';
import Manage from './pages/Manage';

const isAuthenticated = () => !!localStorage.getItem('token');

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <div className="container">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Routes>
          
          <Route
            path="/"
            element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />}
          />

          
          <Route path="/register" element={<CreateUser />} /> 

          
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/simulate"
            element={
              <PrivateRoute>
                <SimulationPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/manage"
            element={
              <PrivateRoute>
                <Manage />
              </PrivateRoute>
            }
          />

          
          <Route
            path="*"
            element={<Navigate to={isAuthenticated() ? "/dashboard" : "/"} replace />}
          />
        </Routes>
      </motion.div>
    </div>
  );
}
