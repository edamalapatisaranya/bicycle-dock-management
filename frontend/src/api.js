const BASE = '/api';

async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

// Docks
export const getDocks = () => request('/docks');
export const createDock = (data) => request('/docks', { method: 'POST', body: JSON.stringify(data) });
export const updateDock = (dockId, data) => request(`/docks/${dockId}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteDock = (dockId) => request(`/docks/${dockId}`, { method: 'DELETE' });

// Riders
export const getRiders = () => request('/riders');
export const createRider = (data) => request('/riders', { method: 'POST', body: JSON.stringify(data) });
export const updateRider = (riderId, data) => request(`/riders/${riderId}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteRider = (riderId) => request(`/riders/${riderId}`, { method: 'DELETE' });

// DockRiders (Booked Docks)
export const getDockRiders = () => request('/dock-riders');
export const createDockRider = (data) => request('/dock-riders', { method: 'POST', body: JSON.stringify(data) });
export const updateDockRider = (id, data) => request(`/dock-riders/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteDockRider = (id) => request(`/dock-riders/${id}`, { method: 'DELETE' });

// Clear all data
export const clearAllData = () => request('/clear-data', { method: 'DELETE' });
