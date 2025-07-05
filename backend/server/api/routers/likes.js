const express = require('express');
const router = express.Router();

// GET likes
router.get('/', (req, res) => {
  res.json({ message: 'Likes endpoint' });
});

module.exports = router;
