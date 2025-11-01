const axios = require('axios');

const searchLocations = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const response = await axios.get('http://api.openweathermap.org/geo/1.0/direct', {
      params: {
        q,
        limit: 5,
        appid: process.env.OWM_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Geocoding API Error:', error);
    res.status(500).json({ error: 'Failed to search for locations' });
  }
};

module.exports = {
  searchLocations
};