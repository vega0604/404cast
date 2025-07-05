const express = require('express');
const router = express.Router();
const { Score, calculateScore } = require('../../services/scores_service');

// GET scores
router.get('/', (req, res) => {
  res.json({ message: 'Scores endpoint' });
});

// POST score (user submits a prediction)
router.post('/', async (req, res) => {
  try {
    const { fullname, guess, modelPrediction, diff, streak, timeToGuess } = req.body;
    // Calculate score
    const scoreValue = calculateScore({ streak, diff, timeToGuess });
    // Save to DB
    const score = new Score({
      fullname,
      score: scoreValue
    });
    await score.save();
    res.status(201).json({ score: score });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
