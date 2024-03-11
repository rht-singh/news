const express = require('express');
const storyRoutes = require('./story.routes');
const commentRoutes = require('./comment.routes');

const apiRoutes = express.Router();

apiRoutes.use('/story', storyRoutes);
apiRoutes.use('/comments', commentRoutes);

apiRoutes.use('*', (req, res) => {
  res.status(404).send({ error: { message: 'Invalid route' } });
});

module.exports = apiRoutes;
