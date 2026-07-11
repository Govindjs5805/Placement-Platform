import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ProfileSetup.css';

const ProfileSetup = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    skills: '',
    interests: '',
    education: '',
    college: '',
    graduationYear: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const profileData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
        graduationYear: parseInt(formData.graduationYear) || null
      };
      await updateProfile(profileData);
      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-setup">
      <div className="profile-container">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Complete Your Profile</h1>
        <p className="subtitle">Help us personalize your preparation journey</p>
        <form onSubmit={handleSubmit} className="profile-form card">
          <div className="form-grid">
            <div className="form-group">
              <label>Skills (comma separated)</label>
              <input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="input"
                placeholder="Java, Python, React..."
              />
            </div>
            <div className="form-group">
              <label>Interests (comma separated)</label>
              <input
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                className="input"
                placeholder="Web Dev, AI..."
              />
            </div>
            <div className="form-group">
              <label>Education</label>
              <select name="education" value={formData.education} onChange={handleChange} className="input">
                <option value="">Select</option>
                <option value="B.Tech">B.Tech</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
              </select>
            </div>
            <div className="form-group">
              <label>College</label>
              <input
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="input"
                placeholder="Your college"
              />
            </div>
            <div className="form-group">
              <label>Graduation Year</label>
              <input
                name="graduationYear"
                type="number"
                value={formData.graduationYear}
                onChange={handleChange}
                className="input"
                placeholder="2024"
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input"
                placeholder="+91 XXXXX"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;