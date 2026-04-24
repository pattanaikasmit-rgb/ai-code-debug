const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

let databaseConnectionPromise = null;

const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  if (databaseConnectionPromise) {
    return databaseConnectionPromise;
  }

  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!mongoUri) {
    console.warn('MongoDB URI is not configured. Add MONGODB_URI to server/.env to enable persistence.');
    return false;
  }

  if (mongoUri.includes('<db_password>')) {
    console.warn(
      'MongoDB URI still contains <db_password>. Replace it with your real Atlas password in server/.env and URL-encode special characters.'
    );
    return false;
  }

  databaseConnectionPromise = mongoose
    .connect(mongoUri, {
      ...(dbName ? { dbName } : {}),
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 20000,
    })
    .then(() => {
      console.log(`MongoDB connected successfully: ${mongoose.connection.name}`);
      return true;
    })
    .catch((error) => {
      if (error.message.includes('querySrv')) {
        console.error(
          'MongoDB connection failed: Atlas SRV lookup failed. Check internet/DNS access or use the non-SRV mongodb:// connection string from Atlas.'
        );
      } else {
        console.error('MongoDB connection failed:', error.message);
      }
      return false;
    })
    .finally(() => {
      if (mongoose.connection.readyState !== 1) {
        databaseConnectionPromise = null;
      }
    });

  try {
    return await databaseConnectionPromise;
  } catch (error) {
    console.error('MongoDB connection bootstrap failed:', error.message);
  }
  return false;
};

module.exports = {
  connectDatabase,
};
