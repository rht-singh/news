/**
 *
 * @param {*} comments
 */

const sortComment = async ({ comments }) => {
  /**
   * create an array then add comments with count of subcomments
   */
  let commentsObj = [];
  comments.map((comment) => {
    const childCount = comment.kids ? comment.kids.length : 0;
    return commentsObj.push([comment, childCount]);
  });

  // Sort the array of an array by child comment count in descending order
  commentsObj.sort((a, b) => b[1] - a[1]);
  // Extract the top 10 comments
  commentsObj = commentsObj.slice(0, 10);
  return commentsObj.map(([comment]) => ({ comment: comment.comment, by: comment.author }));
};

module.exports = {
  sortComment,
};
