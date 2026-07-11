import React from 'react';
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

export default RecentActivity;