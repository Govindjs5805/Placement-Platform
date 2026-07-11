import React from 'react';
import './QuickStats.css';

const QuickStats = ({ stats }) => {
  const statCards = [
    { title: 'Total Points', value: stats.totalPoints, icon: '🏆', color: '#10b981' },
    { title: 'Questions Solved', value: stats.questionsCompleted, icon: '✅', color: '#3b82f6' },
    { title: 'Current Streak', value: `${stats.currentStreak} days`, icon: '🔥', color: '#f59e0b' },
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

export default QuickStats;