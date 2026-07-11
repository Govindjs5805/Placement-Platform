import React, { useState, useEffect } from 'react';
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
    <div className={`interview-page ${theme}`}>
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <button className="back-btn" onClick={() => navigate('/tcs-nqt')}>← Back</button>
          <h1>AI Mock Interview</h1>
          <p className="page-subtitle">Practice with voice-based AI interviewer</p>

          <div className="interview-container card">
            <div className="ai-avatar">
              <div className={`avatar-icon ${isSpeaking ? 'speaking' : ''}`}>🎤</div>
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
                  className={`mic-btn ${isListening ? 'listening' : ''}`}
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

export default InterviewSection;