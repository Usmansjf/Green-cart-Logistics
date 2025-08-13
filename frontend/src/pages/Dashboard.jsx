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
      // Sort by createdAt desc to ensure latest first
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
      className="page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Latest simulation KPIs and history</p>
        </div>
      </div>

      {loading && <div className="card muted">Loading…</div>}
      {error && <div className="card alert">{error}</div>}

      {!loading && !latest && <div className="card">No simulations yet — run one.</div>}

      {latest && latest.kpis && (
        <>
          <motion.div
            className="grid-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-card">
              <div className="stat-label">Total Profit</div>
              <div className="stat-value">₹{Math.round(latest.kpis.totalProfit)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Efficiency</div>
              <div className="stat-value">{latest.kpis.efficiency.toFixed(2)}%</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Fuel Cost</div>
              <div className="stat-value">₹{Math.round(latest.kpis.fuelCostTotal)}</div>
            </div>
          </motion.div>

          <motion.div
            className="charts-row"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="chart-card">
              <h4>On-time vs Late</h4>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'On Time', value: latest.kpis.onTime },
                        { name: 'Late', value: latest.kpis.late }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
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

            <div className="chart-card">
              <h4>Fuel Cost Breakdown</h4>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'High Traffic', value: latest.kpis.fuelBreakdown.high },
                        { name: 'Normal Traffic', value: latest.kpis.fuelBreakdown.normal }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
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

            <div className="chart-card">
              <h4>History</h4>
              <div className="history-list">
                {sims.map(s => (
                  <motion.div
                    key={s._id}
                    className="history-item"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div>{new Date(s.createdAt).toLocaleString()}</div>
                    <div className="muted">
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