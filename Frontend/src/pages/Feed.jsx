import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserCard from '../components/UserCard';

const Feed = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await axios.get('/api/feed', {
          withCredentials: true 
        });
        
        if (response.data.feedUsers) {
          setUsers(response.data.feedUsers);
        } else if (response.data.users) {
           setUsers(response.data.users);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to load feed. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading potential matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
        <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: 'var(--radius-md)' }}>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => window.location.reload()} style={{ marginTop: '1rem', backgroundColor: '#dc2626' }}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-layout">
      <div className="feed-content" style={{ paddingBottom: '2rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
            Developer Feed
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '1rem' }}>
            Find your next collaboration partner
          </p>
        </header>

        {users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '0.5rem' }}>No developers found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>You have seen all the profiles! Check back later for more.</p>
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem' 
          }}>
            {users.map(user => (
              <UserCard key={user._id} user={user} onAction={async (status, userId) => {
                try {
                  await axios.post(`/api/request/send/${status}/${userId}`);
                  setUsers(prev => prev.filter(u => u._id !== userId));
                } catch (err) {
                  console.error('Failed to perform action:', err);
                }
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
