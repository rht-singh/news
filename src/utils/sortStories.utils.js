/**
 *
 * @param {*} stories
 */
const sortStories = async ({ stories }) => {
  /**
   * create an array then add stories with score
   */
  const query = [];
  let storyObjects = [];
  stories.map((story) => {
    // here story is a promise resolved data where actual data of store present in data variable
    const { data } = story;
    if (data.type !== 'story') {
      return true;
    }
    const score = data.score ? data.score : 0;
    const storyObj = {
      storyId: data.id,
      title: data.title,
      url: data.url,
      time: data.time,
      author: data.by,
      score,
    };
    const queryObj = {
      updateOne: {
        filter: { storyId: data.id },
        update: {
          storyId: data.id,
          title: data.title,
          url: data.url,
          time: data.time,
          author: data.by,
          score,
          comments: data.kids,
        },
        upsert: true,
      },
    };
    query.push(queryObj);
    return storyObjects.push([storyObj, score]);
  });

  // Sort the array of an array by child comment count in descending order
  storyObjects.sort((a, b) => b[1] - a[1]);
  storyObjects = storyObjects.map(([storyObj]) => storyObj);
  // fetch top 10 stories
  storyObjects = storyObjects.slice(0, 10);
  return {
    storyObjects,
    query,
  };
};

module.exports = {
  sortStories,
};
