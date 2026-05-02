import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import Connections from './pages/Connections';
import EditProfile from './pages/EditProfile';
import Profile from './pages/Profile';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <Router>
      <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, padding: '2rem 0' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
