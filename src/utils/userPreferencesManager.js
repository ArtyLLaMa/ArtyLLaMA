const fs = require('fs').promises;
const path = require('path');

const USER_PREFERENCES_FILE = path.join(process.cwd(), 'user_preferences.json');

const defaultPreferences = {
  savedMessages: [],
  lastUsedModel: '',
  lastUsedSystemMessage: 'You are a helpful AI assistant.',
  apiKeys: {
    OLLAMA_API_URL: '',
    ANTHROPIC_API_KEY: '',
    OPENAI_API_KEY: '',
  },
  embeddingModel: 'OpenAI',
  enableSemanticSearch: true // New property to toggle semantic search on/off
};

exports.initializeUserPreferences = async () => {
  try {
    await fs.access(USER_PREFERENCES_FILE);
    console.log('User preferences file already exists.');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Creating default user preferences file...');
      await fs.writeFile(
        USER_PREFERENCES_FILE,
        JSON.stringify(defaultPreferences, null, 2)
      );
      console.log('Default user preferences file created successfully.');
    } else {
      console.error('Error checking user preferences file:', error);
    }
  }
};

exports.getUserPreferences = async () => {
  try {
    const data = await fs.readFile(USER_PREFERENCES_FILE, 'utf8');
    const preferences = JSON.parse(data);
    // Merge the loaded preferences with defaults to ensure all properties exist
    return { ...defaultPreferences, ...preferences };
  } catch (error) {
    console.error('Error reading user preferences:', error);
    // If reading fails, return defaults
    return defaultPreferences;
  }
};

exports.saveUserPreferences = async (preferences) => {
  try {
    // Merge with defaultPreferences to ensure no missing keys
    const mergedPreferences = { ...defaultPreferences, ...preferences };
    await fs.writeFile(
      USER_PREFERENCES_FILE,
      JSON.stringify(mergedPreferences, null, 2)
    );
  } catch (error) {
    console.error('Error writing user preferences:', error);
    throw error;
  }
};
