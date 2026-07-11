import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [tab, setTab] = useState('global');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [tab]);

  const fetchLeaderboard = async () => {
    try {
      const endpoint = tab === 'global' ? '/api/leaderboard/global' : '/api/leaderboard/friends';
      const res = await axios.get(endpoint);
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <div className={`leaderboard-page ${theme}`}>
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <h1>🏆 Leaderboard</h1>
          <p className="page-subtitle">Compete, climb, and conquer</p>

          <div className="tabs">
            <button
              className={`tab ${tab === 'global' ? 'active' : ''}`}
              onClick={() => setTab('global')}
            >
              🌍 Global
            </button>
            <button
              className={`tab ${tab === 'friends' ? 'active' : ''}`}
              onClick={() => setTab('friends')}
            >
              👥 Friends
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="leaderboard-card card">
              <div className="lb-header">
                <span>Rank</span>
                <span>User</span>
                <span>College</span>
                <span>Points</span>
              </div>
              {users.map((u, i) => (
                <div
                  key={u._id}
                  className={`lb-row ${user?._id === u._id ? 'current-user' : ''}`}
                >
                  <div className="rank-cell">{getRankIcon(i + 1)}</div>
                  <div className="user-cell">
                    <div className="user-avatar">{u.name?.charAt(0)}</div>
                    <span>{u.name}</span>
                  </div>
                  <span className="college-cell">{u.profile?.college || 'N/A'}</span>
                  <span className="points-cell">{u.points?.toLocaleString() || 0}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;