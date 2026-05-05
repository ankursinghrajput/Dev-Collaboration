import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserCard from '../components/UserCard';
import { UserContext } from '../context/UserContext';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/user/${id}`);
        if (res.data.user) {
          setProfileUser(res.data.user);
        } else {
          setError('User not found.');
        }
      } catch (err) {
        setError('Failed to load user profile.');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      if (currentUser._id === id) {
        navigate('/profile'); // Redirect to their own profile page if they search themselves
      } else {
        fetchUser();
      }
    } else {
      navigate('/login');
    }
  }, [id, currentUser, navigate]);

  if (loading) {
    return <div className="container" style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading profile...</div>;
  }

  if (error || !profileUser) {
    return (
      <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>
        <div style={{ padding: '2rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--radius-md)' }}>
          <p>{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-layout">
      <div className="feed-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <header style={{ marginBottom: '2rem', textAlign: 'center', width: '100%' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
            Developer Profile
          </h1>
        </header>
        
        <div style={{ width: '100%' }}>
          {/* Note: In this view, it's just a read-only profile card. 
              The user can send connection requests from the main feed. */}
          <UserCard user={profileUser} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
