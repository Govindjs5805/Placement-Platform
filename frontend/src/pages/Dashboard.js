import React, { useState, useEffect } from 'react';
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
    <div className={`dashboard ${theme}`}>
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
                        style={{ width: `${section.progress}%`, backgroundColor: section.color }}
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

export default Dashboard;