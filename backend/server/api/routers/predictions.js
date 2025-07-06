const express = require('express');
const router = express.Router();
const neighbourhoodService = require('../../services/neighbourhood_service');

// GET predictions for coordinates
router.get('/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }

    const prediction = neighbourhoodService.predictRiskForLocation(latitude, longitude);
    
    res.json(prediction);
  } catch (error) {
    console.error('Error getting prediction:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST predictions with body data
router.post('/', async (req, res) => {
  try {
    const { lat, lng } = req.body;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }

    const prediction = neighbourhoodService.predictRiskForLocation(latitude, longitude);
    
    res.json(prediction);
  } catch (error) {
    console.error('Error getting prediction:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET random neighbourhood coordinates (for testing)
router.get('/random/neighbourhood', (req, res) => {
  try {
    const randomNeighbourhood = neighbourhoodService.getRandomNeighbourhoodCoordinates();
    
    if (!randomNeighbourhood) {
      return res.status(500).json({ error: 'No neighbourhood data available' });
    }
    
    res.json(randomNeighbourhood);
  } catch (error) {
    console.error('Error getting random neighbourhood:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET all neighbourhoods (for debugging)
router.get('/debug/neighbourhoods', (req, res) => {
  try {
    const neighbourhoods = neighbourhoodService.getAllNeighbourhoods();
    res.json({
      count: Object.keys(neighbourhoods).length,
      neighbourhoods: neighbourhoods
    });
  } catch (error) {
    console.error('Error getting neighbourhoods:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
