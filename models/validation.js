const isPlainObject = (value) =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const buildValidationResult = (payload, errors) => ({
  isValid: errors.length === 0,
  errors,
  payload: errors.length ? null : payload
});

const validateString = (value, fieldName, errors, options = {}) => {
  const { minLength = 1, maxLength = 200 } = options;

  if (typeof value !== 'string') {
    errors.push(`${fieldName} must be a string`);
    return null;
  }

  const normalizedValue = value.trim();

  if (normalizedValue.length < minLength) {
    errors.push(`${fieldName} is required`);
    return null;
  }

  if (normalizedValue.length > maxLength) {
    errors.push(`${fieldName} must be ${maxLength} characters or fewer`);
    return null;
  }

  return normalizedValue;
};

const validateNumber = (value, fieldName, errors, options = {}) => {
  const { integer = false, min, max } = options;
  const parsedValue =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim() !== ''
        ? Number(value)
        : Number.NaN;

  if (Number.isNaN(parsedValue)) {
    errors.push(`${fieldName} must be a valid number`);
    return null;
  }

  if (integer && !Number.isInteger(parsedValue)) {
    errors.push(`${fieldName} must be a whole number`);
    return null;
  }

  if (min !== undefined && parsedValue < min) {
    errors.push(`${fieldName} must be at least ${min}`);
    return null;
  }

  if (max !== undefined && parsedValue > max) {
    errors.push(`${fieldName} must be at most ${max}`);
    return null;
  }

  return parsedValue;
};

const validateBoolean = (value, fieldName, errors) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (value === 'true' || value === 'false') {
    return value === 'true';
  }

  errors.push(`${fieldName} must be true or false`);
  return null;
};

module.exports = {
  isPlainObject,
  buildValidationResult,
  validateString,
  validateNumber,
  validateBoolean
};
