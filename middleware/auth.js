const { getMissingAuthConfig, isAuthConfigured } = require('../config/passport');

const buildConfigurationError = () => ({
  error: 'Authentication is not configured',
  details: getMissingAuthConfig().map((variableName) => `${variableName} is required`)
});

const ensureAuthConfigured = (req, res, next) => {
  if (isAuthConfigured()) {
    return next();
  }

  return res.status(503).json(buildConfigurationError());
};

const ensureAuthenticated = (req, res, next) => {
  if (!isAuthConfigured()) {
    return res.status(503).json(buildConfigurationError());
  }

  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({ error: 'Authentication required' });
};

module.exports = {
  ensureAuthConfigured,
  ensureAuthenticated
};
