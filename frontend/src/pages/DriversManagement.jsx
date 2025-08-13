  import React, { useEffect, useState } from 'react';
  import api from '../api';
  import Modal from '../components/Modal';
  import { motion } from 'framer-motion';

  export default function DriversManagement() {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);

    const [form, setForm] = useState({
      name: '',
      licenseNumber: '',
      phone: '',
    });

    useEffect(() => {
      fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const res = await api.get('/drivers');
        setDrivers(res.data);
        setError(null);
      } catch (e) {
        setError('Failed to load drivers');
      } finally {
        setLoading(false);
      }
    };

    const openAddModal = () => {
      setEditingDriver(null);
      setForm({ name: '', licenseNumber: '', phone: '' });
      setShowModal(true);
    };

    const openEditModal = (driver) => {
      setEditingDriver(driver);
      setForm({
        name: driver.name || '',
        licenseNumber: driver.licenseNumber || '',
        phone: driver.phone || '',
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
        if (editingDriver) {
          await api.put(`/drivers/${editingDriver._id}`, form);
        } else {
          await api.post('/drivers', form);
        }
        setShowModal(false);
        fetchDrivers();
      } catch (e) {
        alert('Error saving driver');
      } finally {
        setLoading(false);
      }
    };

    const handleDelete = async (id) => {
      if (!window.confirm('Are you sure to delete this driver?')) return;
      setLoading(true);
      try {
        await api.delete(`/drivers/${id}`);
        fetchDrivers();
      } catch {
        alert('Failed to delete');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div style={{ padding: 20 }}>
        <h1>Manage Drivers</h1>

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
          + Add Driver
        </motion.button>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f0f0f0' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
              <th style={{ textAlign: 'left', padding: 8 }}>License Number</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Phone</th>
              <th style={{ padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: 8 }}>{driver.name}</td>
                <td style={{ padding: 8 }}>{driver.licenseNumber}</td>
                <td style={{ padding: 8 }}>{driver.phone}</td>
                <td style={{ padding: 8, textAlign: 'center' }}>
                  <button
                    onClick={() => openEditModal(driver)}
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
                    onClick={() => handleDelete(driver._id)}
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

            {!loading && drivers.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: 20, color: '#777' }}>
                  No drivers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <h2>{editingDriver ? 'Edit Driver' : 'Add Driver'}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name<br />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 8, marginBottom: 12 }}
              />
            </label>

            <label>
              License Number<br />
              <input
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 8, marginBottom: 12 }}
              />
            </label>

            <label>
              Phone<br />
              <input
                name="phone"
                value={form.phone}
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
