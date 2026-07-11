import React from 'react';
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

export default ProgressCard;