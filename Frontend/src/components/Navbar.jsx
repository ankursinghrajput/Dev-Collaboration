import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState, useRef, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser, theme, toggleTheme } = useContext(UserContext);
  const isLoginPage = location.pathname === '/login' || location.pathname === '/signup';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef(null);

  const mainLinks = [
    { name: 'Feed', path: '/feed' },
    { name: 'Connections', path: '/connections' },
    { name: 'Messages', path: '/messages' },
  ];

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav style={{
      background: 'var(--glass-bg)',
      borderBottom: '1px solid var(--glass-border)',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <Link to="/feed" style={{ 
            fontSize: '1.5rem', 
            fontWeight: '800', 
            color: 'var(--text-primary)',
            letterSpacing: '-0.025em',
            textShadow: '0 2px 10px rgba(255,255,255,0.5)'
          }}>
            DevTinder<span style={{ color: 'var(--accent-primary)' }}>.</span>
          </Link>

          {/* Desktop Navigation Links */}
          {!isLoginPage && user && (
            <div className="desktop-only" style={{ display: 'flex', gap: '1.5rem' }}>
              {mainLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link 
                    key={link.name} 
                    to={link.path}
                    style={{
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontWeight: isActive ? '600' : '500',
                      textDecoration: 'none',
                      transition: 'color 0.2s'
                    }}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {!isLoginPage && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Avatar Dropdown */}
              <div className="desktop-only" style={{ position: 'relative' }} ref={avatarMenuRef}>
                <button 
                  onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                    Hi, {(user.name || 'User').split(' ')[0]}
                  </span>
                  <div style={{ 
                    width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', 
                    backgroundColor: 'var(--accent-primary)', border: '2px solid white',
                    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)', flexShrink: 0
                  }}>
                    {user.photoUrl ? (
                      <img src={user.photoUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                        {(user.name || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </button>

                {avatarMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    width: '200px',
                    background: 'var(--surface-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                  }}>
                    <Link to="/profile" onClick={() => setAvatarMenuOpen(false)} style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.875rem', borderBottom: '1px solid var(--border-color)' }}>
                      My Profile
                    </Link>
                    <Link to="/profile/edit" onClick={() => setAvatarMenuOpen(false)} style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.875rem', borderBottom: '1px solid var(--border-color)' }}>
                      Edit Profile
                    </Link>
                    <button onClick={() => { toggleTheme(); setAvatarMenuOpen(false); }} style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', fontSize: '0.875rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid var(--border-color)' }}>
                      Theme: {theme === 'dark' ? 'Dark' : 'Light'}
                    </button>
                    <button onClick={handleLogout} style={{ padding: '0.75rem 1rem', color: '#ef4444', fontSize: '0.875rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
              
              {/* Mobile Hamburger */}
              <button 
                className="mobile-only"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                ☰
              </button>
            </div>
          ) : !isLoginPage ? (
            <Link to="/login">
              <button className="btn-primary">
                Log In
              </button>
            </Link>
          ) : null}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && !isLoginPage && user && (
        <div className="mobile-only" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'var(--surface-color)',
          borderBottom: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem'
        }}>
          {mainLinks.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '1rem',
                color: 'var(--text-primary)',
                fontWeight: '500',
                borderBottom: '1px solid var(--border-color)',
                textDecoration: 'none'
              }}
            >
              {item.name}
            </Link>
          ))}
          <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: '500', borderBottom: '1px solid var(--border-color)', textDecoration: 'none' }}>
            My Profile
          </Link>
          <Link to="/profile/edit" onClick={() => setMobileMenuOpen(false)} style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: '500', borderBottom: '1px solid var(--border-color)', textDecoration: 'none' }}>
            Edit Profile
          </Link>
          <button onClick={() => { toggleTheme(); setMobileMenuOpen(false); }} style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: '500', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid var(--border-color)' }}>
            Theme: {theme === 'dark' ? 'Dark' : 'Light'}
          </button>
          <button onClick={handleLogout} style={{ padding: '1rem', color: '#ef4444', fontWeight: '500', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
