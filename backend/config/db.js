const mongoose = require('mongoose');

// MongoDB 4.4 connection settings
const MONGO_CONFIG = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

const connectDB = async () => {
  try {
    // Use environment variable or fallback name
    const dbName = process.env.MONGO_DB_NAME || 'closet_cater_db';
    
    await mongoose.connect(`mongodb://localhost:27017/${dbName}`, MONGO_CONFIG);
    
    console.log(`MongoDB Connected: ${mongoose.connection.host}/${dbName}`);
    
    // Verify database exists by creating a test collection
    await mongoose.connection.db.collection('teststartup').insertOne({ 
      startup: new Date() 
    });
    
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('Database disconnected');
  } catch (err) {
    console.error('Disconnection failed:', err);
  }
};

// Get current database name
const getDBName = () => mongoose.connection?.name;

module.exports = { connectDB, disconnectDB, getDBName };
