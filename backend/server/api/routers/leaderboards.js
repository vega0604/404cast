const express = require('express');
const router = express.Router();
const { Leaderboard } = require('../../services/leaderboards_service');

// GET leaderboards
router.get('', async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find().sort({ score: -1 });
    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('', async (req, res) => {
  try {
    const { fullname, score } = req.body;
    const entry = new Leaderboard({ fullname, score });
    await entry.save();
    res.status(201).json({ entry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
