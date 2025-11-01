const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  updatePreferences
} = require('../controllers/userController');
const { authenticateUser } = require('../middleware/auth');

router.use(authenticateUser);

router.get('/favorites', getFavorites);
router.post('/favorites', addFavorite);
router.delete('/favorites/:id', removeFavorite);
router.put('/preferences', updatePreferences);

module.exports = router;