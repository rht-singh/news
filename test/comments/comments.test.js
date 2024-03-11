/* eslint-disable import/no-extraneous-dependencies */
const {
  describe, it, after, before,
} = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { storiesService, hackerNewService } = require('../../src/service');
const { sortStories } = require('../../src/utils');
const { StoryModel, CommentModel } = require('../../src/models');
const app = require('../../app');

chai.use(chaiHttp);
const { expect } = chai;
const baseUrl = '/comments';

// query to delete stories and comments from db after executing test cases
const deleteStories = async () => StoryModel.deleteMany();
const deleteComments = async () => CommentModel.deleteMany();

const storyInfo = {};

describe('Comments of Stories Test Suit', async () => {
  before(async () => {
    // first store a story in db
    const storyId = await hackerNewService.fetchTopStory();
    // store only one data for testing in db
    let story = await hackerNewService.fetchStoryDetailsById({ Ids: [storyId[0]] });
    story = await sortStories({ stories: story });
    // now store that data into db
    await storiesService.addStories({ stories: story.query });
    storyInfo.storyId = [storyId[0]];
    // store story id in storyInfo
    console.log(storyInfo);
  });
  after(async () => {
    // delete data from mongodb also
    await deleteStories();
    await deleteComments();
  });
  // eslint-disable-next-line no-undef
  context(`GET ${baseUrl}`, () => {
    it('should give an error storyId must be a number', async () => {
      const res = await chai.request(app)
        .get(`${baseUrl}/test`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('"Story Id" must be a number');
    });
    it('should give an error story Id is not exist in db', async () => {
      const res = await chai.request(app)
        .get(`${baseUrl}/123456`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Invalid Story Id');
    });
    it('should give comments from db if exist otherwise fetch from firebase', async () => {
      const res = await chai.request(app)
        .get(`${baseUrl}/${storyInfo.storyId}`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.story).to.be.an('array');
    });
    it('should give comments from db because now comments are exist in db due to upper test case', async () => {
      const res = await chai.request(app)
        .get(`${baseUrl}/${storyInfo.storyId}`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.story).to.be.an('array');
    });
    it('should give error because route not found', async () => {
      const res = await chai.request(app)
        .get(`${baseUrl}/${storyInfo.storyId}/test`);
      expect(res.statusCode).to.equal(404);
      expect(res.body).to.be.an('object');
      expect(res.body.error.message).to.equal('Invalid route');
    });
  });
});
