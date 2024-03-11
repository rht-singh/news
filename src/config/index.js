const environmentVariables = require('./env');
const { connectMongoDb } = require('./mongodb.config');
const { connectToRedis } = require('./redis.config');

module.exports = {
  environmentVariables,
  connectMongoDb,
  connectToRedis,
};
