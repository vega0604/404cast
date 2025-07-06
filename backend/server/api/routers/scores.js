const express = require('express');
const router = express.Router();
const { calculateScore } = require('@services/scores_service');


// GET score (user submits a prediction)
router.get('', async (req, res) => {
  try {
    const { lat, long, streak, time, guess } = req.query;
    
    // Ensure lat and long are floats
    const latitude = parseFloat(lat);
    const longitude = parseFloat(long);
    
    // Validate that lat and long are valid numbers
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude values' });
    }
    
    // Calculate score for this round
    const { score, answer } = calculateScore(latitude, longitude, streak, time, guess);
    console.log(score, answer);
    res.status(200).json({ score, answer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
