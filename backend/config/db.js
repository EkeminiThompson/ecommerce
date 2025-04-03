// backend/config/db.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let isTestEnv = process.env.NODE_ENV === 'test';

const connectDB = async () => {
  try {
    if (isTestEnv) {
      // Create in-memory MongoDB server for testing
      mongoServer = await MongoMemoryServer.create({
        instance: {
          port: 27017, // Optional: Specify a custom port if necessary
        },
        binary: {
          version: '5.0.0', // Optional: Ensure compatibility with your MongoDB version
        },
      });

      console.log('In-Memory MongoDB URI:', mongoServer.getUri());

      const uri = mongoServer.getUri();
      
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds for in-memory server
      });

      console.log('MongoDB Connected: In-Memory Server');
    } else {
      // Use real MongoDB for development/production
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, // Increase timeout for real MongoDB connections
      });

      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    }
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (err) {
    console.error('Database disconnection error:', err);
    process.exit(1);
  }
};

module.exports = { connectDB, disconnectDB };
