const { commentValidation: { storyIdValidation } } = require('../validation');
const { storiesService, hackerNewService, commentService } = require('../service');
const { sortComment } = require('../utils');

const getComments = async (req, res) => {
  try {
    const { storyId } = await storyIdValidation.validateAsync(req.params);
    /**
     * fetch data from db by storyId
     * as well as fetch comments from db also if exists
     */
    let story = await storiesService.getStoryById({ storyId });
    // story will be an array of an object
    // because we are using aggragation function for query which always return array of an object
    // destructure object from an array
    [story] = story;
    if (!story) {
      throw new Error('Invalid Story Id');
    }
    // get comment From story
    const { comment } = story;
    /**
     * check if comments are present in db then send comment of a given story sorted by a total number of child comments.
     * else fetch comments through API then store into db
     */
    if (comment.length === story.comments.length) {
      const comments = await sortComment({ comments: comment });
      story = comments;
    } else {
      const commentsData = await hackerNewService.fetchStoryDetailsById({ Ids: story.comments });
      const commentsObj = [];
      // comments Data now contains an array of an objects of comments
      // store this data into db if already stored update that data
      const query = commentsData.map((commentObj) => {
        const updateCommentObj = {
          storyId,
          commentId: commentObj.data.id,
          comment: commentObj.data.text,
          author: commentObj.data.by,
          kids: commentObj.data.kids,
        };
        const queryObj = {
          updateOne: {
            filter: { commentId: commentObj.data.id },
            update: updateCommentObj,
            upsert: true,
          },
        };
        commentsObj.push(updateCommentObj);
        return queryObj;
      });
      await commentService.addComments({ comments: query });
      const comments = await sortComment({ comments: commentsObj });
      story = comments;
    }
    return res.json({
      success: true,
      comment: story,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      message: error.message,
    });
  }
};

module.exports = {
  getComments,
};
