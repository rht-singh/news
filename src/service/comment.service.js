const { CommentModel } = require('../models');

/**
 *
 * @param {*} comments
 * @returns
 */
const addComments = async ({ comments }) => CommentModel.bulkWrite(comments);

module.exports = {
  addComments,
};
