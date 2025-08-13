import React, { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { motion } from 'framer-motion';

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const [form, setForm] = useState({
    order_id: '',
    value_rs: '',
    route_id: '',
    delivery_time: '',
  });

  useEffect(() => {
    fetchOrders();
    fetchRoutes();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
      setError(null);
    } catch (e) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      const res = await api.get('/routes');
      setRoutes(res.data);
    } catch (e) {
      console.error('Failed to load routes');
    }
  };

  const openAddModal = () => {
    setEditingOrder(null);
    setForm({
      order_id: '',
      value_rs: '',
      route_id: '',
      delivery_time: '',
    });
    setShowModal(true);
  };

  const openEditModal = (order) => {
    setEditingOrder(order);
    setForm({
      order_id: order.order_id || '',
      value_rs: order.value_rs || '',
      route_id: order.route_id?._id || '',
      delivery_time: order.delivery_time ? order.delivery_time.slice(0, 16) : '',
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
      if (editingOrder) {
        await api.put(`/orders/${editingOrder._id}`, form);
      } else {
        await api.post('/orders', form);
      }
      setShowModal(false);
      fetchOrders();
    } catch (e) {
      alert('Error saving order');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this order?')) return;
    setLoading(true);
    try {
      await api.delete(`/orders/${id}`);
      fetchOrders();
    } catch {
      alert('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Manage Orders</h1>

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
        + Add Order
      </motion.button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f0f0f0' }}>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>Order ID</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Value (Rs)</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Route</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Delivery Time</th>
            <th style={{ padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: 8 }}>{order.order_id}</td>
              <td style={{ padding: 8 }}>{order.value_rs}</td>
              <td style={{ padding: 8 }}>
				{order.route_id
					? `Route ${order.route_id.route_id} (${order.route_id.distance_km} km)`
					: 'Unassigned'}
				</td>
              <td style={{ padding: 8 }}>
                {new Date(order.delivery_time).toLocaleString()}
              </td>
              <td style={{ padding: 8, textAlign: 'center' }}>
                <button
                  onClick={() => openEditModal(order)}
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
                  onClick={() => handleDelete(order._id)}
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

          {!loading && orders.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: 20, color: '#777' }}>
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <h2>{editingOrder ? 'Edit Order' : 'Add Order'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Order ID<br />
            <input
              name="order_id"
              value={form.order_id}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, marginBottom: 12 }}
            />
          </label>

          <label>
            Value (Rs)<br />
            <input
              name="value_rs"
              type="number"
              value={form.value_rs}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, marginBottom: 12 }}
            />
          </label>

          <label>
            Route<br />
            <select
              name="route_id"
              value={form.route_id}
              onChange={handleChange}
              style={{ width: '100%', padding: 8, marginBottom: 12 }}
            >
              <option value="">-- Select Route --</option>
              {routes.map(route => (
                <option key={route._id} value={route._id}>
                  Route {route.route_id} ({route.distance_km} km)
                </option>
              ))}
            </select>
          </label>

          <label>
            Delivery Time<br />
            <input
              name="delivery_time"
              type="datetime-local"
              value={form.delivery_time}
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
