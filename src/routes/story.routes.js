const express = require('express');

const { storyControllers } = require('../controllers');

const storyRoutes = express.Router();

storyRoutes.get('/top-stories', storyControllers.getStories);
storyRoutes.get('/past-stories', storyControllers.getPastStories);

storyRoutes.use('*', (req, res) => {
  res.status(404).send({ error: { message: 'Invalid route' } });
});

module.exports = storyRoutes;
