const mongoose = require('mongoose');

const { Schema } = mongoose;

const storySchema = new Schema({
  storyId: {
    type: Number,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  comments: [{
    type: Number,
    required: true,
  }],
}, { timestamps: true });

const StoryModel = mongoose.model('story', storySchema);
module.exports = StoryModel;
