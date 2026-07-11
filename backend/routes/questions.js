const express = require('express');
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

module.exports = router;