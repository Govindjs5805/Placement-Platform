const fs = require('fs');
const path = require('path');

const frontendComponents = {
  // ==================== CONTEXT FILES ====================
  'frontend/src/context/ThemeContext.js': `import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = \`\${theme}-theme\`;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};`,

  'frontend/src/context/AuthContext.js': `import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const res = await axios.get(\`\${API_URL}/user/profile\`);
      setUser(res.data);
    } catch (err) {
      console.error(err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post(\`\${API_URL}/auth/login\`, { email, password });
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['x-auth-token'] = res.data.token;
    setUser(res.data.user);
    return res.data;
  };

  const signup = async (name, email, password) => {
    const res = await axios.post(\`\${API_URL}/auth/register\`, { name, email, password });
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['x-auth-token'] = res.data.token;
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
  };

  const updateProfile = async (profileData) => {
    const res = await axios.put(\`\${API_URL}/user/profile\`, profileData);
    setUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      signup,
      logout,
      updateProfile,
      loadUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};`,

  // ==================== COMPONENTS ====================
  'frontend/src/components/ProtectedRoute.js': `import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem',
        color: '#10b981'
      }}>
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;`,

  'frontend/src/components/Sidebar.js': `import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: '📊' },
    { title: 'TCS NQT', path: '/tcs-nqt', icon: '🎯' },
    { title: 'Interview Prep', path: '/section/interview-preparation', icon: '💼' },
    { title: 'Numerical Aptitude', path: '/section/numerical-aptitude', icon: '🔢' },
    { title: 'Logical Reasoning', path: '/section/logical-reasoning', icon: '🧠' },
    { title: 'Verbal Ability', path: '/section/verbal-ability', icon: '📚' },
    { title: 'HR Interview', path: '/section/hr-interview', icon: '👥' },
    { title: 'Group Discussion', path: '/section/group-discussion', icon: '💬' },
    { title: 'Leaderboard', path: '/leaderboard', icon: '🏆' }
  ];

  return (
    <aside className={\`sidebar \${collapsed ? 'collapsed' : ''}\`}>
      <div className="sidebar-header">
        <h2>PlacementPro</h2>
        <button onClick={() => setCollapsed(!collapsed)}>☰</button>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className={\`nav-item \${location.pathname === item.path ? 'active' : ''}\`}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span>{item.title}</span>}
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={logout}>
          <span className="nav-icon">🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;`,

  'frontend/src/components/Sidebar.css': `.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 280px;
  background: var(--surface-light, #f8fafc);
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  z-index: 1000;
}

.dark-theme .sidebar {
  background: #1e293b;
  border-right-color: #334155;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dark-theme .sidebar-header {
  border-bottom-color: #334155;
}

.sidebar-header h2 {
  font-size: 1.25rem;
  color: #10b981;
}

.sidebar-header button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: inherit;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  color: inherit;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.nav-item:hover {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.nav-item.active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border-right: 4px solid #10b981;
  font-weight: 600;
}

.nav-icon {
  font-size: 1.25rem;
  min-width: 24px;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
}

.dark-theme .sidebar-footer {
  border-top-color: #334155;
}

.logout-btn {
  color: #ef4444;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}

@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
  }
  .sidebar.mobile-open {
    transform: translateX(0);
  }
}`,

  'frontend/src/components/Header.js': `import React, { useState } from 'react';
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

export default Header;`,

  'frontend/src/components/Header.css': `.header {
  height: 80px;
  background: var(--surface-light, #fff);
  border-bottom: 1px solid #e2e8f0;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.dark-theme .header {
  background: #1e293b;
  border-bottom-color: #334155;
}

.header-search input {
  width: 400px;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.95rem;
}

.dark-theme .header-search input {
  background: #0f172a;
  border-color: #334155;
  color: #f1f5f9;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-toggle {
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  width: 44px;
  height: 44px;
  font-size: 1.25rem;
  cursor: pointer;
}

.dark-theme .theme-toggle {
  border-color: #334155;
}

.profile-menu {
  position: relative;
}

.profile-menu button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  cursor: pointer;
  color: inherit;
}

.dark-theme .profile-menu button {
  border-color: #334155;
}

.profile-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: var(--surface-light, #fff);
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  min-width: 200px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.dark-theme .dropdown {
  background: #1e293b;
  border-color: #334155;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: rgba(16, 185, 129, 0.1);
}`,

  'frontend/src/components/QuickStats.js': `import React from 'react';
import './QuickStats.css';

const QuickStats = ({ stats }) => {
  const statCards = [
    { title: 'Total Points', value: stats.totalPoints, icon: '🏆', color: '#10b981' },
    { title: 'Questions Solved', value: stats.questionsCompleted, icon: '✅', color: '#3b82f6' },
    { title: 'Current Streak', value: \`\${stats.currentStreak} days\`, icon: '🔥', color: '#f59e0b' },
    { title: 'Global Rank', value: stats.rank || 'N/A', icon: '📈', color: '#8b5cf6' }
  ];

  return (
    <div className="quick-stats">
      {statCards.map((stat, i) => (
        <div key={i} className="stat-card">
          <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
          <div className="stat-info">
            <h3>{stat.value}</h3>
            <p>{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;`,

  'frontend/src/components/QuickStats.css': `.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--surface-light, #fff);
  padding: 1.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.dark-theme .stat-card {
  background: #1e293b;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 2rem;
}

.stat-info h3 {
  font-size: 1.75rem;
  margin-bottom: 0.25rem;
}

.stat-info p {
  opacity: 0.7;
  font-size: 0.9rem;
}`,

  'frontend/src/components/RecentActivity.js': `import React from 'react';
import './RecentActivity.css';

const RecentActivity = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="recent-activity card">
        <h3>Recent Activity</h3>
        <p className="empty">No recent activity. Start practicing!</p>
      </div>
    );
  }

  return (
    <div className="recent-activity card">
      <h3>Recent Activity</h3>
      <div className="activity-list">
        {activities.slice().reverse().slice(0, 8).map((activity, i) => (
          <div key={i} className="activity-item">
            <div className="activity-icon">✅</div>
            <div className="activity-details">
              <h4>{activity.subcategory}</h4>
              <p>{new Date(activity.date).toLocaleDateString()}</p>
            </div>
            <div className="activity-points">+{activity.score || 10}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;`,

  'frontend/src/components/RecentActivity.css': `.recent-activity {
  background: var(--surface-light, #fff);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark-theme .recent-activity {
  background: #1e293b;
}

.recent-activity h3 {
  margin-bottom: 1.5rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: background 0.2s;
}

.activity-item:hover {
  background: rgba(16, 185, 129, 0.05);
}

.activity-icon {
  font-size: 1.5rem;
}

.activity-details {
  flex: 1;
}

.activity-details h4 {
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.activity-details p {
  font-size: 0.85rem;
  opacity: 0.7;
}

.activity-points {
  color: #10b981;
  font-weight: 600;
}

.empty {
  text-align: center;
  padding: 2rem;
  opacity: 0.5;
}`,

  'frontend/src/components/ProgressCard.js': `import React from 'react';
import './ProgressCard.css';

const ProgressCard = ({ user }) => {
  const totalCompleted = user?.completedQuestions?.length || 0;

  return (
    <div className="progress-card card">
      <h3>Overall Progress</h3>
      <div className="progress-circle">
        <div className="circle-content">
          <h2>{totalCompleted}</h2>
          <p>Completed</p>
        </div>
      </div>
      <div className="progress-stats">
        <div className="stat-item">
          <span>TCS NQT</span>
          <strong>{user?.progress?.tcsNqt?.aptitude?.numericalAbility?.completed || 0}</strong>
        </div>
        <div className="stat-item">
          <span>Interview</span>
          <strong>{user?.progress?.interviewPreparation?.completed || 0}</strong>
        </div>
        <div className="stat-item">
          <span>Coding</span>
          <strong>{user?.progress?.tcsNqt?.coding?.easy?.completed || 0}</strong>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;`,

  'frontend/src/components/ProgressCard.css': `.progress-card {
  background: var(--surface-light, #fff);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark-theme .progress-card {
  background: #1e293b;
}

.progress-card h3 {
  margin-bottom: 1.5rem;
}

.progress-circle {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.circle-content {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.circle-content h2 {
  font-size: 2.5rem;
  margin-bottom: 0.25rem;
}

.circle-content p {
  font-size: 0.9rem;
  opacity: 0.9;
}

.progress-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: rgba(16, 185, 129, 0.05);
  border-radius: 0.5rem;
}

.stat-item strong {
  color: #10b981;
}`,

  // ==================== UPDATE APP.JS ====================
  'frontend/src/App.js': `import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import TCSNQTSection from './pages/TCSNQTSection';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile-setup" element={
              <ProtectedRoute>
                <ProfileSetup />
              </ProtectedRoute>
            } />
            <Route path="/tcs-nqt" element={
              <ProtectedRoute>
                <TCSNQTSection />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;`,

  'frontend/src/App.css': `:root {
  --primary-green: #10b981;
  --primary-green-dark: #059669;
  --primary-green-light: #34d399;
  --background-light: #ffffff;
  --background-dark: #0f172a;
  --surface-light: #f8fafc;
  --surface-dark: #1e293b;
  --text-light: #0f172a;
  --text-dark: #f1f5f9;
  --border-light: #e2e8f0;
  --border-dark: #334155;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.3s ease;
}

.light-theme {
  background-color: var(--background-light);
  color: var(--text-light);
}

.dark-theme {
  background-color: var(--background-dark);
  color: var(--text-dark);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn-primary {
  background-color: var(--primary-green);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-green-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.btn-outline {
  background-color: transparent;
  border: 2px solid var(--primary-green);
  color: var(--primary-green);
}

.btn-outline:hover {
  background-color: var(--primary-green);
  color: white;
}

.card {
  background-color: var(--surface-light);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.dark-theme .card {
  background-color: var(--surface-dark);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-light);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: transparent;
  color: inherit;
}

.dark-theme .input {
  border-color: var(--border-dark);
}

.input:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}`,

  // ==================== PAGES ====================
  'frontend/src/pages/HomePage.js': `import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './HomePage.css';

const HomePage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="logo">🏆 PlacementPro</div>
        <div className="nav-links">
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <Link to="/login" className="btn btn-outline">Login</Link>
          <Link to="/signup" className="btn btn-primary">Sign Up</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Your Ultimate <span className="gradient-text">Placement Preparation</span> Platform</h1>
          <p>Master aptitude, coding, and interviews with our comprehensive preparation platform.</p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary btn-large">Get Started Free</Link>
            <button className="btn btn-outline btn-large">Learn More</button>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Everything You Need to Succeed</h2>
        <div className="features-grid">
          <div className="feature-card card">
            <div className="feature-icon">🎯</div>
            <h3>TCS NQT Preparation</h3>
            <p>Comprehensive prep for TCS NQT with aptitude, coding, and interviews</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Interviews</h3>
            <p>Practice with AI voice interviews to boost your confidence</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">💻</div>
            <h3>Coding Practice</h3>
            <p>Curated LeetCode problems for placement preparation</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>Monitor your improvement with detailed analytics</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">🏆</div>
            <h3>Leaderboards</h3>
            <p>Compete with friends and global users</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">💬</div>
            <h3>Group Discussions</h3>
            <p>Practice GD topics and improve communication</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 PlacementPro. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;`,

  'frontend/src/pages/HomePage.css': `.home-page {
  min-height: 100vh;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 5%;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.dark-theme .navbar {
  background: rgba(15, 23, 42, 0.8);
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-green);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.hero {
  padding: 6rem 5%;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero-content {
  max-width: 800px;
}

.hero h1 {
  font-size: 3.5rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, #10b981, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero p {
  font-size: 1.25rem;
  opacity: 0.8;
  margin-bottom: 2rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.features {
  padding: 6rem 5%;
  background: var(--surface-light);
}

.dark-theme .features {
  background: var(--surface-dark);
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 4rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  text-align: center;
  padding: 2rem;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.feature-card p {
  opacity: 0.7;
  line-height: 1.6;
}

.footer {
  padding: 2rem 5%;
  text-align: center;
  border-top: 1px solid var(--border-light);
}

.dark-theme .footer {
  border-top-color: var(--border-dark);
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }
  .features-grid {
    grid-template-columns: 1fr;
  }
}`,

  'frontend/src/pages/LoginPage.js': `import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import './AuthPages.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <button onClick={toggleTheme} className="theme-toggle-auth">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <div className="auth-container">
        <div className="auth-left">
          <h1>🏆 PlacementPro</h1>
          <p>Your journey to success starts here</p>
        </div>
        <div className="auth-right">
          <div className="auth-form-container">
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Login to continue your preparation</p>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <p className="auth-switch">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;`,

  'frontend/src/pages/SignupPage.js': `import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import './AuthPages.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password);
      toast.success('Account created successfully!');
      navigate('/profile-setup');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <button onClick={toggleTheme} className="theme-toggle-auth">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <div className="auth-container">
        <div className="auth-left">
          <h1>🏆 PlacementPro</h1>
          <p>Start your placement preparation journey</p>
        </div>
        <div className="auth-right">
          <div className="auth-form-container">
            <h2>Create Account</h2>
            <p className="auth-subtitle">Join thousands of successful candidates</p>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            <p className="auth-switch">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;`,

  'frontend/src/pages/AuthPages.css': `.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
}

.theme-toggle-auth {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: var(--surface-light);
  border: 2px solid var(--border-light);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  z-index: 1000;
}

.dark-theme .theme-toggle-auth {
  background: var(--surface-dark);
  border-color: var(--border-dark);
}

.auth-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1200px;
  width: 100%;
  background: var(--surface-light);
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.dark-theme .auth-container {
  background: var(--surface-dark);
}

.auth-left {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.auth-left h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.auth-right {
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-form-container {
  width: 100%;
  max-width: 400px;
}

.auth-form-container h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  opacity: 0.7;
  margin-bottom: 2rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
}

.btn-full {
  width: 100%;
  margin-top: 0.5rem;
}

.auth-switch {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  opacity: 0.7;
}

.auth-switch a {
  color: var(--primary-green);
  text-decoration: none;
  font-weight: 600;
}

.auth-switch a:hover {
  text-decoration: underline;
}

@media (max-width: 968px) {
  .auth-container {
    grid-template-columns: 1fr;
  }
  .auth-left {
    display: none;
  }
}`,

  'frontend/src/pages/Dashboard.js': `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import QuickStats from '../components/QuickStats';
import RecentActivity from '../components/RecentActivity';
import ProgressCard from '../components/ProgressCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPoints: 0,
    questionsCompleted: 0,
    currentStreak: 0,
    rank: 0
  });

  useEffect(() => {
    if (user) {
      setStats({
        totalPoints: user.points || 0,
        questionsCompleted: user.completedQuestions?.length || 0,
        currentStreak: 0,
        rank: 0
      });
    }
  }, [user]);

  const sections = [
    { id: 'tcs-nqt', title: 'TCS NQT', icon: '🎯', color: '#10b981', path: '/tcs-nqt', progress: 25 },
    { id: 'interview', title: 'Interview Prep', icon: '💼', color: '#3b82f6', path: '/section/interview-preparation', progress: 15 },
    { id: 'numerical', title: 'Numerical Aptitude', icon: '🔢', color: '#8b5cf6', path: '/section/numerical-aptitude', progress: 30 },
    { id: 'logical', title: 'Logical Reasoning', icon: '🧠', color: '#f59e0b', path: '/section/logical-reasoning', progress: 20 },
    { id: 'verbal', title: 'Verbal Ability', icon: '📚', color: '#ec4899', path: '/section/verbal-ability', progress: 18 },
    { id: 'hr', title: 'HR Interview', icon: '👥', color: '#06b6d4', path: '/section/hr-interview', progress: 10 }
  ];

  return (
    <div className={\`dashboard \${theme}\`}>
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        <div className="dashboard-content">
          <div className="welcome-section">
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p>Continue your placement preparation journey</p>
          </div>

          <QuickStats stats={stats} />

          <div className="sections-grid">
            <h2 className="section-title">Your Learning Paths</h2>
            <div className="grid">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="section-card card"
                  onClick={() => navigate(section.path)}
                >
                  <div className="section-icon" style={{ color: section.color }}>
                    {section.icon}
                  </div>
                  <h3>{section.title}</h3>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: \`\${section.progress}%\`, backgroundColor: section.color }}
                      />
                    </div>
                    <span className="progress-text">{section.progress}%</span>
                  </div>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ borderColor: section.color, color: section.color }}
                  >
                    Continue
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-lower">
            <RecentActivity activities={user?.completedQuestions || []} />
            <ProgressCard user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;`,

  'frontend/src/pages/Dashboard.css': `.dashboard {
  display: flex;
  min-height: 100vh;
}

.dashboard-main {
  flex: 1;
  margin-left: 280px;
  transition: margin-left 0.3s ease;
}

.dashboard-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.welcome-section {
  margin-bottom: 2rem;
}

.welcome-section h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.welcome-section p {
  opacity: 0.7;
  font-size: 1.125rem;
}

.sections-grid {
  margin-top: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.section-card {
  cursor: pointer;
  padding: 2rem;
  transition: all 0.3s ease;
}

.section-card:hover {
  transform: translateY(-4px);
}

.section-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.section-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.progress-container {
  margin: 1rem 0;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--border-light);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.dark-theme .progress-bar {
  background: var(--border-dark);
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 4px;
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary-green);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.dashboard-lower {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-top: 3rem;
}

@media (max-width: 1024px) {
  .dashboard-main {
    margin-left: 0;
  }
  .dashboard-lower {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 1rem;
  }
  .grid {
    grid-template-columns: 1fr;
  }
}`,

  'frontend/src/pages/ProfileSetup.js': `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ProfileSetup.css';

const ProfileSetup = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    skills: '',
    interests: '',
    education: '',
    college: '',
    graduationYear: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const profileData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
        graduationYear: parseInt(formData.graduationYear) || null
      };
      await updateProfile(profileData);
      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-setup">
      <div className="profile-container">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Complete Your Profile</h1>
        <p className="subtitle">Help us personalize your preparation journey</p>
        <form onSubmit={handleSubmit} className="profile-form card">
          <div className="form-grid">
            <div className="form-group">
              <label>Skills (comma separated)</label>
              <input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="input"
                placeholder="Java, Python, React..."
              />
            </div>
            <div className="form-group">
              <label>Interests (comma separated)</label>
              <input
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                className="input"
                placeholder="Web Dev, AI..."
              />
            </div>
            <div className="form-group">
              <label>Education</label>
              <select name="education" value={formData.education} onChange={handleChange} className="input">
                <option value="">Select</option>
                <option value="B.Tech">B.Tech</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
              </select>
            </div>
            <div className="form-group">
              <label>College</label>
              <input
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="input"
                placeholder="Your college"
              />
            </div>
            <div className="form-group">
              <label>Graduation Year</label>
              <input
                name="graduationYear"
                type="number"
                value={formData.graduationYear}
                onChange={handleChange}
                className="input"
                placeholder="2024"
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input"
                placeholder="+91 XXXXX"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;`,

  'frontend/src/pages/ProfileSetup.css': `.profile-setup {
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.profile-container {
  max-width: 900px;
  width: 100%;
}

.back-btn {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.back-btn:hover {
  opacity: 1;
}

.profile-container h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  opacity: 0.7;
  margin-bottom: 2rem;
}

.profile-form {
  padding: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
}

.btn-full {
  width: 100%;
}`,

  'frontend/src/pages/TCSNQTSection.js': `import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './TCSNQTSection.css';

const TCSNQTSection = () => {
  const navigate = useNavigate();

  const examPattern = [
    { section: 'Numerical Ability', questions: 26, duration: '40 min', difficulty: 'Medium' },
    { section: 'Verbal Ability', questions: 24, duration: '30 min', difficulty: 'Easy' },
    { section: 'Reasoning Ability', questions: 30, duration: '50 min', difficulty: 'Medium' },
    { section: 'Coding', questions: 2, duration: '45 min', difficulty: 'Medium' }
  ];

  const modules = [
    { title: 'Aptitude Practice', icon: '📚', description: 'Numerical, Verbal, Reasoning', color: '#10b981' },
    { title: 'Coding Practice', icon: '💻', description: '100+ LeetCode problems', color: '#3b82f6' },
    { title: 'AI Interview', icon: '🎤', description: 'Voice-based mock interview', color: '#8b5cf6' }
  ];

  return (
    <div className="tcs-nqt-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <h1>TCS NQT Preparation</h1>
          <p className="page-subtitle">Master every section with targeted practice</p>

          <div className="exam-pattern card">
            <h2>📋 Exam Pattern</h2>
            <div className="pattern-table">
              <div className="pattern-header">
                <span>Section</span>
                <span>Questions</span>
                <span>Duration</span>
                <span>Difficulty</span>
              </div>
              {examPattern.map((row, i) => (
                <div key={i} className="pattern-row">
                  <span>{row.section}</span>
                  <span>{row.questions}</span>
                  <span>{row.duration}</span>
                  <span className={\`difficulty \${row.difficulty.toLowerCase()}\`}>{row.difficulty}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="modules-grid">
            {modules.map((mod, i) => (
              <div key={i} className="module-card card">
                <div className="module-icon" style={{ color: mod.color }}>{mod.icon}</div>
                <h3>{mod.title}</h3>
                <p>{mod.description}</p>
                <button className="btn btn-outline btn-sm" style={{ borderColor: mod.color, color: mod.color }}>
                  Start Practice →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TCSNQTSection;`,

  'frontend/src/pages/TCSNQTSection.css': `.tcs-nqt-page {
  min-height: 100vh;
}

.main-content {
  margin-left: 280px;
  min-height: 100vh;
}

.page-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-subtitle {
  opacity: 0.7;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.exam-pattern {
  padding: 2rem;
  margin-bottom: 2rem;
}

.exam-pattern h2 {
  margin-bottom: 1.5rem;
}

.pattern-table {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pattern-header,
.pattern-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr;
  padding: 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
}

.pattern-header {
  background: rgba(16, 185, 129, 0.1);
  color: var(--primary-green);
}

.pattern-row {
  background: var(--background-light);
}

.dark-theme .pattern-row {
  background: var(--background-dark);
}

.difficulty {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
}

.difficulty.easy {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.difficulty.medium {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.module-card {
  padding: 2rem;
  cursor: pointer;
  text-align: center;
}

.module-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.module-card h3 {
  margin-bottom: 0.5rem;
}

.module-card p {
  opacity: 0.7;
  margin-bottom: 1.5rem;
}

@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
  }
}`
};

console.log('🎨 Generating Frontend Components...\n');

let created = 0;
let errors = 0;

Object.entries(frontendComponents).forEach(([filePath, content]) => {
  try {
    const fullPath = path.join(__dirname, filePath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, content);
    console.log(`✅ ${filePath}`);
    created++;
  } catch (error) {
    console.log(`❌ Error creating ${filePath}:`, error.message);
    errors++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Created: ${created} files`);
console.log(`   Errors: ${errors}`);
console.log(`\n✨ All frontend components generated!`);
console.log(`\n📋 Final steps:`);
console.log(`   1. git add .`);
console.log(`   2. git commit -m "Add all frontend components and pages"`);
console.log(`   3. git push origin main`);
console.log(`\n🎯 Your PlacementPro is ready!`);
console.log(`\nTo run:`);
console.log(`   cp backend/.env.example backend/.env`);
console.log(`   cp frontend/.env.example frontend/.env`);
console.log(`   npm run install-all`);
console.log(`   npm run seed`);
console.log(`   npm run dev`);
console.log(`\n🚀 Happy coding!\n`);