import React from 'react';
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
                  <span className={`difficulty ${row.difficulty.toLowerCase()}`}>{row.difficulty}</span>
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

export default TCSNQTSection;