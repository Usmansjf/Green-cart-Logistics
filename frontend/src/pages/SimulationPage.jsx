import React, { useState } from 'react';
import api from '../api';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { motion } from 'framer-motion';
import LoadDataButton from '../components/LoadDataButton';

const COLORS = ['#38b2ac', '#f56565', '#4299e1', '#ed8936'];

export default function SimulationPage() {
  const [form, setForm] = useState({ numDrivers: 2, startTime: '09:00', maxHoursPerDriver: 8 });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: (name === 'numDrivers' || name === 'maxHoursPerDriver') ? Number(value) : value
    }));
  };

  const runSimulation = async () => {
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post('/simulate', form);
      setResult(res.data);
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const pieData = result ? [
    { name: 'On Time', value: result.kpis.onTime },
    { name: 'Late', value: result.kpis.late }
  ] : [];

  const barData = result ? result.allocations.map(a => ({
    name: a.order_id,
    profit: Math.round(a.profit)
  })) : [];

  return (
    <motion.div
      className="page container mx-auto p-4 sm:p-6 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Run Simulation</h1>
          <p className="muted text-sm sm:text-base">Configure inputs and run to generate allocation & KPIs</p>
        </div>
        <LoadDataButton onDone={() => setResult(null)} />
      </div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 w-full"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="card form-card p-4 rounded-lg bg-white shadow">
          <label className="block mb-4">
            <span className="text-sm sm:text-base font-medium">Number of drivers</span>
            <input
              name="numDrivers"
              type="number"
              value={form.numDrivers}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </label>
          <label className="block mb-4">
            <span className="text-sm sm:text-base font-medium">Start time</span>
            <input
              name="startTime"
              type="time"
              value={form.startTime}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </label>
          <label className="block mb-4">
            <span className="text-sm sm:text-base font-medium">Max hours / driver</span>
            <input
              name="maxHoursPerDriver"
              type="number"
              value={form.maxHoursPerDriver}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </label>

          <div className="flex gap-2 mt-4">
            <motion.button
              className="btn-primary px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
              onClick={runSimulation}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? 'Running…' : 'Run Simulation'}
            </motion.button>
          </div>

          {error && <div className="alert mt-3 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
        </div>

        <div className="card result-card p-4 rounded-lg bg-white shadow">
          {!result && <div className="muted text-center text-sm sm:text-base">No results yet — run a simulation.</div>}

          {result && (
            <>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="stat-card p-3 rounded-md bg-gray-50">
                  <div className="stat-label text-sm font-medium">Total Profit</div>
                  <div className="stat-value text-lg sm:text-xl font-bold">₹{Math.round(result.kpis.totalProfit)}</div>
                </div>
                <div className="stat-card p-3 rounded-md bg-gray-50">
                  <div className="stat-label text-sm font-medium">Efficiency</div>
                  <div className="stat-value text-lg sm:text-xl font-bold">{result.kpis.efficiency.toFixed(2)}%</div>
                </div>
                <div className="stat-card p-3 rounded-md bg-gray-50">
                  <div className="stat-label text-sm font-medium">Fuel Cost</div>
                  <div className="stat-value text-lg sm:text-xl font-bold">₹{Math.round(result.kpis.fuelCostTotal)}</div>
                </div>
              </motion.div>

              <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-1/3 h-64 sm:h-80">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" outerRadius="80%" label>
                        {pieData.map((entry, idx) => (
                          <Cell key={`c-${idx}`} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="w-full lg:flex-1 h-64 sm:h-80">
                  <ResponsiveContainer>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="profit" fill={COLORS[0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>

        {result && (
          <div className="card result-card p-4 rounded-lg bg-white shadow col-span-1 lg:col-span-2">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Allocations</h3>
            <div className="alloc-table overflow-x-auto">
              <table className="w-full text-left border-collapse bg-white shadow-sm rounded-lg text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 sm:p-3">Order</th>
                    <th className="p-2 sm:p-3">Driver</th>
                    <th className="p-2 sm:p-3">Time (min)</th>
                    <th className="p-2 sm:p-3">On Time</th>
                    <th className="p-2 sm:p-3">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {result.allocations.map(a => (
                    <motion.tr
                      key={a.order_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className={a.onTime ? 'bg-green-50' : 'bg-red-50'}
                    >
                      <td className="p-2 sm:p-3">{a.order_id}</td>
                      <td className="p-2 sm:p-3">{a.driver_name || 'No Driver Assigned'}</td>
                      <td className="p-2 sm:p-3">{Math.round(a.estimatedDeliveryTimeMinutes)}</td>
                      <td className="p-2 sm:p-3">{a.onTime ? 'Yes' : 'No'}</td>
                      <td className="p-2 sm:p-3">₹{Math.round(a.profit)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
