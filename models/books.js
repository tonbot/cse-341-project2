const {
  isPlainObject,
  buildValidationResult,
  validateString,
  validateNumber,
  validateBoolean
} = require('./validation');

const buildBookPayload = (body) => {
  if (!isPlainObject(body)) {
    return {
      isValid: false,
      errors: ['Request body must be a JSON object'],
      payload: null
    };
  }

  const errors = [];
  const currentYear = new Date().getFullYear();

  const payload = {
    title: validateString(body.title, 'title', errors, { maxLength: 100 }),
    authorName: validateString(body.authorName, 'authorName', errors, { maxLength: 100 }),
    genre: validateString(body.genre, 'genre', errors, { maxLength: 40 }),
    publishedYear: validateNumber(body.publishedYear, 'publishedYear', errors, {
      integer: true,
      min: 1450,
      max: currentYear
    }),
    pageCount: validateNumber(body.pageCount, 'pageCount', errors, {
      integer: true,
      min: 1,
      max: 5000
    }),
    rating: validateNumber(body.rating, 'rating', errors, {
      min: 0,
      max: 5
    }),
    isAvailable: validateBoolean(body.isAvailable, 'isAvailable', errors),
    format: validateString(body.format, 'format', errors, { maxLength: 30 }),
    summary: validateString(body.summary, 'summary', errors, {
      minLength: 10,
      maxLength: 500
    })
  };

  return buildValidationResult(payload, errors);
};

module.exports = {
  buildBookPayload
};
