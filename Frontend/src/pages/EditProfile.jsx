import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const EditProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'other',
    about: '',
    skills: '',
    photoUrl: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      // Could wait for load, or just return if context is still fetching
      return;
    }
    setFormData({
      name: user.name || '',
      age: user.age || '',
      gender: user.gender || 'other',
      about: user.about || '',
      skills: user.skills ? user.skills.join(', ') : '',
      photoUrl: user.photoUrl || ''
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setIsLoading(true);

    try {
      // Backend expects skills as array
      const skillsArray = formData.skills ? formData.skills.split(',').map(s => s.trim()) : [];
      const payload = { ...formData, skills: skillsArray, age: Number(formData.age) };

      const response = await axios.patch('/api/profile/edit', payload);
      if (response.status === 200) {
        setUser(response.data.user); // Update global context immediately
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setIsLoading(false);
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
            Edit Profile
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '1rem' }}>
            Update your developer info to get better matches.
          </p>
        </header>

        <div style={{
          backgroundColor: 'var(--surface-color)',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-color)',
        }}>
          {message.text && (
            <div style={{
              backgroundColor: message.type === 'success' ? 'rgba(220, 252, 231, 0.5)' : 'rgba(254, 226, 226, 0.5)',
              color: message.type === 'success' ? '#166534' : '#dc2626',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" required />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Photo URL</label>
                <input type="url" name="photoUrl" value={formData.photoUrl} onChange={handleChange} className="input-field" placeholder="https://..." />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} className="input-field" min="18" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Skills (comma separated)</label>
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="input-field" placeholder="React, Node.js, MongoDB" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>About</label>
              <textarea name="about" value={formData.about} onChange={handleChange} className="input-field" rows="4" placeholder="Tell us about yourself..."></textarea>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: '1rem', padding: '0.875rem', fontSize: '1rem', opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
