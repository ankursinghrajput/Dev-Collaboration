import { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import NetworkBackground from '../components/NetworkBackground';
import { UserContext } from '../context/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/login', { email, password });
      
      if (response.status === 200) {
        await fetchUser();
        navigate('/feed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '70vh',
      position: 'relative'
    }}>
      <NetworkBackground />
      <div style={{
        background: 'var(--glass-gradient)',
        padding: '3.5rem 2.5rem',
        borderRadius: '1.5rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        width: '100%',
        maxWidth: '420px',
        borderTop: '1px solid var(--glass-border)',
        borderLeft: '1px solid var(--glass-border)',
        borderRight: '1px solid transparent',
        borderBottom: '1px solid transparent',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Sign in to continue to DevTinder
          </p>
        </div>

        {location.state?.message && (
          <div style={{
            backgroundColor: 'rgba(220, 252, 231, 0.8)',
            color: '#166534',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            textAlign: 'center',
            border: '1px solid #bbf7d0'
          }}>
            {location.state.message}
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: 'rgba(254, 226, 226, 0.8)',
            color: '#dc2626',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            textAlign: 'center',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>Password</label>
              <a href="#" style={{ fontSize: '0.75rem', fontWeight: '500' }}>Forgot password?</a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isLoading}
            style={{ 
              marginTop: '1rem',
              padding: '0.75rem',
              fontSize: '1rem',
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/signup" style={{ fontWeight: '600' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
