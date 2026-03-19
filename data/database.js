const dotenv = require('dotenv');
dotenv.config({ quiet: true });

const { MongoClient } = require('mongodb');

let databaseClient;

const initDb = (callback) => {
  if (databaseClient) {
    return callback(null, databaseClient);
  }

  if (!process.env.MONGODB_URL) {
    return callback(new Error('MONGODB_URL is not set'));
  }

  if (!process.env.DB_NAME) {
    return callback(new Error('DB_NAME is not set'));
  }

  MongoClient.connect(process.env.MONGODB_URL)
    .then((client) => {
      databaseClient = client;
      callback(null, databaseClient);
    })
    .catch((error) => {
      callback(error);
    });
};

const getDatabase = () => {
  if (!databaseClient) {
    throw Error('Database not initialized');
  }

  return databaseClient;
};

module.exports = {
  initDb,
  getDb: getDatabase
};
