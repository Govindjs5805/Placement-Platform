import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './CodingSection.css';

const codingProblems = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy', points: 10, link: 'https://leetcode.com/problems/two-sum/', tags: ['Array', 'Hash Table'] },
  { id: 2, title: 'Palindrome Number', difficulty: 'Easy', points: 10, link: 'https://leetcode.com/problems/palindrome-number/', tags: ['Math'] },
  { id: 3, title: 'Roman to Integer', difficulty: 'Easy', points: 10, link: 'https://leetcode.com/problems/roman-to-integer/', tags: ['String'] },
  { id: 4, title: 'Longest Common Prefix', difficulty: 'Easy', points: 10, link: 'https://leetcode.com/problems/longest-common-prefix/', tags: ['String'] },
  { id: 5, title: 'Valid Parentheses', difficulty: 'Easy', points: 15, link: 'https://leetcode.com/problems/valid-parentheses/', tags: ['Stack'] },
  { id: 6, title: 'Merge Two Sorted Lists', difficulty: 'Easy', points: 15, link: 'https://leetcode.com/problems/merge-two-sorted-lists/', tags: ['Linked List'] },
  { id: 7, title: 'Remove Duplicates', difficulty: 'Easy', points: 10, link: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', tags: ['Array'] },
  { id: 8, title: 'Maximum Subarray', difficulty: 'Medium', points: 20, link: 'https://leetcode.com/problems/maximum-subarray/', tags: ['Array', 'DP'] },
  { id: 9, title: 'Climbing Stairs', difficulty: 'Medium', points: 20, link: 'https://leetcode.com/problems/climbing-stairs/', tags: ['DP'] },
  { id: 10, title: 'Best Time to Buy Stock', difficulty: 'Medium', points: 20, link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', tags: ['Array'] },
  { id: 11, title: 'Linked List Cycle', difficulty: 'Medium', points: 20, link: 'https://leetcode.com/problems/linked-list-cycle/', tags: ['Linked List'] },
  { id: 12, title: 'Reverse Linked List', difficulty: 'Medium', points: 20, link: 'https://leetcode.com/problems/reverse-linked-list/', tags: ['Linked List'] }
];

const CodingSection = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className={`coding-page ${theme}`}>
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <button className="back-btn" onClick={() => navigate('/tcs-nqt')}>← Back</button>
          <h1>Coding Practice</h1>
          <p className="page-subtitle">Curated LeetCode problems for TCS NQT & Placements</p>

          <div className="problems-list card">
            <div className="problem-header">
              <span>Problem</span>
              <span>Difficulty</span>
              <span>Points</span>
              <span>Action</span>
            </div>
            {codingProblems.map((prob) => (
              <div key={prob.id} className="problem-row">
                <div className="problem-title">
                  <span className="problem-icon">💻</span>
                  <div>
                    <h4>{prob.title}</h4>
                    <div className="tags">
                      {prob.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>
                </div>
                <span className={`difficulty ${prob.difficulty.toLowerCase()}`}>{prob.difficulty}</span>
                <span className="points">⭐ {prob.points}</span>
                <a href={prob.link} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                  Solve →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingSection;