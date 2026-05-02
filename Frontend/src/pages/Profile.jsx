import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });
    setIsUpdatingPassword(true);

    try {
      const response = await axios.patch('/api/profile/password', passwordData);
      if (response.status === 200) {
        setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({ oldPassword: '', newPassword: '' });
      }
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password.' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (!user) {
    return <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="container page-layout">
      <div style={{ paddingBottom: '2rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
            My Profile
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '1rem' }}>
            Manage your account settings and preferences.
          </p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Profile Overview Card */}
          <div style={{
            backgroundColor: 'var(--surface-color)',
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '2rem'
          }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', overflow: 'hidden', flexShrink: 0, border: '4px solid var(--surface-color)', boxShadow: 'var(--shadow-sm)' }}>
              {user.photoUrl ? (
                <img src={user.photoUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'white', fontWeight: 'bold' }}>
                  {(user.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{user.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1rem' }}>
                {[user.age, user.gender].filter(Boolean).join(' • ')}
              </p>
              
              <p style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                {user.about || "No description provided."}
              </p>
              
              {user.skills && user.skills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {user.skills.map((skill, index) => (
                    <span key={index} style={{
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      color: 'var(--accent-primary)',
                      padding: '0.35rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <Link to="/profile/edit">
                <button className="btn-primary" style={{ padding: '0.625rem 1.5rem' }}>
                  Edit Profile Information
                </button>
              </Link>
            </div>
          </div>

          {/* Change Password Card */}
          <div style={{
            backgroundColor: 'var(--surface-color)',
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-color)',
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Change Password</h3>
            
            {passwordMessage.text && (
              <div style={{
                backgroundColor: passwordMessage.type === 'success' ? 'rgba(220, 252, 231, 0.5)' : 'rgba(254, 226, 226, 0.5)',
                color: passwordMessage.type === 'success' ? '#166534' : '#dc2626',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                border: `1px solid ${passwordMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`
              }}>
                {passwordMessage.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '400px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Current Password</label>
                <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} className="input-field" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>New Password</label>
                <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="input-field" required />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Must be strong (min 8 chars, uppercase, lowercase, number, symbol)
                </p>
              </div>
              <button type="submit" className="btn-primary" disabled={isUpdatingPassword} style={{ opacity: isUpdatingPassword ? 0.7 : 1, width: 'fit-content' }}>
                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div style={{
            backgroundColor: 'var(--surface-color)',
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ef4444', marginBottom: '0.5rem' }}>Danger Zone</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Once you log out, you will need to enter your credentials to access your account again.
            </p>
            <button onClick={handleLogout} className="btn-primary" style={{ backgroundColor: '#ef4444' }}>
              Log Out of DevTinder
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
