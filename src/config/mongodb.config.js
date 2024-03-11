const mongoose = require('mongoose');
const env = require('./env');

const connectMongoDb = async () => {
  try {
    mongoose.set('strictQuery', true);
    if (env.NODE_ENV === 'test') {
      await mongoose.connect(env.MONGO_URI_TEST, { useNewurlParser: true, useUnifiedTopology: true });
    } else {
      await mongoose.connect(env.MONGO_URI, { useNewurlParser: true, useUnifiedTopology: true });
    }
  } catch (error) {
    console.error('Error in connecting to mongodb Atlas', error);
    throw new Error(error);
  }
};

module.exports = {
  connectMongoDb,
};
