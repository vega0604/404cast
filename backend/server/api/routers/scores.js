const express = require('express');
const router = express.Router();
const { Score, calculateScore } = require('../../services/scores_service');
const { Leaderboard } = require('../../services/leaderboards_service');

// GET scores
router.get('/', (req, res) => {
  res.json({ message: 'Scores endpoint' });
});

// POST score (user submits a prediction)
router.post('/', async (req, res) => {
  try {
    const { fullname, guess, modelPrediction, diff, streak, timeToGuess, roundNumber } = req.body;
    // Calculate score for this round
    const scoreValue = calculateScore({ streak, diff, timeToGuess });
    // Save round score
    await new Score({ fullname, score: scoreValue }).save();

    // Calculate running total
    const total = await Score.aggregate([
      { $match: { fullname } },
      { $group: { _id: null, totalScore: { $sum: '$score' } } }
    ]);
    const runningTotal = total[0]?.totalScore || 0;

    // If this is the 10th round, update the leaderboard
    if (roundNumber === 10) {
      await Leaderboard.findOneAndUpdate(
        { fullname },
        { score: runningTotal },
        { upsert: true, new: true }
      );
    }

    res.status(201).json({ roundScore: scoreValue, runningTotal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
