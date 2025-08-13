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
      className="page container mx-auto p-4 sm:p-6 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Management Panel</h1>
          <p className="muted text-sm sm:text-base">Manage drivers, orders, and routes in one place</p>
        </div>
      </div>

      <motion.div
        className="card p-3 sm:p-4 rounded-lg bg-white shadow mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {['drivers', 'orders', 'routes'].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn px-4 py-2 rounded-md text-sm sm:text-base font-medium ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="card p-4 sm:p-6 rounded-lg bg-white shadow"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {renderContent()}
      </motion.div>
    </motion.div>
  );
}