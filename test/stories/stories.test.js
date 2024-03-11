/* eslint-disable import/no-extraneous-dependencies */
const {
  describe, it, after,
} = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { redis } = require('../../src/utils');
const { EVENT_TYPES } = require('../../src/const');
const { StoryModel } = require('../../src/models');
const app = require('../../app');

chai.use(chaiHttp);
const { expect } = chai;
const baseUrl = '/story/top-stories';
const pastStoriesBaseUrl = '/story/past-stories';

// query to delete stories from db after executing test cases
const deleteStories = async () => StoryModel.deleteMany();

describe('Top Stories Test Suit', async () => {
  after(async () => {
    // delete data from redis
    await redis({
      type: EVENT_TYPES.DELETE,
      key: 'top-stories',
    });
    await redis({
      type: EVENT_TYPES.DELETE,
      key: 'past-stories',
    });
    await redis({
      type: EVENT_TYPES.DELETE,
      key: 'last_request_time',
    });
    // delete data from mongodb also
    await deleteStories();
  });
  // eslint-disable-next-line no-undef
  context(`GET ${baseUrl}`, () => {
    it('should give an error because page Number can not be string', async () => {
      const res = await chai.request(app)
        .get(`${baseUrl}?pageNo=test`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('"Page Number" must be a number');
    });
    it('should give an error because page size can not be string', async () => {
      const res = await chai.request(app)
        .get(`${baseUrl}?pageSize=test`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('"Page Size" must be a number');
    });
    it('should fetch data from firebase API then store into DB and send top 10 stories', async () => {
      const res = await chai.request(app)
        .get(`${baseUrl}`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.stories).to.be.an('array');
    });
    it('should fetch top 10 stories from redis', async () => {
      const res = await chai.request(app)
        .get(`${baseUrl}`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.stories).to.be.an('array');
    });
    it('should give error because route not found', async () => {
      const res = await chai.request(app)
        .get(`${baseUrl}/test`);
      expect(res.statusCode).to.equal(404);
      expect(res.body).to.be.an('object');
      expect(res.body.error.message).to.equal('Invalid route');
    });
  });
  // eslint-disable-next-line no-undef
  context(`GET ${pastStoriesBaseUrl}`, () => {
    it('should give an error because page Number can not be string', async () => {
      const res = await chai.request(app)
        .get(`${pastStoriesBaseUrl}?pageNo=test`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('"Page Number" must be a number');
    });
    it('should give an error because page size can not be string', async () => {
      const res = await chai.request(app)
        .get(`${pastStoriesBaseUrl}?pageSize=test`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('"Page Size" must be a number');
    });
    it('should return empty arrat because initially data is not present in past-stories', async () => {
      const res = await chai.request(app)
        .get(`${pastStoriesBaseUrl}`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.stories).to.be.an('array');
      expect(res.body.stories.length).to.equal(+0);
    });
    it('should fetch data from redis of last top 10 stories', async () => {
      const topStories = await redis({
        key: 'top-stories',
        type: EVENT_TYPES.GET,
      });
      // store data into past stories
      await redis({
        key: 'past-stories',
        type: EVENT_TYPES.SET,
        value: topStories.value,
      });
      const res = await chai.request(app)
        .get(`${pastStoriesBaseUrl}`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.stories).to.be.an('array');
      expect(res.body.stories.length).to.be.greaterThan(0);
    });
    it('should give error because route not found', async () => {
      const res = await chai.request(app)
        .get(`${pastStoriesBaseUrl}/test`);
      expect(res.statusCode).to.equal(404);
      expect(res.body).to.be.an('object');
      expect(res.body.error.message).to.equal('Invalid route');
    });
  });
});
