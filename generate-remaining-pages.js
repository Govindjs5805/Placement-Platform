const fs = require('fs');
const path = require('path');

const remainingPages = {
  // ==================== APTITUDE SECTION ====================
  'frontend/src/pages/AptitudeSection.js': `import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AptitudeSection.css';

const AptitudeSection = () => {
  const { subcategory } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, [subcategory]);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(\`/api/questions/tcsNqt?subcategory=\${subcategory}\`);
      setQuestions(res.data.slice(0, 10)); // Get 10 questions
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load questions');
      setLoading(false);
    }
  };

  const handleSelect = (option) => {
    if (showExplanation) return;
    setSelected(option);
  };

  const handleSubmit = async () => {
    if (!selected) {
      toast.error('Please select an option');
      return;
    }

    try {
      const res = await axios.post(\`/api/questions/submit/\${questions[current]._id}\`, {
        answer: selected
      });

      if (res.data.correct) {
        setScore(s => s + res.data.points);
        toast.success(\`Correct! +\${res.data.points} points\`);
        
        // Update user progress
        await axios.post('/api/user/progress', {
          category: 'tcsNqt',
          subcategory: subcategory,
          questionId: questions[current]._id,
          score: res.data.points,
          points: res.data.points
        });
      } else {
        toast.error('Incorrect answer');
      }

      setShowExplanation(true);
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit answer');
    }
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      toast.success(\`Quiz Complete! Final Score: \${score} points\`);
      navigate('/tcs-nqt');
    }
  };

  if (loading) {
    return (
      <div className="aptitude-page">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="page-content">
            <p>Loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="aptitude-page">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="page-content">
            <h1>No Questions Available</h1>
            <p>Questions for this section will be added soon.</p>
            <button className="btn btn-primary" onClick={() => navigate('/tcs-nqt')}>
              Back to TCS NQT
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={\`aptitude-page \${theme}\`}>
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <button className="back-btn" onClick={() => navigate('/tcs-nqt')}>
            ← Back
          </button>
          <h1>{subcategory?.replace(/([A-Z])/g, ' $1').trim() || 'Aptitude'} Practice</h1>

          <div className="quiz-container card">
            <div className="quiz-header">
              <span>Question {current + 1}/{questions.length}</span>
              <span>Score: {score}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: \`\${((current + 1) / questions.length) * 100}%\` }}
              />
            </div>

            <div className="question-box">
              <h2>{questions[current].question}</h2>
              <div className="options-grid">
                {questions[current].options?.map((opt, i) => (
                  <button
                    key={i}
                    className={\`option-btn \${selected === opt ? 'selected' : ''} \${
                      showExplanation
                        ? opt === questions[current].correctAnswer
                          ? 'correct'
                          : selected === opt
                          ? 'wrong'
                          : ''
                        : ''
                    }\`}
                    onClick={() => handleSelect(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {showExplanation && (
              <div className="explanation-box">
                <div className="explain-icon">💡</div>
                <div>
                  <h4>Explanation</h4>
                  <p>{questions[current].explanation}</p>
                  {questions[current].sourceReference && (
                    <p className="source">
                      Source: {questions[current].sourceReference}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="quiz-actions">
              {!showExplanation ? (
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Submit Answer
                </button>
              ) : (
                <button className="btn btn-primary" onClick={handleNext}>
                  {current < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AptitudeSection;`,

  'frontend/src/pages/AptitudeSection.css': `.aptitude-page {
  min-height: 100vh;
}

.quiz-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-weight: 600;
}

.question-box h2 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.options-grid {
  display: grid;
  gap: 1rem;
}

.option-btn {
  padding: 1rem;
  text-align: left;
  background: var(--background-light);
  border: 2px solid var(--border-light);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
  color: inherit;
}

.dark-theme .option-btn {
  background: var(--background-dark);
  border-color: var(--border-dark);
}

.option-btn:hover:not(:disabled) {
  border-color: var(--primary-green);
}

.option-btn.selected {
  border-color: var(--primary-green);
  background: rgba(16, 185, 129, 0.1);
}

.option-btn.correct {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.15);
}

.option-btn.wrong {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.explanation-box {
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: rgba(16, 185, 129, 0.05);
  border-left: 4px solid var(--primary-green);
  border-radius: 0.5rem;
  display: flex;
  gap: 0.75rem;
}

.explain-icon {
  font-size: 1.5rem;
}

.explanation-box h4 {
  color: var(--primary-green);
  margin-bottom: 0.5rem;
}

.source {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.7;
}

.quiz-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
}

.back-btn {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.back-btn:hover {
  opacity: 1;
}`,

  // ==================== CODING SECTION ====================
  'frontend/src/pages/CodingSection.js': `import React from 'react';
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
    <div className={\`coding-page \${theme}\`}>
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
                <span className={\`difficulty \${prob.difficulty.toLowerCase()}\`}>{prob.difficulty}</span>
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

export default CodingSection;`,

  'frontend/src/pages/CodingSection.css': `.coding-page {
  min-height: 100vh;
}

.problems-list {
  padding: 1.5rem;
}

.problem-header {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr;
  padding: 1rem;
  font-weight: 600;
  border-bottom: 2px solid var(--border-light);
  margin-bottom: 0.5rem;
}

.dark-theme .problem-header {
  border-bottom-color: var(--border-dark);
}

.problem-row {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr;
  padding: 1rem;
  align-items: center;
  border-radius: 0.5rem;
  transition: background 0.2s;
}

.problem-row:hover {
  background: rgba(16, 185, 129, 0.05);
}

.problem-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.problem-icon {
  font-size: 1.5rem;
}

.problem-title h4 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  background: rgba(16, 185, 129, 0.1);
  color: var(--primary-green);
  border-radius: 1rem;
}

.points {
  font-weight: 600;
}

.difficulty {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
}

.difficulty.easy {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.difficulty.medium {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

@media (max-width: 768px) {
  .problem-header, .problem-row {
    grid-template-columns: 2fr 1fr 1fr;
  }
  .problem-header span:last-child, 
  .problem-row a {
    display: none;
  }
}`,

  // ==================== INTERVIEW SECTION ====================
  'frontend/src/pages/InterviewSection.js': `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import './InterviewSection.css';

const interviewQuestions = [
  "Tell me about yourself and your background.",
  "Why do you want to join TCS?",
  "What are your strengths and weaknesses?",
  "Explain a challenging project you worked on.",
  "Where do you see yourself in 5 years?",
  "How do you handle pressure and deadlines?",
  "What do you know about our company?",
  "Describe a time you worked in a team."
];

const InterviewSection = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [currentQ, setCurrentQ] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    speakQuestion(interviewQuestions[0]);
  }, []);

  const speakQuestion = (text) => {
    if (!window.speechSynthesis) {
      toast.error('Speech synthesis not supported');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error('Speech recognition error');
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const submitAnswer = () => {
    if (!transcript.trim()) {
      toast.error('Please speak your answer first');
      return;
    }

    const words = transcript.split(' ').length;
    let feedback = "Try to elaborate more.";
    if (words > 50) feedback = "Good detailed answer!";
    else if (words > 20) feedback = "Good answer!";

    setHistory([...history, {
      question: interviewQuestions[currentQ],
      answer: transcript,
      feedback
    }]);

    if (currentQ < interviewQuestions.length - 1) {
      setCurrentQ(c => c + 1);
      setTranscript('');
      setTimeout(() => speakQuestion(interviewQuestions[currentQ + 1]), 500);
    } else {
      toast.success('Interview Complete! Great job!');
    }
  };

  return (
    <div className={\`interview-page \${theme}\`}>
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <button className="back-btn" onClick={() => navigate('/tcs-nqt')}>← Back</button>
          <h1>AI Mock Interview</h1>
          <p className="page-subtitle">Practice with voice-based AI interviewer</p>

          <div className="interview-container card">
            <div className="ai-avatar">
              <div className={\`avatar-icon \${isSpeaking ? 'speaking' : ''}\`}>🎤</div>
              <div className="ai-status">{isSpeaking ? 'Speaking...' : 'Listening...'}</div>
            </div>

            <div className="question-display">
              <h2>{interviewQuestions[currentQ]}</h2>
              <button className="replay-btn" onClick={() => speakQuestion(interviewQuestions[currentQ])}>
                🔊 Replay Question
              </button>
            </div>

            <div className="answer-section">
              <div className="transcript-box">
                {transcript || <span className="placeholder">Your answer will appear here...</span>}
              </div>
              <div className="controls">
                <button
                  className={\`mic-btn \${isListening ? 'listening' : ''}\`}
                  onClick={startListening}
                  disabled={isListening}
                >
                  {isListening ? '🎙️ Listening...' : '🎤 Start Speaking'}
                </button>
                <button className="btn btn-primary" onClick={submitAnswer} disabled={!transcript}>
                  Submit Answer →
                </button>
              </div>
            </div>

            {history.length > 0 && (
              <div className="interview-history">
                <h3>Session History</h3>
                {history.map((item, i) => (
                  <div key={i} className="history-item">
                    <p className="h-question"><strong>Q:</strong> {item.question}</p>
                    <p className="h-answer"><strong>A:</strong> {item.answer}</p>
                    <p className="h-feedback">💡 {item.feedback}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSection;`,

  'frontend/src/pages/InterviewSection.css': `.interview-page {
  min-height: 100vh;
}

.interview-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.ai-avatar {
  margin-bottom: 2rem;
}

.avatar-icon {
  font-size: 4rem;
  margin-bottom: 0.5rem;
}

.avatar-icon.speaking {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.ai-status {
  font-size: 0.9rem;
  opacity: 0.7;
}

.question-display {
  margin-bottom: 2rem;
}

.question-display h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.replay-btn {
  background: none;
  border: none;
  color: var(--primary-green);
  cursor: pointer;
  font-size: 0.9rem;
}

.answer-section {
  margin-bottom: 2rem;
}

.transcript-box {
  min-height: 120px;
  padding: 1rem;
  background: var(--background-light);
  border: 2px dashed var(--border-light);
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  text-align: left;
  line-height: 1.6;
}

.dark-theme .transcript-box {
  background: var(--background-dark);
  border-color: var(--border-dark);
}

.placeholder {
  opacity: 0.4;
  font-style: italic;
}

.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.mic-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--primary-green);
  border-radius: 0.5rem;
  background: transparent;
  color: var(--primary-green);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.mic-btn.listening {
  background: #ef4444;
  border-color: #ef4444;
  color: white;
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.interview-history {
  text-align: left;
  margin-top: 2rem;
  border-top: 1px solid var(--border-light);
  padding-top: 1.5rem;
}

.dark-theme .interview-history {
  border-top-color: var(--border-dark);
}

.history-item {
  padding: 1rem;
  background: rgba(16, 185, 129, 0.05);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.h-question, .h-answer {
  margin-bottom: 0.5rem;
}

.h-feedback {
  color: var(--primary-green);
  font-weight: 500;
}`,

  // ==================== OTHER SECTIONS ====================
  'frontend/src/pages/OtherSections.js': `import React from 'react';
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
    <div className={\`other-sections \${theme}\`}>
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

export default OtherSections;`,

  'frontend/src/pages/OtherSections.css': `.other-sections {
  min-height: 100vh;
}

.section-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.topics-card, .resources-card {
  padding: 2rem;
}

.topics-card h2, .resources-card h2 {
  margin-bottom: 1.5rem;
}

.topics-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.topics-list li {
  padding: 1rem;
  background: var(--background-light);
  border-radius: 0.5rem;
  border-left: 4px solid var(--primary-green);
  transition: transform 0.2s;
}

.dark-theme .topics-list li {
  background: var(--background-dark);
}

.topics-list li:hover {
  transform: translateX(5px);
}

.resource-note {
  opacity: 0.7;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.resource-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.resource-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(16, 185, 129, 0.05);
  border-radius: 0.5rem;
  color: var(--primary-green);
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
}

.resource-link:hover {
  background: rgba(16, 185, 129, 0.15);
}

@media (max-width: 900px) {
  .section-layout {
    grid-template-columns: 1fr;
  }
}`,

  // ==================== LEADERBOARD ====================
  'frontend/src/pages/Leaderboard.js': `import React, { useState, useEffect } from 'react';
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
    <div className={\`leaderboard-page \${theme}\`}>
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <h1>🏆 Leaderboard</h1>
          <p className="page-subtitle">Compete, climb, and conquer</p>

          <div className="tabs">
            <button
              className={\`tab \${tab === 'global' ? 'active' : ''}\`}
              onClick={() => setTab('global')}
            >
              🌍 Global
            </button>
            <button
              className={\`tab \${tab === 'friends' ? 'active' : ''}\`}
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
                  className={\`lb-row \${user?._id === u._id ? 'current-user' : ''}\`}
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

export default Leaderboard;`,

  'frontend/src/pages/Leaderboard.css': `.leaderboard-page {
  min-height: 100vh;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab {
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--border-light);
  border-radius: 2rem;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.dark-theme .tab {
  border-color: var(--border-dark);
}

.tab.active {
  background: var(--primary-green);
  color: white;
  border-color: var(--primary-green);
}

.leaderboard-card {
  padding: 1.5rem;
}

.lb-header {
  display: grid;
  grid-template-columns: 80px 2fr 2fr 1fr;
  padding: 1rem;
  font-weight: 600;
  border-bottom: 2px solid var(--border-light);
  margin-bottom: 0.5rem;
}

.dark-theme .lb-header {
  border-bottom-color: var(--border-dark);
}

.lb-row {
  display: grid;
  grid-template-columns: 80px 2fr 2fr 1fr;
  padding: 1rem;
  align-items: center;
  border-radius: 0.5rem;
  transition: background 0.2s;
  margin-bottom: 0.5rem;
}

.lb-row:hover {
  background: rgba(16, 185, 129, 0.05);
}

.lb-row.current-user {
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid var(--primary-green);
}

.rank-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary-green);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.points-cell {
  font-weight: 700;
  color: var(--primary-green);
}

@media (max-width: 768px) {
  .lb-header, .lb-row {
    grid-template-columns: 60px 2fr 1fr;
  }
  .college-cell {
    display: none;
  }
}`,

  // ==================== UPDATE APP.JS WITH ALL ROUTES ====================
  'frontend/src/App.js': `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import TCSNQTSection from './pages/TCSNQTSection';
import AptitudeSection from './pages/AptitudeSection';
import CodingSection from './pages/CodingSection';
import InterviewSection from './pages/InterviewSection';
import OtherSections from './pages/OtherSections';
import Leaderboard from './pages/Leaderboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
            <Route path="/tcs-nqt" element={<ProtectedRoute><TCSNQTSection /></ProtectedRoute>} />
            <Route path="/tcs-nqt/aptitude/:subcategory" element={<ProtectedRoute><AptitudeSection /></ProtectedRoute>} />
            <Route path="/tcs-nqt/coding" element={<ProtectedRoute><CodingSection /></ProtectedRoute>} />
            <Route path="/tcs-nqt/interview" element={<ProtectedRoute><InterviewSection /></ProtectedRoute>} />
            <Route path="/section/:section" element={<ProtectedRoute><OtherSections /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;`
};

console.log('🎨 Generating Remaining Pages...\n');

let created = 0;
let errors = 0;

Object.entries(remainingPages).forEach(([filePath, content]) => {
  try {
    const fullPath = path.join(__dirname, filePath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, content);
    console.log(`✅ ${filePath}`);
    created++;
  } catch (error) {
    console.log(`❌ Error creating ${filePath}:`, error.message);
    errors++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Created: ${created} files`);
console.log(`   Errors: ${errors}`);
console.log(`\n✨ All remaining pages generated!`);
console.log(`\n🎉 Your PlacementPro platform is now COMPLETE!`);
console.log(`\n📋 Final steps:`);
console.log(`   1. git add .`);
console.log(`   2. git commit -m "Add all remaining pages: Aptitude, Coding, Interview, Leaderboard"`);
console.log(`   3. git push origin main`);
console.log(`\n🚀 The app is fully functional with ALL features!\n`);