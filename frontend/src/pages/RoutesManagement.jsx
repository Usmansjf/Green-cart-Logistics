import React, { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { motion } from 'framer-motion';

export default function RoutesManagement() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);

  const [form, setForm] = useState({
    route_id: '',
    distance_km: '',
    traffic_level: 'Low',
    base_time_min: ''
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/routes');
      setRoutes(res.data);
      setError(null);
    } catch (e) {
      setError('Failed to load routes');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingRoute(null);
    setForm({ route_id: '', distance_km: '', traffic_level: 'Low', base_time_min: '' });
    setShowModal(true);
  };

  const openEditModal = (route) => {
    setEditingRoute(route);
    setForm({
      route_id: route.route_id || '',
      distance_km: route.distance_km || '',
      traffic_level: route.traffic_level || 'Low',
      base_time_min: route.base_time_min || ''
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingRoute) {
        await api.put(`/routes/${editingRoute._id}`, form);
      } else {
        await api.post('/routes', form);
      }
      setShowModal(false);
      fetchRoutes();
    } catch (e) {
      alert('Error saving route');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this route?')) return;
    setLoading(true);
    try {
      await api.delete(`/routes/${id}`);
      fetchRoutes();
    } catch {
      alert('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Manage Routes</h1>

      <motion.button
        onClick={openAddModal}
        style={{
          marginBottom: 16,
          padding: '10px 16px',
          backgroundColor: '#646cff',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontWeight: 600,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        + Add Route
      </motion.button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f0f0f0' }}>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>Route ID</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Distance (km)</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Traffic Level</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Base Time (min)</th>
            <th style={{ padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: 8 }}>{route.route_id}</td>
              <td style={{ padding: 8 }}>{route.distance_km}</td>
              <td style={{ padding: 8 }}>{route.traffic_level}</td>
              <td style={{ padding: 8 }}>{route.base_time_min}</td>
              <td style={{ padding: 8, textAlign: 'center' }}>
                <button
                  onClick={() => openEditModal(route)}
                  style={{
                    marginRight: 8,
                    background: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    padding: '4px 8px',
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(route._id)}
                  style={{
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    padding: '4px 8px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {!loading && routes.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: 20, color: '#777' }}>
                No routes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <h2>{editingRoute ? 'Edit Route' : 'Add Route'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Route ID<br />
            <input
              name="route_id"
              type="number"
              value={form.route_id}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, marginBottom: 12 }}
            />
          </label>

          <label>
            Distance (km)<br />
            <input
              name="distance_km"
              type="number"
              value={form.distance_km}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, marginBottom: 12 }}
            />
          </label>

          <label>
            Traffic Level<br />
            <select
              name="traffic_level"
              value={form.traffic_level}
              onChange={handleChange}
              style={{ width: '100%', padding: 8, marginBottom: 12 }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>

          <label>
            Base Time (min)<br />
            <input
              name="base_time_min"
              type="number"
              value={form.base_time_min}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, marginBottom: 12 }}
            />
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 12px' }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '8px 16px',
                backgroundColor: '#646cff',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
