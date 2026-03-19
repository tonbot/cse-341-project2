const express = require('express');
const router = express.Router();

const authorsController = require('../controllers/authors');

router.get(
  '/',
  /*
    #swagger.tags = ['Authors']
    #swagger.summary = 'Get all authors'
    #swagger.responses[200] = {
      description: 'A list of authors',
      content: {
        "application/json": {
          schema: [{
            $ref: '#/components/schemas/Author'
          }]
        }
      }
    }
    #swagger.responses[500] = {
      description: 'Server error',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/Error'
          }
        }
      }
    }
  */
  authorsController.getAll
);

router.post(
  '/',
  /*
    #swagger.tags = ['Authors']
    #swagger.summary = 'Create an author'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/AuthorInput'
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: 'Author created successfully',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/CreatedDocument'
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Validation failed',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/ValidationError'
          }
        }
      }
    }
  */
  authorsController.createAuthor
);

router.get(
  '/:id',
  /*
    #swagger.tags = ['Authors']
    #swagger.summary = 'Get one author by id'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'MongoDB ObjectId for the author',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'The requested author',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/Author'
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid id',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/Error'
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Author not found',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/Error'
          }
        }
      }
    }
  */
  authorsController.getSingle
);

router.put(
  '/:id',
  /*
    #swagger.tags = ['Authors']
    #swagger.summary = 'Update an author by id'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'MongoDB ObjectId for the author',
      required: true,
      type: 'string'
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/AuthorInput'
          }
        }
      }
    }
    #swagger.responses[204] = {
      description: 'Author updated successfully'
    }
    #swagger.responses[400] = {
      description: 'Invalid id or body',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/ValidationError'
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Author not found',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/Error'
          }
        }
      }
    }
  */
  authorsController.updateAuthor
);

router.delete(
  '/:id',
  /*
    #swagger.tags = ['Authors']
    #swagger.summary = 'Delete an author by id'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'MongoDB ObjectId for the author',
      required: true,
      type: 'string'
    }
    #swagger.responses[204] = {
      description: 'Author deleted successfully'
    }
    #swagger.responses[400] = {
      description: 'Invalid id',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/Error'
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Author not found',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/Error'
          }
        }
      }
    }
  */
  authorsController.deleteAuthor
);

module.exports = router;
