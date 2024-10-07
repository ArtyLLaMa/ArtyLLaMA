const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const os = require('os');
const compression = require('compression');
const sequelize = require('./src/config/database'); // Import Sequelize instance

const routes = require('./src/routes/index');
const authRoutes = require('./src/routes/auth');
const { rateLimiter } = require('./src/middleware/rateLimiter');
const { errorHandler } = require('./src/middleware/errorHandler');
const { swaggerSpec } = require('./src/config/swagger');
const { initializeApiClients } = require('./src/utils/apiClientInitializer');
const {
  initializeUserPreferences,
  getUserPreferences,
} = require('./src/utils/userPreferencesManager');

dotenv.config();

const app = express();

// Middleware
app.set('trust proxy', 1);
app.use(rateLimiter);
app.use(cors());
app.use(compression());
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', routes);

// Error handling
app.use(errorHandler);

async function startServer() {
  try {
    // Initialize SQLite database
    await sequelize.sync({ alter: true }); // Sync models with the database
    console.log(('Connected to SQLite database'));

    await initializeUserPreferences();
    const userPreferences = await getUserPreferences();
    await initializeApiClients(userPreferences);

    console.log(
      (`
                          Welcome to ArtyLLaMa!
                      Say hello contact@artyllama.com
         Report bugs to https://github.com/kroonen/ArtyLLaMa/issues
      `)
    );

    console.log(('ArtyLLaMa Server Starting...'));

    const PORT = process.env.PORT || 3001;
    const HOST = '0.0.0.0';

    const server = app.listen(PORT, HOST, () => {
      console.log((`Server running on http://${HOST}:${PORT}`));
      console.log((`Local access: http://localhost:${PORT}`));
      console.log(
        (`Swagger UI available at http://localhost:${PORT}/api-docs`)
      );

      const networkInterfaces = os.networkInterfaces();
      Object.keys(networkInterfaces).forEach((interfaceName) => {
        const interfaces = networkInterfaces[interfaceName];
        interfaces.forEach((iface) => {
          if (iface.family === 'IPv4' && !iface.internal) {
            console.log(
              (
                `Network access (${interfaceName}): http://${iface.address}:${PORT}`
              )
            );
            console.log(
              (
                `Swagger UI network access (${interfaceName}): http://${iface.address}:${PORT}/api-docs`
              )
            );
          }
        });
      });
    });

    server.timeout = 120000; // Set to 2 minutes (120,000 ms)

    process.on('exit', () => {
      console.log(('Generating session summary...'));
      // artifactManager.generateSessionSummary(); Not implemented yet
      console.log(('Session summary generated. Goodbye!'));
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error(
        ('Unhandled Rejection at:'),
        promise,
        ('reason:'),
        reason
      );
    });

    process.on('uncaughtException', (error) => {
      console.error(('Uncaught Exception:'), error);
      process.exit(1);
    });
  } catch (error) {
    console.error('Error during server initialization:', error);
    process.exit(1);
  }
}

startServer().catch((error) => {
  console.error('Failed to start the server:', error);
  process.exit(1);
});
