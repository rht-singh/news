// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require('joi');

const storyIdValidation = Joi.object().keys({
  storyId: Joi.number().label('Story Id'),
});

module.exports = {
  storyIdValidation,
};
