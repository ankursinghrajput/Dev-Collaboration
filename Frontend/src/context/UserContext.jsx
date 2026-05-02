import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/profile');
      if (response.data && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.log("No active session found.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, fetchUser, theme, toggleTheme }}>
      {children}
    </UserContext.Provider>
  );
};
