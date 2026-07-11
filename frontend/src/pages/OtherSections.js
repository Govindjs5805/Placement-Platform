import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './OtherSections.css';

const sectionContent = {
  'interview-preparation': {
    title: 'Interview Preparation',
    icon: '💼',
    topics: ['Common HR Questions', 'Technical Interview Tips', 'STAR Method', 'Body Language', 'Salary Negotiation'],
    resources: [
      { name: 'GeeksforGeeks Interview Corner', link: 'https://www.geeksforgeeks.org/interview-corner/' },
      { name: 'IndiaBix HR Interview', link: 'https://www.indiabix.com/hr-interview/questions-and-answers/' }
    ]
  },
  'numerical-aptitude': {
    title: 'Numerical Aptitude',
    icon: '🔢',
    topics: ['Percentages', 'Profit & Loss', 'Time & Work', 'Speed & Distance', 'Averages', 'SI & CI'],
    resources: [
      { name: 'IndiaBix Arithmetic', link: 'https://www.indiabix.com/aptitude/questions-and-answers/' },
      { name: 'GeeksforGeeks Quant', link: 'https://www.geeksforgeeks.org/aptitude-gq/' }
    ]
  },
  'logical-reasoning': {
    title: 'Logical Reasoning',
    icon: '🧠',
    topics: ['Blood Relations', 'Direction Sense', 'Seating Arrangement', 'Syllogism', 'Coding-Decoding', 'Series'],
    resources: [
      { name: 'IndiaBix Logical Reasoning', link: 'https://www.indiabix.com/logical-reasoning/questions-and-answers/' },
      { name: 'GeeksforGeeks LR', link: 'https://www.geeksforgeeks.org/logical-reasoning/' }
    ]
  },
  'verbal-ability': {
    title: 'Verbal Ability',
    icon: '📚',
    topics: ['Reading Comprehension', 'Error Detection', 'Sentence Correction', 'Synonyms & Antonyms', 'Para Jumbles'],
    resources: [
      { name: 'IndiaBix Verbal', link: 'https://www.indiabix.com/verbal-ability/questions-and-answers/' },
      { name: 'GeeksforGeeks English', link: 'https://www.geeksforgeeks.org/english/' }
    ]
  },
  'hr-interview': {
    title: 'HR Interview',
    icon: '👥',
    topics: ['Tell me about yourself', 'Strengths & Weaknesses', 'Why should we hire you?', 'Career Goals', 'Salary Expectations'],
    resources: [
      { name: 'AmbitionBox HR Questions', link: 'https://www.ambitionbox.com/interviews' },
      { name: 'Glassdoor Interviews', link: 'https://www.glassdoor.co.in/Interview/index.htm' }
    ]
  },
  'group-discussion': {
    title: 'Group Discussion',
    icon: '💬',
    topics: ['Current Affairs', 'Abstract Topics', 'Case Studies', 'GD Etiquettes', 'How to initiate & conclude'],
    resources: [
      { name: 'IndiaBix GD Topics', link: 'https://www.indiabix.com/group-discussion/topics/' },
      { name: 'GeeksforGeeks GD Guide', link: 'https://www.geeksforgeeks.org/group-discussion/' }
    ]
  }
};

const OtherSections = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const content = sectionContent[section] || {
    title: 'Section Not Found',
    icon: '❓',
    topics: [],
    resources: []
  };

  return (
    <div className={`other-sections ${theme}`}>
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
          <h1>{content.icon} {content.title}</h1>

          <div className="section-layout">
            <div className="topics-card card">
              <h2>📋 Key Topics to Cover</h2>
              <ul className="topics-list">
                {content.topics.map((topic, i) => (
                  <li key={i}>{topic}</li>
                ))}
              </ul>
            </div>

            <div className="resources-card card">
              <h2>🔗 External Resources</h2>
              <p className="resource-note">Practice extensively from these trusted platforms:</p>
              <div className="resource-links">
                {content.resources.map((res, i) => (
                  <a key={i} href={res.link} target="_blank" rel="noreferrer" className="resource-link">
                    {res.name} →
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherSections;