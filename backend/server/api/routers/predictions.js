const express = require('express');
const router = express.Router();

// GET predictions
router.get('/', (req, res) => {
  res.json({ message: 'Predictions endpoint' });
});

module.exports = router;
