import React, { useEffect, useState } from 'react';
import api from '../api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#38b2ac', '#f56565'];
const FUEL_COLORS = ['#ed8936', '#4299e1'];

export default function Dashboard() {
  const [sims, setSims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSims = async () => {
    setLoading(true);
    try {
      const res = await api.get('/simulate');
      const sortedSims = (res.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setSims(sortedSims);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSims();
  }, []);

  const latest = sims[0];

  return (
    <motion.div
      className="page container mx-auto p-4 sm:p-6 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="muted text-sm sm:text-base">Latest simulation KPIs and history</p>
        </div>
      </div>

      {loading && <div className="card muted p-4 rounded-lg bg-gray-100 text-center">Loading…</div>}
      {error && <div className="card alert p-4 rounded-lg bg-red-100 text-red-700">{error}</div>}

      {!loading && !latest && (
        <div className="card p-4 rounded-lg bg-gray-100 text-center">No simulations yet — run one.</div>
      )}

      {latest && latest.kpis && (
        <>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-card p-4 rounded-lg bg-white shadow">
              <div className="stat-label text-sm sm:text-base font-medium">Total Profit</div>
              <div className="stat-value text-lg sm:text-xl font-bold">₹{Math.round(latest.kpis.totalProfit)}</div>
            </div>
            <div className="stat-card p-4 rounded-lg bg-white shadow">
              <div className="stat-label text-sm sm:text-base font-medium">Efficiency</div>
              <div className="stat-value text-lg sm:text-xl font-bold">{latest.kpis.efficiency.toFixed(2)}%</div>
            </div>
            <div className="stat-card p-4 rounded-lg bg-white shadow">
              <div className="stat-label text-sm sm:text-base font-medium">Fuel Cost</div>
              <div className="stat-value text-lg sm:text-xl font-bold">₹{Math.round(latest.kpis.fuelCostTotal)}</div>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="chart-card p-4 rounded-lg bg-white shadow">
              <h4 className="text-base sm:text-lg font-semibold mb-4">On-time vs Late</h4>
              <div className="w-full h-64 sm:h-80">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'On Time', value: latest.kpis.onTime },
                        { name: 'Late', value: latest.kpis.late }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      outerRadius="80%"
                      label
                    >
                      <Cell fill={COLORS[0]} />
                      <Cell fill={COLORS[1]} />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card p-4 rounded-lg bg-white shadow">
              <h4 className="text-base sm:text-lg font-semibold mb-4">Fuel Cost Breakdown</h4>
              <div className="w-full h-64 sm:h-80">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'High Traffic', value: latest.kpis.fuelBreakdown.high },
                        { name: 'Normal Traffic', value: latest.kpis.fuelBreakdown.normal }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      outerRadius="80%"
                      label
                    >
                      <Cell fill={FUEL_COLORS[0]} />
                      <Cell fill={FUEL_COLORS[1]} />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card p-4 rounded-lg bg-white shadow">
              <h4 className="text-base sm:text-lg font-semibold mb-4">History</h4>
              <div className="history-list max-h-64 sm:max-h-80 overflow-y-auto">
                {sims.map(s => (
                  <motion.div
                    key={s._id}
                    className="history-item p-3 border-b last:border-b-0 hover:bg-gray-50"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-sm sm:text-base">{new Date(s.createdAt).toLocaleString()}</div>
                    <div className="muted text-xs sm:text-sm">
                      ₹{Math.round(s.kpis.totalProfit)} • {s.kpis.efficiency.toFixed(1)}%
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}