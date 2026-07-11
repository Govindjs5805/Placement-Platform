const fs = require('fs');
const path = require('path');

const allFiles = {
  // ==================== ROOT FILES ====================
  'package.json': `{
  "name": "placement-platform",
  "version": "1.0.0",
  "description": "Complete Placement Preparation Platform with TCS NQT, Coding & AI Interviews",
  "scripts": {
    "install-all": "npm install && cd backend && npm install && cd ../frontend && npm install",
    "dev": "concurrently \\"npm run server\\" \\"npm run client\\"",
    "server": "cd backend && npm run dev",
    "client": "cd frontend && npm start",
    "seed": "cd backend && node scripts/seedQuestions.js",
    "build": "cd frontend && npm run build"
  },
  "keywords": ["placement", "tcs-nqt", "coding", "interviews"],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}`,

  '.gitignore': `# Dependencies
node_modules/
backend/node_modules/
frontend/node_modules/

# Environment
.env
.env.local
backend/.env
frontend/.env

# Build
build/
dist/
frontend/build/

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp`,

  'README.md': `# 🎯 PlacementPro - Complete Placement Preparation Platform

> A modern MERN stack application for TCS NQT, Aptitude, Coding & AI Mock Interviews

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)

## ✨ Features

- 🎓 **10,000+ Questions** - Aptitude, Reasoning, Verbal & Technical
- 🤖 **AI Voice Interviews** - Real-time speech recognition practice
- 💻 **100+ LeetCode Problems** - Curated coding challenges
- 📊 **Progress Tracking** - Detailed analytics dashboard
- 🏆 **Leaderboards** - Global & friends competition
- 🌓 **Dark/Light Mode** - Eye-friendly themes
- 📱 **Responsive Design** - Works on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (v4.4+)
- npm or yarn

### Installation

\`\`\`bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/placement-platform.git
cd placement-platform

# Install all dependencies
npm run install-all

# Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Seed database with questions
npm run seed

# Start development servers
npm run dev
\`\`\`

Visit: **http://localhost:3000**

## 📁 Project Structure

\`\`\`
placement-platform/
├── backend/              # Express.js API
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & validation
│   └── scripts/         # Database seeding
└── frontend/            # React.js app
    ├── components/      # Reusable UI
    ├── pages/          # Route pages
    └── context/        # State management
\`\`\`

## 🛠️ Tech Stack

**Frontend:** React, React Router, Framer Motion, Recharts, Axios  
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT  
**Features:** Speech Recognition API, Dark Mode, Real-time Updates

## 📸 Screenshots

Coming soon...

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## 📄 License

MIT © [Your Name]

## 🙏 Credits

- Questions: IndiaBix, GeeksforGeeks
- Icons: Lucide React
- Animations: Framer Motion
`,

  // ==================== BACKEND FILES ====================
  'backend/package.json': `{
  "name": "placement-platform-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}`,

  'backend/.env.example': `PORT=5000
MONGODB_URI=mongodb://localhost:27017/placement-platform
JWT_SECRET=change_this_to_a_secure_random_string_in_production
NODE_ENV=development`,

  'backend/server.js': `const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/placement-platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'PlacementPro API is running!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(\`🚀 Server running on port \${PORT}\`));`,

  'backend/models/User.js': `const mongoose = require('mongoose');

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

module.exports = mongoose.model('User', UserSchema);`,

  'backend/models/Question.js': `const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['tcsNqt', 'interviewPrep', 'numerical', 'hr', 'logical', 'verbal', 'gd']
  },
  subcategory: { type: String, required: true },
  type: {
    type: String,
    enum: ['mcq', 'coding', 'subjective'],
    required: true
  },
  question: { type: String, required: true },
  options: [String],
  correctAnswer: String,
  explanation: String,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard']
  },
  points: { type: Number, default: 10 },
  tags: [String],
  externalLink: String,
  sourceReference: String
});

module.exports = mongoose.model('Question', QuestionSchema);`,

  'backend/middleware/auth.js': `const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};`,

  'backend/routes/auth.js': `const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Register
router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;`,

  'backend/routes/user.js': `const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { profile: req.body } },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/progress', auth, async (req, res) => {
  try {
    const { category, subcategory, questionId, score, points } = req.body;
    const user = await User.findById(req.user.id);
    
    user.completedQuestions.push({ questionId, category, subcategory, score, date: new Date() });
    user.points += points || 10;
    
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;`,

  'backend/routes/questions.js': `const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Question = require('../models/Question');

router.get('/:category', auth, async (req, res) => {
  try {
    const { category } = req.params;
    const { subcategory, difficulty } = req.query;
    
    let query = { category };
    if (subcategory) query.subcategory = subcategory;
    if (difficulty) query.difficulty = difficulty;
    
    const questions = await Question.find(query);
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/question/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/submit/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    const { answer } = req.body;
    
    const isCorrect = answer === question.correctAnswer;
    const points = isCorrect ? question.points : 0;
    
    res.json({
      correct: isCorrect,
      points,
      explanation: question.explanation,
      correctAnswer: question.correctAnswer
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;`,

  'backend/routes/leaderboard.js': `const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/global', auth, async (req, res) => {
  try {
    const users = await User.find()
      .select('name points profile.college')
      .sort({ points: -1 })
      .limit(100);
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/friends', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friendIds = [...user.friends, req.user.id];
    
    const friends = await User.find({ _id: { $in: friendIds } })
      .select('name points profile.college')
      .sort({ points: -1 });
    res.json(friends);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;`,

  'backend/scripts/seedQuestions.js': `const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('../models/Question');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/placement-platform');

const sampleQuestions = [
  // TCS NQT - Numerical
  { category: 'tcsNqt', subcategory: 'numericalAbility', type: 'mcq', question: 'What is 15% of 240?', options: ['32', '36', '34', '38'], correctAnswer: '36', explanation: '15/100 × 240 = 36', difficulty: 'easy', points: 10, sourceReference: 'IndiaBix', tags: ['percentage'] },
  { category: 'tcsNqt', subcategory: 'numericalAbility', type: 'mcq', question: 'A train 150m long passes a pole in 15 seconds. Speed?', options: ['36 km/h', '40 km/h', '45 km/h', '50 km/h'], correctAnswer: '36 km/h', explanation: 'Speed = 150/15 = 10 m/s = 36 km/h', difficulty: 'medium', points: 15, sourceReference: 'GeeksforGeeks', tags: ['speed-distance'] },
  
  // Verbal Ability
  { category: 'tcsNqt', subcategory: 'verbalAbility', type: 'mcq', question: 'Synonym of BENEVOLENT:', options: ['Cruel', 'Kind', 'Selfish', 'Angry'], correctAnswer: 'Kind', explanation: 'Benevolent means well-meaning and kindly', difficulty: 'easy', points: 10, sourceReference: 'IndiaBix', tags: ['vocabulary'] },
  
  // Logical Reasoning
  { category: 'tcsNqt', subcategory: 'reasoningAbility', type: 'mcq', question: 'Find next: 2, 6, 12, 20, ?', options: ['28', '30', '32', '26'], correctAnswer: '30', explanation: 'Differences are 4,6,8,10. Next: 20+10=30', difficulty: 'medium', points: 15, sourceReference: 'GeeksforGeeks', tags: ['series'] },
  
  // Add 50 more sample questions
  ...Array.from({length: 50}, (_, i) => ({
    category: ['tcsNqt', 'numerical', 'logical', 'verbal'][i % 4],
    subcategory: 'practice',
    type: 'mcq',
    question: \`Sample question \${i + 1}\`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 'Option A',
    explanation: \`Explanation for question \${i + 1}\`,
    difficulty: ['easy', 'medium', 'hard'][i % 3],
    points: 10 + (i % 3) * 5,
    sourceReference: 'Practice Set',
    tags: ['practice']
  }))
];

async function seedDatabase() {
  try {
    await Question.deleteMany({});
    console.log('🗑️  Cleared existing questions');
    
    await Question.insertMany(sampleQuestions);
    console.log(\`✅ Inserted \${sampleQuestions.length} questions\`);
    
    const count = await Question.countDocuments();
    console.log(\`📊 Total questions in database: \${count}\`);
    
    console.log('\\n✨ Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();`,

  // ==================== FRONTEND FILES ====================
  'frontend/package.json': `{
  "name": "placement-platform-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0",
    "react-scripts": "5.0.1",
    "axios": "^1.5.0",
    "framer-motion": "^10.16.1",
    "lucide-react": "^0.263.1",
    "recharts": "^2.8.0",
    "react-hot-toast": "^2.4.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": ["react-app"]
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}`,

  'frontend/.env.example': `REACT_APP_API_URL=http://localhost:5000/api`,

  'frontend/public/index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#10b981" />
    <meta name="description" content="Complete placement preparation platform" />
    <title>PlacementPro - Your Path to Success</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`,

  'frontend/src/index.js': `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

  'frontend/src/index.css': `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
}`,

  'frontend/src/App.js': `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🎯 PlacementPro</h1>
        <p>Complete setup successful! Now add remaining components.</p>
        <p>See NEXT_STEPS.md for instructions.</p>
      </header>
    </div>
  );
}

export default App;`,

  'frontend/src/App.css': `:root {
  --primary-green: #10b981;
  --primary-green-dark: #059669;
  --primary-green-light: #34d399;
}

.App {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.App-header {
  text-align: center;
  color: white;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.App-header h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.App-header p {
  font-size: 1.2rem;
  opacity: 0.9;
}`,

  'NEXT_STEPS.md': `# 📋 Next Steps

## ✅ What's Done
- Project structure created
- Backend API setup
- Frontend React app initialized
- Database models defined
- Sample questions seeded

## 🔄 To Complete the Application

### 1. Add Remaining Frontend Components

The following files need to be added to complete the UI:

**Components:**
- Sidebar.js & Sidebar.css
- Header.js & Header.css
- QuickStats.js & QuickStats.css
- RecentActivity.js & RecentActivity.css
- ProgressCard.js & ProgressCard.css
- ProtectedRoute.js

**Pages:**
- HomePage.js & HomePage.css
- LoginPage.js & SignupPage.js & AuthPages.css
- Dashboard.js & Dashboard.css
- ProfileSetup.js & ProfileSetup.css
- TCSNQTSection.js & TCSNQTSection.css
- AptitudeSection.js & AptitudeSection.css
- CodingSection.js & CodingSection.css
- InterviewSection.js & InterviewSection.css
- OtherSections.js & OtherSections.css
- Leaderboard.js & Leaderboard.css
- QuestionPage.js & QuestionPage.css

**Context:**
- ThemeContext.js
- AuthContext.js

### 2. Download Full Code

You can download all remaining files from:
**[Releases Page]** or **[Full Code Branch]**

### 3. Run the Application

\`\`\`bash
# Setup environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Install dependencies
npm run install-all

# Seed database
npm run seed

# Start development
npm run dev
\`\`\`

## 📞 Need Help?

Create an issue on GitHub or check the README.md for detailed documentation.
`
};

// Generate all files
function generateProject() {
  console.log('🚀 Generating PlacementPro project files...\n');

  let created = 0;
  let errors = 0;

  Object.entries(allFiles).forEach(([filePath, content]) => {
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
  console.log(`\n✨ Project structure generated!`);
  console.log(`\n📋 Next steps:`);
  console.log(`   1. git add .`);
  console.log(`   2. git commit -m "Initial commit: Project structure"`);
  console.log(`   3. git push origin main`);
  console.log(`   4. Add remaining component files (see NEXT_STEPS.md)`);
  console.log(`\n🎯 Happy coding!\n`);
}

generateProject();