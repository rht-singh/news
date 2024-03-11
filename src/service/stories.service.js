const { StoryModel } = require('../models');

const getStoryById = async ({ storyId }) => StoryModel.aggregate([
  {
    $match: {
      storyId,
    },
  },
  {
    $lookup: {
      localField: 'storyId',
      from: 'comments',
      foreignField: 'storyId',
      as: 'comment',
    },
  },
]);

const addStories = async ({ stories }) => StoryModel.bulkWrite(stories);

module.exports = {
  getStoryById,
  addStories,
};
