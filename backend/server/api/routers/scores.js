const express = require('express');
const router = express.Router();

// GET scores
router.get('/', (req, res) => {
  res.json({ message: 'Scores endpoint' });
});

module.exports = router;
