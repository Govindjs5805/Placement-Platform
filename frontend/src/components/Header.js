import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="header">
      <div className="header-search">
        <input type="text" placeholder="Search questions, topics..." />
      </div>
      <div className="header-actions">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <div className="profile-menu">
          <button onClick={() => setShowMenu(!showMenu)}>
            <div className="profile-avatar">{user?.name?.charAt(0)}</div>
            <span>{user?.name}</span>
          </button>
          {showMenu && (
            <div className="dropdown">
              <div className="dropdown-item">Points: {user?.points || 0}</div>
              <div className="dropdown-item" onClick={logout}>Logout</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;