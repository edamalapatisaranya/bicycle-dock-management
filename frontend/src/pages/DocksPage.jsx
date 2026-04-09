import { useState, useEffect, useCallback } from 'react';
import { getDocks, createDock, updateDock, deleteDock, getDockRiders } from '../api';

const empty = { dock_location: '', parking_capacity: '' };

export default function DocksPage() {
  const [docks, setDocks] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [d, b] = await Promise.all([getDocks(), getDockRiders()]);
      setDocks(d);
      setBookings(b);
    } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);

  // Count bookings per dock
  const bookedCountMap = {};
  bookings.forEach((b) => {
    bookedCountMap[b.dock_id] = (bookedCountMap[b.dock_id] || 0) + 1;
  });

  const openCreate = () => { setForm(empty); setError(''); setModal('create'); };
  const openEdit = (d) => {
    setForm({ dock_location: d.dock_location, parking_capacity: d.parking_capacity });
    setEditId(d.dock_id);
    setError('');
    setModal('edit');
  };
  const close = () => setModal(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        dock_location: form.dock_location,
        parking_capacity: Number(form.parking_capacity),
      };
      if (modal === 'create') await createDock(payload);
      else await updateDock(editId, payload);
      close();
      load();
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (dockId) => {
    if (!confirm('Delete this dock?')) return;
    try { await deleteDock(dockId); load(); } catch {}
  };

  return (
    <div>
      <div className="page-header">
        <h2>Docks</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Dock</button>
      </div>

      {docks.length === 0 ? (
        <p className="empty">No docks found. Create one to get started.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Dock ID</th><th>Location</th><th>Capacity</th><th>Booked</th><th>Available</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {docks.map((d) => {
                const booked = bookedCountMap[d.dock_id] || 0;
                const available = Math.max(0, d.parking_capacity - booked);
                return (
                  <tr key={d._id}>
                    <td title={d.dock_id}>{d.dock_id}</td>
                    <td>{d.dock_location}</td>
                    <td>{d.parking_capacity}</td>
                    <td>{booked}</td>
                    <td>{available}</td>
                    <td className="actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(d)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.dock_id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{modal === 'create' ? 'Create Dock' : 'Edit Dock'}</h3>
            {error && <p className="error-msg">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="dock_location">Location</label>
                <input id="dock_location" name="dock_location" value={form.dock_location} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="parking_capacity">Parking Capacity</label>
                <input id="parking_capacity" name="parking_capacity" type="number" value={form.parking_capacity} onChange={handleChange} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary">{modal === 'create' ? 'Create' : 'Update'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
