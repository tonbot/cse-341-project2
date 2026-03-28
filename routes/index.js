const router = require('express').Router();

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
                me: '/auth/me'
              }
            }
          }
        }
      }
    }
  */
  (req, res) => {
    res.status(200).json({
      message: 'Library API is running',
      docs: '/api-docs',
      auth: {
        login: '/auth/login',
        logout: '/auth/logout',
        status: '/auth/status',
        me: '/auth/me'
      }
    });
  }
);

router.use('/auth', require('./auth'));
router.use('/authors', require('./authors'));
router.use('/books', require('./books'));

module.exports = router;
