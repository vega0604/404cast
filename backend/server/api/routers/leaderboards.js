const express = require('express');
const router = express.Router();

// GET leaderboards
router.get('/', (req, res) => {
  res.json({ message: 'Leaderboards endpoint' });
});

module.exports = router;
