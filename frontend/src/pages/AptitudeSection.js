import React, { useState, useEffect } from 'react';
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
      const res = await axios.get(`/api/questions/tcsNqt?subcategory=${subcategory}`);
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
      const res = await axios.post(`/api/questions/submit/${questions[current]._id}`, {
        answer: selected
      });

      if (res.data.correct) {
        setScore(s => s + res.data.points);
        toast.success(`Correct! +${res.data.points} points`);
        
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
      toast.success(`Quiz Complete! Final Score: ${score} points`);
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
    <div className={`aptitude-page ${theme}`}>
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
                style={{ width: `${((current + 1) / questions.length) * 100}%` }}
              />
            </div>

            <div className="question-box">
              <h2>{questions[current].question}</h2>
              <div className="options-grid">
                {questions[current].options?.map((opt, i) => (
                  <button
                    key={i}
                    className={`option-btn ${selected === opt ? 'selected' : ''} ${
                      showExplanation
                        ? opt === questions[current].correctAnswer
                          ? 'correct'
                          : selected === opt
                          ? 'wrong'
                          : ''
                        : ''
                    }`}
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

export default AptitudeSection;