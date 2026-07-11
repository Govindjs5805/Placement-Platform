const express = require('express');
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

module.exports = router;