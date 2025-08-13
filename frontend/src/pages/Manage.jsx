// src/pages/Manage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DriversManagement from './DriversManagement';
import OrdersManagement from './OrdersManagement';
import RoutesManagement from './RoutesManagement';

export default function Manage() {
  const [activeTab, setActiveTab] = useState('drivers');

  const renderContent = () => {
    switch (activeTab) {
      case 'drivers':
        return <DriversManagement />;
      case 'orders':
        return <OrdersManagement />;
      case 'routes':
        return <RoutesManagement />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Management Panel</h1>
          <p className="muted">Manage drivers, orders, and routes in one place</p>
        </div>
      </div>

      {/* Tabs */}
      <motion.div
        className="card custom-box"
        style={{ display: 'flex', gap: '10px', padding: '12px', marginBottom: '20px' }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {['drivers', 'orders', 'routes'].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        className="card custom-box"
        style={{ padding: '20px' }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {renderContent()}
      </motion.div>
    </motion.div>
  );
}
