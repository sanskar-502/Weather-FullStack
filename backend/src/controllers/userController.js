const User = require('../models/user');

const getFavorites = async (req, res) => {
  try {
    let user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      user = await User.create({
        uid: req.user.uid,
        email: req.user.email,
        favorites: []
      });
    }
    res.json(user.favorites);
  } catch (error) {
    console.error('Get Favorites Error:', error);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
};

const addFavorite = async (req, res) => {
  try {
    const { id, name, lat, lon } = req.body;
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { 
        $addToSet: { favorites: { id, name, lat, lon } },
        $setOnInsert: { email: req.user.email }
      },
      { new: true, upsert: true }
    );
    res.json(user.favorites);
  } catch (error) {
    console.error('Add Favorite Error:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { $pull: { favorites: { id } } },
      { new: true }
    );
    res.json(user.favorites);
  } catch (error) {
    console.error('Remove Favorite Error:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};

const updatePreferences = async (req, res) => {
  try {
    const { units, theme } = req.body;
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { 
        $set: { preferences: { units, theme } },
        $setOnInsert: { email: req.user.email }
      },
      { new: true, upsert: true }
    );
    res.json(user.preferences);
  } catch (error) {
    console.error('Update Preferences Error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
  updatePreferences
};