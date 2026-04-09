import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import DocksPage from './pages/DocksPage';
import RidersPage from './pages/RidersPage';
import BookedDocksPage from './pages/BookedDocksPage';
import { clearAllData } from './api';
import './App.css';

function App() {
  const handleClearData = async () => {
    if (!confirm('This will delete ALL docks, riders, and bookings. Continue?')) return;
    try {
      await clearAllData();
      window.location.reload();
    } catch (err) {
      alert('Failed to clear data: ' + err.message);
    }
  };

  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <h1 className="logo">Bicycle Dock Manager</h1>
          <div className="nav-links">
            <NavLink to="/" end>Docks</NavLink>
            <NavLink to="/riders">Riders</NavLink>
            <NavLink to="/booked-docks">Booked Docks</NavLink>
            <button className="btn btn-danger btn-sm" onClick={handleClearData}>Clear Data</button>
          </div>
        </nav>
        <main className="content">
          <Routes>
            <Route path="/" element={<DocksPage />} />
            <Route path="/riders" element={<RidersPage />} />
            <Route path="/booked-docks" element={<BookedDocksPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
