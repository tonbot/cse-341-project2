const express = require('express');

const { passport } = require('../config/passport');
const authController = require('../controllers/auth');
const { ensureAuthConfigured, ensureAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get(
  '/login',
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Start the GitHub OAuth login flow'
    #swagger.description = 'Open this route in the browser to sign in with GitHub. On the first successful login, the API creates a user document in MongoDB and then redirects back to /api-docs with a session cookie for protected routes.'
    #swagger.responses[302] = {
      description: 'Redirects the browser to GitHub for authentication'
    }
    #swagger.responses[503] = {
      description: 'Authentication is not configured',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/ConfigError'
          }
        }
      }
    }
  */
  ensureAuthConfigured,
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'GitHub OAuth callback'
    #swagger.description = 'GitHub redirects back to this route after the user approves login.'
    #swagger.responses[302] = {
      description: 'Redirects to Swagger UI after successful authentication'
    }
    #swagger.responses[401] = {
      description: 'GitHub login failed',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/AuthenticationError'
          }
        }
      }
    }
  */
  ensureAuthConfigured,
  passport.authenticate('github', {
    failureRedirect: '/auth/login-failed',
    session: true
  }),
  authController.handleGithubCallback
);

router.get(
  '/login-failed',
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'GitHub login failure response'
    #swagger.responses[401] = {
      description: 'GitHub login failed',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/AuthenticationError'
          }
        }
      }
    }
  */
  authController.handleLoginFailure
);

router.get(
  '/status',
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Check the current authentication status'
    #swagger.responses[200] = {
      description: 'Authentication status and current user when logged in',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/AuthStatus'
          }
        }
      }
    }
  */
  authController.getStatus
);

router.get(
  '/me',
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Get the currently authenticated user'
    #swagger.security = [{
      "cookieAuth": []
    }]
    #swagger.responses[200] = {
      description: 'The current logged-in user',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/CurrentUserResponse'
          }
        }
      }
    }
    #swagger.responses[401] = {
      description: 'The request does not include a valid authenticated session',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/AuthenticationError'
          }
        }
      }
    }
    #swagger.responses[503] = {
      description: 'Authentication is not configured',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/ConfigError'
          }
        }
      }
    }
  */
  ensureAuthenticated,
  authController.getCurrentUser
);

router.get(
  '/protected',
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'View members-only library content'
    #swagger.description = 'This is an example protected GET route that can be viewed only after the user logs in successfully.'
    #swagger.security = [{
      "cookieAuth": []
    }]
    #swagger.responses[200] = {
      description: 'Protected content visible only to authenticated users',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/ProtectedContentResponse'
          }
        }
      }
    }
    #swagger.responses[401] = {
      description: 'The request does not include a valid authenticated session',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/AuthenticationError'
          }
        }
      }
    }
    #swagger.responses[503] = {
      description: 'Authentication is not configured',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/ConfigError'
          }
        }
      }
    }
  */
  ensureAuthenticated,
  authController.getProtectedContent
);

router.get(
  '/logout',
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Log out the current user'
    #swagger.responses[200] = {
      description: 'The session has been cleared',
      content: {
        "application/json": {
          schema: {
            example: {
              message: 'Logged out successfully'
            }
          }
        }
      }
    }
  */
  authController.logout
);

module.exports = router;
