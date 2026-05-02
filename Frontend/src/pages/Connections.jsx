import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserCard from '../components/UserCard';
import { UserContext } from '../context/UserContext';

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await axios.get('/api/user/connections');
        if (response.data.data) {
          setConnections(response.data.data);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to load connections.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchConnections();
    } else if (user === null && !loading) {
        navigate('/login');
    }
  }, [navigate, user]);

  if (loading && !user) {
    return <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="container page-layout">
      <div className="feed-content" style={{ paddingBottom: '2rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
            My Connections
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '1rem' }}>
            People you've matched with. Say hi!
          </p>
        </header>

        {loading ? (
            <p>Loading connections...</p>
        ) : error ? (
            <div style={{ padding: '2rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: 'var(--radius-md)' }}>
              <p>{error}</p>
            </div>
        ) : connections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '0.5rem' }}>No connections yet</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Go to the feed and start connecting with developers!</p>
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem' 
          }}>
            {connections.map(connection => (
              <UserCard key={connection._id} user={connection} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
