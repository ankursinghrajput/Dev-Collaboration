import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserCard from '../components/UserCard';
import { UserContext } from '../context/UserContext';

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unfollowTarget, setUnfollowTarget] = useState(null); // user to confirm unfollow
  const [unfollowLoading, setUnfollowLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const fetchData = async () => {
    try {
      const [connectionsRes, requestsRes, sentRequestsRes] = await Promise.all([
        axios.get('/api/user/connections'),
        axios.get('/api/user/requests/received'),
        axios.get('/api/user/requests/sent')
      ]);
      if (connectionsRes.data.data) {
        setConnections(connectionsRes.data.data);
      }
      if (requestsRes.data.receivedRequests) {
        setPendingRequests(requestsRes.data.receivedRequests);
      }
      if (sentRequestsRes.data.sentRequests) {
        setSentRequests(sentRequestsRes.data.sentRequests);
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

  useEffect(() => {
    if (user) {
      fetchData();
    } else if (user === null && !loading) {
      navigate('/login');
    }
  }, [navigate, user]);

  const handleReviewRequest = async (status, requestId) => {
    try {
      await axios.post(`/api/request/review/${status}/${requestId}`);
      setPendingRequests(prev => prev.filter(r => r._id !== requestId));
      // If accepted, re-fetch connections to show the new connection
      if (status === 'accepted') {
        const res = await axios.get('/api/user/connections');
        if (res.data.data) {
          setConnections(res.data.data);
        }
      }
    } catch (err) {
      console.error('Failed to review request', err);
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      await axios.delete(`/api/request/cancel/${requestId}`);
      setSentRequests(prev => prev.filter(r => r._id !== requestId));
    } catch (err) {
      console.error('Failed to cancel request', err);
    }
  };

  const handleUnfollow = async () => {
    if (!unfollowTarget) return;
    setUnfollowLoading(true);
    try {
      await axios.delete(`/api/request/unfollow/${unfollowTarget._id}`);
      setConnections(prev => prev.filter(c => c._id !== unfollowTarget._id));
      setUnfollowTarget(null);
    } catch (err) {
      console.error('Failed to unfollow', err);
    } finally {
      setUnfollowLoading(false);
    }
  };

  if (loading && !user) {
    return <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="container page-layout">
      <div className="feed-content" style={{ paddingBottom: '2rem' }}>

        {/* ── Pending Requests Section ── */}
        <header style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
            Pending Requests
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '1rem' }}>
            Developers who want to connect with you
          </p>
        </header>

        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading requests...</p>
        ) : error ? (
          <div style={{ padding: '2rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
            <p>{error}</p>
          </div>
        ) : pendingRequests.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2.5rem 2rem',
            backgroundColor: 'var(--surface-color)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border-color)',
            marginBottom: '3rem'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', opacity: 0.5 }}>📭</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.25rem' }}>No pending requests</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>When someone sends you a connection request, it will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
            {pendingRequests.map(request => (
              <UserCard 
                key={request._id} 
                user={request.sender}
                reviewMode={true}
                requestId={request._id}
                onAction={handleReviewRequest}
              />
            ))}
          </div>
        )}

        {/* ── Divider ── */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--border-color), transparent)',
          margin: '1rem 0 2rem 0'
        }} />

        {/* ── Sent Requests Section ── */}
        <header style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
            Sent Requests
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '1rem' }}>
            People you want to connect with
          </p>
        </header>

        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading sent requests...</p>
        ) : sentRequests.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2.5rem 2rem',
            backgroundColor: 'var(--surface-color)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border-color)',
            marginBottom: '3rem'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', opacity: 0.5 }}>📤</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.25rem' }}>No sent requests</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>You haven't sent any connection requests yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
            {sentRequests.map(request => (
              <UserCard 
                key={request._id} 
                user={request.receiver}
                sentMode={true}
                requestId={request._id}
                onCancel={handleCancelRequest}
              />
            ))}
          </div>
        )}

        {/* ── Divider ── */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--border-color), transparent)',
          margin: '1rem 0 2rem 0'
        }} />

        {/* ── Accepted Connections Section ── */}
        <header style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
            My Connections
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '1rem' }}>
            People you've connected with. Say hi!
          </p>
        </header>

        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading connections...</p>
        ) : connections.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2.5rem 2rem',
            backgroundColor: 'var(--surface-color)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border-color)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', opacity: 0.5 }}>🤝</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.25rem' }}>No connections yet</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Go to the feed and start connecting with developers!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {connections.map(connection => (
              <UserCard 
                key={connection._id} 
                user={connection} 
                connectionMode={true}
                onUnfollow={() => setUnfollowTarget(connection)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Unfollow Confirmation Modal ── */}
      {unfollowTarget && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'modalFadeIn 0.2s ease-out'
          }}
          onClick={() => !unfollowLoading && setUnfollowTarget(null)}
        >
          <div 
            style={{
              backgroundColor: 'var(--surface-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              width: '100%',
              maxWidth: '420px',
              margin: '1rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--border-color)',
              animation: 'modalSlideUp 0.25s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                fontSize: '1.5rem'
              }}>
                ⚠️
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Unfollow {unfollowTarget.name}?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                This will remove the connection between you and <strong style={{ color: 'var(--text-primary)' }}>{unfollowTarget.name}</strong>. 
                Both of you will reappear in each other's feed.
              </p>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setUnfollowTarget(null)}
                disabled={unfollowLoading}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUnfollow}
                disabled={unfollowLoading}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: unfollowLoading ? 'not-allowed' : 'pointer',
                  opacity: unfollowLoading ? 0.7 : 1,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                }}
              >
                {unfollowLoading ? 'Unfollowing...' : 'Yes, Unfollow'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Connections;
