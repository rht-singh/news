const express = require('express');

const { commentControllers } = require('../controllers');

const commentRoutes = express.Router({});

commentRoutes.get('/:storyId', commentControllers.getComments);
commentRoutes.use('*', (req, res) => {
  res.status(404).send({ error: { message: 'Invalid route' } });
});

module.exports = commentRoutes;
