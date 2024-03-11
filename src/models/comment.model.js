const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
  storyId: {
    type: Number,
    required: true,
    index: true,
  },
  commentId: {
    type: Number,
    required: true,
    index: true,
  },
  comment: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  // kids are subCommente Ids
  kids: [{
    type: Number,
  }],
}, { timestamps: true });

const CommentModel = mongoose.model('comment', commentSchema);

module.exports = CommentModel;
