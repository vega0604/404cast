const express = require('express');
const router = express.Router();
const { calculateScore } = require('../../services/scores_service');
const { Leaderboard } = require('../../services/leaderboards_service');

// GET scores
router.get('/', (req, res) => {
  res.json({ message: 'Scores endpoint' });
});

// POST score (user submits a prediction)
router.post('/', async (req, res) => {
  try {
    const { fullname, guess, modelPrediction, diff, streak, timeToGuess, roundNumber, runningTotal } = req.body;
    // Calculate score for this round
    const scoreValue = calculateScore({ streak, diff, timeToGuess });
    
    // Calculate new running total (previous total + current round score)
    const newRunningTotal = (runningTotal || 0) + scoreValue;

    // If this is the 10th round, save the final total to leaderboard
    if (roundNumber === 10) {
      await Leaderboard.findOneAndUpdate(
        { fullname },
        { score: newRunningTotal },
        { upsert: true, new: true }
      );
    }

    res.status(201).json({ roundScore: scoreValue, runningTotal: newRunningTotal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
