import { useState, useEffect, useCallback } from 'react';
import { getDockRiders, createDockRider, updateDockRider, deleteDockRider, getDocks, getRiders } from '../api';

const empty = { dock_id: '', rider_id: '', rental_duration: '' };

function formatTime(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleString();
}

function calcExitTime(entryTs, durationMinutes) {
  if (!entryTs || !durationMinutes) return '—';
  return new Date(entryTs + durationMinutes * 60 * 1000).toLocaleString();
}

export default function BookedDocksPage() {
  const [bookings, setBookings] = useState([]);
  const [docks, setDocks] = useState([]);
  const [riders, setRiders] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [b, d, r] = await Promise.all([getDockRiders(), getDocks(), getRiders()]);
      setBookings(b);
      setDocks(d);
      setRiders(r);
    } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);

  const dockMap = Object.fromEntries(docks.map((d) => [d.dock_id, d.dock_location]));
  const riderMap = Object.fromEntries(riders.map((r) => [r.rider_id, r.rider_name]));

  const openCreate = () => { setForm(empty); setError(''); setModal('create'); };
  const openEdit = (b) => {
    setForm({ dock_id: b.dock_id, rider_id: b.rider_id, rental_duration: b.rental_duration });
    setEditId(b.id);
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
        dock_id: form.dock_id,
        rider_id: form.rider_id,
        rental_duration: Number(form.rental_duration),
      };
      if (modal === 'create') await createDockRider(payload);
      else await updateDockRider(editId, payload);
      close();
      load();
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this booking?')) return;
    try { await deleteDockRider(id); load(); } catch {}
  };

  return (
    <div>
      <div className="page-header">
        <h2>Booked Docks</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ Book Dock</button>
      </div>

      {bookings.length === 0 ? (
        <p className="empty">No bookings found. Create one to get started.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Dock</th>
                <th>Rider</th>
                <th>Duration (min)</th>
                <th>Entry Time</th>
                <th>Exit Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td title={b.id}>{b.id.slice(0, 8)}...</td>
                  <td>{dockMap[b.dock_id] || b.dock_id}</td>
                  <td>{riderMap[b.rider_id] || b.rider_id}</td>
                  <td>{b.rental_duration}</td>
                  <td>{formatTime(b.createdAt)}</td>
                  <td>{calcExitTime(b.createdAt, b.rental_duration)}</td>
                  <td className="actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(b)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{modal === 'create' ? 'Book a Dock' : 'Edit Booking'}</h3>
            {error && <p className="error-msg">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="dock_id">Select Dock</label>
                <select id="dock_id" name="dock_id" value={form.dock_id} onChange={handleChange} required>
                  <option value="">-- Choose a dock --</option>
                  {docks.map((d) => (
                    <option key={d.dock_id} value={d.dock_id}>
                      {d.dock_location} (capacity: {d.parking_capacity})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="rider_id">Select Rider</label>
                <select id="rider_id" name="rider_id" value={form.rider_id} onChange={handleChange} required>
                  <option value="">-- Choose a rider --</option>
                  {riders.map((r) => (
                    <option key={r.rider_id} value={r.rider_id}>
                      {r.rider_name} ({r.cycle_model})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="rental_duration">Rental Duration (minutes)</label>
                <input id="rental_duration" name="rental_duration" type="number" value={form.rental_duration} onChange={handleChange} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary">{modal === 'create' ? 'Book' : 'Update'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
