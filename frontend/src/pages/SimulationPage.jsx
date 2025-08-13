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
      className="page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <div>
          <h1>Run Simulation</h1>
          <p className="muted">Configure inputs and run to generate allocation & KPIs</p>
        </div>
        <LoadDataButton onDone={() => setResult(null)} />
      </div>

      <motion.div
        className="grid grid-cols-[auto_1fr] gap-4 w-full"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* First row: form card */}
        <div className="card form-card custom-box grid">
          <label>Number of drivers
            <input name="numDrivers" type="number" value={form.numDrivers} onChange={handleChange} />
          </label>

          <label>Start time
            <input name="startTime" type="time" value={form.startTime} onChange={handleChange} />
          </label>

          <label>Max hours / driver
            <input name="maxHoursPerDriver" type="number" value={form.maxHoursPerDriver} onChange={handleChange} />
          </label>

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <motion.button
              className="btn-primary"
              onClick={runSimulation}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? 'Running…' : 'Run Simulation'}
            </motion.button>
          </div>

          {error && <div className="alert" style={{ marginTop: 12 }}>{error}</div>}
        </div>

        {/* First row: result KPIs and charts */}
        <div className="card result-card custom-box grid">
          {!result && <div className="muted">No results yet — run a simulation.</div>}

          {result && (
            <>
              <motion.div
                className="grid-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="stat-card small">
                  <div className="stat-label">Total Profit</div>
                  <div className="stat-value">₹{Math.round(result.kpis.totalProfit)}</div>
                </div>
                <div className="stat-card small">
                  <div className="stat-label">Efficiency</div>
                  <div className="stat-value">{result.kpis.efficiency.toFixed(2)}%</div>
                </div>
                <div className="stat-card small">
                  <div className="stat-label">Fuel Cost</div>
                  <div className="stat-value">₹{Math.round(result.kpis.fuelCostTotal)}</div>
                </div>
              </motion.div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <div style={{ width: 240, height: 220 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                        {pieData.map((entry, idx) => (
                          <Cell key={`c-${idx}`} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ flex: 1, height: 220 }}>
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
          <div className="card result-card custom-box col-span-2">
            <h3 style={{ marginTop: 12 }}>Allocations</h3>
            <div className="alloc-table">
              <table className="w-full text-left border-collapse bg-white shadow-sm rounded-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3">Order</th>
                    <th className="p-3">Driver</th>
                    <th className="p-3">Time (min)</th>
                    <th className="p-3">On Time</th>
                    <th className="p-3">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {result?.allocations.map(a => (
                    <motion.tr
                      key={a.order_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className={a.onTime ? 'bg-green-50' : 'bg-red-50'}
                    >
                      <td className="p-3">{a.order_id}</td>
                      <td className="p-3">{a.driver_name || 'No Driver Assigned'}</td>
                      <td className="p-3">{Math.round(a.estimatedDeliveryTimeMinutes)}</td>
                      <td className="p-3">{a.onTime ? 'Yes' : 'No'}</td>
                      <td className="p-3">₹{Math.round(a.profit)}</td>
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