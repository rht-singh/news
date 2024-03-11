const express = require('express');
const { environmentVariables, connectMongoDb } = require('./src/config');
const apiRoutes = require('./src/routes');

const app = express();

app.use(apiRoutes);

app.listen(environmentVariables.APP_PORT, (err) => {
  if (err) {
    console.error(err);
  }
  connectMongoDb()
    .then(() => {
      console.info('connected to mongodb atlas');
      console.info(`Server running on ${environmentVariables.APP_PORT}`);
    })
    .catch((_error) => {
      console.log(_error);
    });
});

module.exports = app;
