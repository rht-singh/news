// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require('joi');

const validatePagination = Joi.object()
  .keys({
    pageNo: Joi.number().positive().default(1).label('Page Number'),
    pageSize: Joi.number().positive().default(10).label('Page Size'),
  });

module.exports = {
  validatePagination,
};
