const fs = require('fs').promises;
const path = require('path');

const USER_PREFERENCES_FILE = path.join(__dirname, '..', '..', 'user_preferences.json');

const defaultPreferences = {
  savedMessages: [],
  lastUsedModel: '',
  lastUsedSystemMessage: 'You are a helpful AI assistant.',
  apiKeys: {
    OLLAMA_API_URL: '',
    ANTHROPIC_API_KEY: '',
    OPENAI_API_KEY: '',
  },
};

exports.initializeUserPreferences = async () => {
  try {
    await fs.access(USER_PREFERENCES_FILE);
    console.log('User preferences file already exists.');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Creating default user preferences file...');
      await fs.writeFile(USER_PREFERENCES_FILE, JSON.stringify(defaultPreferences, null, 2));
      console.log('Default user preferences file created successfully.');
    } else {
      console.error('Error checking user preferences file:', error);
    }
  }
};

exports.getUserPreferencesData = async () => {
  try {
    const data = await fs.readFile(USER_PREFERENCES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading user preferences:', error);
    throw error;
  }
};

exports.saveUserPreferencesData = async (preferences) => {
  try {
    await fs.writeFile(USER_PREFERENCES_FILE, JSON.stringify(preferences, null, 2));
  } catch (error) {
    console.error('Error writing user preferences:', error);
    throw error;
  }
};
