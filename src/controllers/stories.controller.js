const { storiesValidation: { validatePagination } } = require('../validation');
const { redis, sortStories } = require('../utils');
const { hackerNewService, storiesService } = require('../service');
const { EVENT_TYPES } = require('../const');

const getStories = async (req, res) => {
  try {
    const { pageNo, pageSize } = await validatePagination.validateAsync(req.query);
    const currentTime = new Date();
    const lastRequestTime = await redis({
      key: 'last_request_time',
      type: EVENT_TYPES.GET_TIME,
    });
    let stories = [];
    if (lastRequestTime && currentTime - new Date(lastRequestTime) <= 15 * 60 * 1000) {
      // fetch data from redis
      stories = await redis({
        key: 'top-stories',
        type: EVENT_TYPES.PAGES,
        pageNo,
        pageSize,
      });
      // stories is an object with  key statusCode and value send value in response
      stories = stories.value;
    } else {
      // fetch data from redis
      stories = await redis({
        key: 'top-stories',
        type: EVENT_TYPES.GET,
      });
      // now whatever value received from redis stores in past-stories
      await redis({
        key: 'past-stories',
        value: stories.value ? stories.value : [],
        type: EVENT_TYPES.SET,
      });
      /**
       * if stories not present in cache then call API's fetch store
       * then store those stories in db and in redis
       */
      const storyIds = await hackerNewService.fetchTopStory();
      stories = await hackerNewService.fetchStoryDetailsById({ Ids: storyIds });
      // sort the data according to score and create query for store story
      stories = await sortStories({ stories });
      // now store that data into db
      await storiesService.addStories({ stories: stories.query });
      // store time also in redis
      await redis({
        key: 'last_request_time',
        value: currentTime,
        type: EVENT_TYPES.ADD_TIME,
      });
      // now top 10 data into redis
      await redis({
        key: 'top-stories',
        value: stories.storyObjects,
        type: EVENT_TYPES.SET,
      });
      // sending top ten stories
      stories = stories.storyObjects;
    }
    return res.json({
      success: true,
      stories,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      message: error.message,
    });
  }
};

const getPastStories = async (req, res) => {
  try {
    const { pageNo, pageSize } = await validatePagination.validateAsync(req.query);
    // fetch data from redis
    const stories = await redis({
      key: 'past-stories',
      type: EVENT_TYPES.PAGES,
      pageNo,
      pageSize,
    });
    return res.json({
      success: true,
      stories: stories.value,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      message: error.message,
    });
  }
};

module.exports = {
  getStories,
  getPastStories,
};
