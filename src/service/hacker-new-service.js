// File responsible to comminicate to hacker news service

const axios = require('axios');

const fetchTopStory = async () => {
  const stories = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
  return stories.data;
};

const fetchStoryDetailsById = async ({ Ids }) => {
  const fetchDetailPromise = [];
  Ids.forEach((Id) => {
    fetchDetailPromise.push(axios.get(`https://hacker-news.firebaseio.com/v0/item/${Id}.json?print=pretty`));
  });
  const storyDetails = await Promise.all(fetchDetailPromise);
  return storyDetails;
};

module.exports = {
  fetchTopStory,
  fetchStoryDetailsById,
};
