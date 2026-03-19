const express = require('express');
const router = express.Router();

const booksController = require('../controllers/books');

router.get(
  '/',
  /*
    #swagger.tags = ['Books']
    #swagger.summary = 'Get all books'
    #swagger.responses[200] = {
      description: 'A list of books',
      content: {
        "application/json": {
          schema: [{
            $ref: '#/components/schemas/Book'
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
  booksController.getAll
);

router.post(
  '/',
  /*
    #swagger.tags = ['Books']
    #swagger.summary = 'Create a book'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/BookInput'
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: 'Book created successfully',
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
  booksController.createBook
);

router.get(
  '/:id',
  /*
    #swagger.tags = ['Books']
    #swagger.summary = 'Get one book by id'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'MongoDB ObjectId for the book',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'The requested book',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/Book'
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
      description: 'Book not found',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/Error'
          }
        }
      }
    }
  */
  booksController.getSingle
);

router.put(
  '/:id',
  /*
    #swagger.tags = ['Books']
    #swagger.summary = 'Update a book by id'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'MongoDB ObjectId for the book',
      required: true,
      type: 'string'
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/BookInput'
          }
        }
      }
    }
    #swagger.responses[204] = {
      description: 'Book updated successfully'
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
      description: 'Book not found',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/Error'
          }
        }
      }
    }
  */
  booksController.updateBook
);

router.delete(
  '/:id',
  /*
    #swagger.tags = ['Books']
    #swagger.summary = 'Delete a book by id'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'MongoDB ObjectId for the book',
      required: true,
      type: 'string'
    }
    #swagger.responses[204] = {
      description: 'Book deleted successfully'
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
      description: 'Book not found',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/Error'
          }
        }
      }
    }
  */
  booksController.deleteBook
);

module.exports = router;
