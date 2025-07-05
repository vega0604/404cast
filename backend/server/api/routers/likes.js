const express = require('express');
const router = express.Router();
const likesService = require('../../services/likes_service');

// GET likes count
router.get('/', async (req, res) => {
  try {
    const count = await likesService.getLikesCount();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST increment likes
router.post('/increment', async (req, res) => {
  try {
    const newCount = await likesService.incrementLikes();
    res.json({ count: newCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST reset likes (optional utility endpoint)
router.post('/reset', async (req, res) => {
  try {
    const count = await likesService.resetLikes();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
