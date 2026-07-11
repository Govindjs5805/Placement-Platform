const mongoose = require('mongoose');

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

module.exports = mongoose.model('Question', QuestionSchema);