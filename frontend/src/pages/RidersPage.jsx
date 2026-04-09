import { useState, useEffect, useCallback } from 'react';
import { getRiders, createRider, updateRider, deleteRider } from '../api';

const empty = { rider_name: '', cycle_model: '' };

export default function RidersPage() {
  const [riders, setRiders] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try { setRiders(await getRiders()); } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(empty); setError(''); setModal('create'); };
  const openEdit = (r) => {
    setForm({ rider_name: r.rider_name, cycle_model: r.cycle_model });
    setEditId(r.rider_id);
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
        rider_name: form.rider_name,
        cycle_model: form.cycle_model,
      };
      if (modal === 'create') await createRider(payload);
      else await updateRider(editId, payload);
      close();
      load();
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (riderId) => {
    if (!confirm('Delete this rider?')) return;
    try { await deleteRider(riderId); load(); } catch {}
  };

  return (
    <div>
      <div className="page-header">
        <h2>Riders</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Rider</button>
      </div>

      {riders.length === 0 ? (
        <p className="empty">No riders found. Create one to get started.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Rider ID</th><th>Name</th><th>Cycle Model</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {riders.map((r) => (
                <tr key={r._id}>
                  <td title={r.rider_id}>{r.rider_id}</td>
                  <td>{r.rider_name}</td>
                  <td>{r.cycle_model}</td>
                  <td className="actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(r)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.rider_id)}>Delete</button>
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
            <h3>{modal === 'create' ? 'Create Rider' : 'Edit Rider'}</h3>
            {error && <p className="error-msg">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="rider_name">Name</label>
                <input id="rider_name" name="rider_name" value={form.rider_name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="cycle_model">Cycle Model</label>
                <input id="cycle_model" name="cycle_model" value={form.cycle_model} onChange={handleChange} required />
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
