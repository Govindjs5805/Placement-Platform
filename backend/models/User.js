const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    skills: [String],
    interests: [String],
    education: String,
    college: String,
    graduationYear: Number,
    phone: String,
    linkedIn: String,
    github: String
  },
  progress: {
    tcsNqt: {
      aptitude: {
        numericalAbility: { completed: { type: Number, default: 0 }, total: { type: Number, default: 100 }, score: { type: Number, default: 0 } },
        verbalAbility: { completed: { type: Number, default: 0 }, total: { type: Number, default: 100 }, score: { type: Number, default: 0 } },
        reasoningAbility: { completed: { type: Number, default: 0 }, total: { type: Number, default: 100 }, score: { type: Number, default: 0 } },
        advancedQuant: { completed: { type: Number, default: 0 }, total: { type: Number, default: 50 }, score: { type: Number, default: 0 } },
        advancedReasoning: { completed: { type: Number, default: 0 }, total: { type: Number, default: 50 }, score: { type: Number, default: 0 } }
      },
      coding: {
        easy: { completed: { type: Number, default: 0 }, total: { type: Number, default: 50 } },
        medium: { completed: { type: Number, default: 0 }, total: { type: Number, default: 50 } }
      },
      interview: { attempts: { type: Number, default: 0 }, avgScore: { type: Number, default: 0 } }
    },
    interviewPreparation: { completed: { type: Number, default: 0 }, total: { type: Number, default: 100 }, score: { type: Number, default: 0 } },
    numericalAptitude: { completed: { type: Number, default: 0 }, total: { type: Number, default: 150 }, score: { type: Number, default: 0 } },
    hrInterview: { completed: { type: Number, default: 0 }, total: { type: Number, default: 50 }, score: { type: Number, default: 0 } },
    logicalReasoning: { completed: { type: Number, default: 0 }, total: { type: Number, default: 150 }, score: { type: Number, default: 0 } },
    verbalAbility: { completed: { type: Number, default: 0 }, total: { type: Number, default: 150 }, score: { type: Number, default: 0 } },
    groupDiscussion: { completed: { type: Number, default: 0 }, total: { type: Number, default: 30 }, score: { type: Number, default: 0 } }
  },
  points: { type: Number, default: 0 },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  completedQuestions: [{
    questionId: String,
    category: String,
    subcategory: String,
    score: Number,
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);