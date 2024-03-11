const Redis = require('ioredis');
const env = require('./env');

const connectToRedis = async () => {
  try {
    // eslint-disable-next-line no-new
    return new Redis({
      port: env.REDIS_PORT,
      host: env.REDIS_HOST,
    });
  } catch (error) {
    console.error('Error in connecting to redis', error);
    throw new Error(error);
  }
};

module.exports = {
  connectToRedis,
};
