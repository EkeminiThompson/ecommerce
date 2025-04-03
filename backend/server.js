const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB, disconnectDB } = require('./config/db'); // Import disconnectDB for cleanup

// Load environment variables based on the environment
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Closet Cater API is running' });
});

// Connect to the database
(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit if DB connection fails
  }
})();

// Route imports and setup
console.log('Importing routes...');
try {
  const productRoutes = require('./routes/productRoutes');
  const authRoutes = require('./routes/authRoutes');
  const userRoutes = require('./routes/userRoutes');
  const orderRoutes = require('./routes/orderRoutes');

  // Mount routes
  [
    { path: '/api/products', router: productRoutes },
    { path: '/api/auth', router: authRoutes },
    { path: '/api/users', router: userRoutes },
    { path: '/api/orders', router: orderRoutes }
  ].forEach(route => {
    if (typeof route.router === 'function') {
      app.use(route.path, route.router);
      console.log(`Mounted routes for ${route.path}`);
    } else {
      console.error(`Invalid router for ${route.path}`);
    }
  });
} catch (err) {
  console.error('Route import failed:', err);
  process.exit(1); // Exit if route import fails
}

// Error handling middleware
try {
  const { notFound, errorHandler } = require('./middleware/error');
  app.use(notFound);
  app.use(errorHandler);
  console.log('Error middleware mounted');
} catch (err) {
  console.error('Error middleware setup failed:', err);
  process.exit(1); // Exit if error middleware setup fails
}

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down server...');
  await disconnectDB();
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};

// Handle process events for graceful shutdown
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  shutdown();
});

module.exports = app; // Export for testing
