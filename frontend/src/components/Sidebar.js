import React, { useState } from 'react';
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
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2>PlacementPro</h2>
        <button onClick={() => setCollapsed(!collapsed)}>☰</button>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
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

export default Sidebar;