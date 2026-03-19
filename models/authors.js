const {
  isPlainObject,
  buildValidationResult,
  validateString,
  validateNumber,
  validateBoolean
} = require('./validation');

const buildAuthorPayload = (body) => {
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
    firstName: validateString(body.firstName, 'firstName', errors, { maxLength: 50 }),
    lastName: validateString(body.lastName, 'lastName', errors, { maxLength: 50 }),
    nationality: validateString(body.nationality, 'nationality', errors, { maxLength: 60 }),
    birthYear: validateNumber(body.birthYear, 'birthYear', errors, {
      integer: true,
      min: 1800,
      max: currentYear
    }),
    favoriteGenre: validateString(body.favoriteGenre, 'favoriteGenre', errors, {
      maxLength: 40
    }),
    isAwardWinner: validateBoolean(body.isAwardWinner, 'isAwardWinner', errors)
  };

  return buildValidationResult(payload, errors);
};

module.exports = {
  buildAuthorPayload
};
