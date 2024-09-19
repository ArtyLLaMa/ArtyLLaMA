const { getUserPreferences, saveUserPreferences } = require('../utils/userPreferencesManager');

exports.getUserPreferences = async (req, res) => {
  try {
    const preferences = await getUserPreferences();
    res.json(preferences);
  } catch (error) {
    console.error('Error reading user preferences:', error);
    res.status(500).json({ error: 'Failed to read user preferences' });
  }
};

exports.saveUserPreferences = async (req, res) => {
  try {
    const preferences = req.body;
    await saveUserPreferences(preferences);
    res.json({ message: 'User preferences updated successfully' });
  } catch (error) {
    console.error('Error writing user preferences:', error);
    res.status(500).json({ error: 'Failed to update user preferences' });
  }
};
