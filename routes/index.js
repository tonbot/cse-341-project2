const router = require('express').Router();

const { getMissingAuthConfig, isAuthConfigured } = require('../config/passport');

const buildUserSummary = (user) => {
  if (!user) {
    return null;
  }

  return {
    username: user.username,
    displayName: user.displayName,
    email: user.email
  };
};

const buildPermissionsSummary = () => ({
  ifLoggedOut: {
    can: [
      'View API documentation.',
      'Read all authors.',
      'Read all books.',
      'Check authentication status.',
      'Start the GitHub login flow.'
    ],
    cannot: [
      'View the authenticated user profile.',
      'View members-only library content.',
      'Create, update, or delete authors.',
      'Create, update, or delete books.',
      'Log out of an authenticated session.'
    ]
  },
  ifLoggedIn: {
    can: [
      'View API documentation.',
      'Read all authors.',
      'Read all books.',
      'View the authenticated user profile.',
      'View members-only library content.',
      'Create, update, or delete authors.',
      'Create, update, or delete books.',
      'Log out successfully.'
    ],
    cannot: []
  }
});

router.get(
  '/',
  /*
    #swagger.summary = 'Check that the Library API is running'
    #swagger.responses[200] = {
      description: 'API welcome message',
      content: {
        "application/json": {
          schema: {
            example: {
              message: 'Library API is running',
              docs: '/api-docs',
              auth: {
                login: '/auth/login',
                logout: '/auth/logout',
                status: '/auth/status',
                me: '/auth/me',
                protected: '/auth/protected'
              },
              authentication: {
                isConfigured: true,
                missingConfig: [],
                isLoggedIn: false,
                user: null,
                nextStep: 'Open /auth/login in a browser to sign in with GitHub.'
              },
              currentAccess: {
                can: [
                  'View API documentation.',
                  'Read all authors.',
                  'Read all books.',
                  'Check authentication status.',
                  'Start the GitHub login flow.'
                ],
                cannot: [
                  'View the authenticated user profile.',
                  'View members-only library content.',
                  'Create, update, or delete authors.',
                  'Create, update, or delete books.',
                  'Log out of an authenticated session.'
                ]
              },
              permissionsSummary: {
                ifLoggedOut: {
                  can: [
                    'View API documentation.',
                    'Read all authors.',
                    'Read all books.',
                    'Check authentication status.',
                    'Start the GitHub login flow.'
                  ],
                  cannot: [
                    'View the authenticated user profile.',
                    'View members-only library content.',
                    'Create, update, or delete authors.',
                    'Create, update, or delete books.',
                    'Log out of an authenticated session.'
                  ]
                },
                ifLoggedIn: {
                  can: [
                    'View API documentation.',
                    'Read all authors.',
                    'Read all books.',
                    'View the authenticated user profile.',
                    'View members-only library content.',
                    'Create, update, or delete authors.',
                    'Create, update, or delete books.',
                    'Log out successfully.'
                  ],
                  cannot: []
                }
              }
            }
          }
        }
      }
    }
  */
  (req, res) => {
    const permissionsSummary = buildPermissionsSummary();
    const isLoggedIn = Boolean(req.isAuthenticated && req.isAuthenticated());
    const authConfigured = isAuthConfigured();
    const missingConfig = getMissingAuthConfig();

    res.status(200).json({
      message: 'Library API is running',
      docs: '/api-docs',
      auth: {
        login: '/auth/login',
        logout: '/auth/logout',
        status: '/auth/status',
        me: '/auth/me',
        protected: '/auth/protected'
      },
      authentication: {
        isConfigured: authConfigured,
        missingConfig,
        isLoggedIn,
        user: buildUserSummary(req.user),
        nextStep: authConfigured
          ? isLoggedIn
            ? 'You are logged in and can use protected routes from Swagger or the REST client.'
            : 'Open /auth/login in a browser to sign in with GitHub.'
          : 'Add the missing GitHub OAuth environment variables to enable login.'
      },
      currentAccess: isLoggedIn ? permissionsSummary.ifLoggedIn : permissionsSummary.ifLoggedOut,
      permissionsSummary
    });
  }
);

router.use('/auth', require('./auth'));
router.use('/authors', require('./authors'));
router.use('/books', require('./books'));

module.exports = router;
