const mongoose = require('mongoose');
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
    question: `Sample question ${i + 1}`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 'Option A',
    explanation: `Explanation for question ${i + 1}`,
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
    console.log(`✅ Inserted ${sampleQuestions.length} questions`);
    
    const count = await Question.countDocuments();
    console.log(`📊 Total questions in database: ${count}`);
    
    console.log('\n✨ Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();