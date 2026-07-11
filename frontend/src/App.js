import React from 'react';
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

export default App;