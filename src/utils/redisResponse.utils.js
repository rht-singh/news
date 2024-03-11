const {
  RESPONSE_TYPES,
  EVENT_TYPES,
} = require('../const');
const { connectToRedis } = require('../config');

const responseBuilder = (responseType, value) => ({
  statusCode: responseType,
  value,
});

const redis = async (event) => {
  const RedisClient = await connectToRedis();
  if (!event.key) {
    return responseBuilder(RESPONSE_TYPES.FAILURE, null);
  }

  switch (event.type) {
    case EVENT_TYPES.GET: {
      let value = await RedisClient.get(event.key);
      await RedisClient.quit();
      if (value) {
        value = JSON.parse(value);
        return responseBuilder(RESPONSE_TYPES.SUCCESS, value);
      }
      return responseBuilder(RESPONSE_TYPES.SUCCESS, value);
    }
    case EVENT_TYPES.GET_TIME: {
      const value = await RedisClient.get(event.key);
      await RedisClient.quit();
      if (value) {
        return value;
      }
      return responseBuilder(RESPONSE_TYPES.SUCCESS, value);
    }
    case EVENT_TYPES.ADD_TIME: {
      if (event.value) {
        const updatedValue = await RedisClient.set(event.key, event.value);
        await RedisClient.quit();
        return responseBuilder(RESPONSE_TYPES.SUCCESS, null, updatedValue);
      }
      return responseBuilder(RESPONSE_TYPES.FAILURE, null);
    }
    case EVENT_TYPES.PAGES: {
      const startIdx = (event.pageNo - 1) * event.pageSize; // Index of first item on current page
      const endIdx = startIdx + event.pageSize - 1;
      let value = await RedisClient.get(event.key);
      await RedisClient.quit();
      if (value) {
        value = JSON.parse(value);
        value = value.slice(startIdx, endIdx + 1);
        return responseBuilder(RESPONSE_TYPES.SUCCESS, value);
      }
      return responseBuilder(RESPONSE_TYPES.SUCCESS, value);
    }
    case EVENT_TYPES.SET: {
      if (event.value) {
        const updatedValue = await RedisClient.set(event.key, JSON.stringify(event.value));
        await RedisClient.quit();
        return responseBuilder(RESPONSE_TYPES.SUCCESS, null, updatedValue);
      }
      return responseBuilder(RESPONSE_TYPES.FAILURE, null);
    }
    case EVENT_TYPES.DELETE: {
      if (event.key) {
        const updatedValue = await RedisClient.del(event.key);
        if (updatedValue) return responseBuilder(RESPONSE_TYPES.SUCCESS, true);
        return responseBuilder(RESPONSE_TYPES.SUCCESS, false);
      }
      return responseBuilder(RESPONSE_TYPES.FAILURE, null);
    }
    default: {
      await RedisClient.quit();
      return responseBuilder(RESPONSE_TYPES.FAILURE, null);
    }
  }
};

module.exports = {
  redis,
};
