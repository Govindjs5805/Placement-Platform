import React, { useEffect } from 'react';
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

export default HomePage;