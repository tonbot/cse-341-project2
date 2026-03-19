const dotenv = require('dotenv');
dotenv.config({ quiet: true });

const swaggerAutogen = require('swagger-autogen')({
  openapi: '3.0.0'
});

const port = process.env.PORT || 3000;
const publishedApiUrl = process.env.PUBLIC_API_URL || 'https://your-render-service.onrender.com';

const doc = {
  info: {
    title: 'Library API',
    version: '1.0.0',
    description: 'Swagger documentation for the CSE 341 Project 2 Library API.'
  },
  servers: [
    {
      url: `http://localhost:${port}`,
      description: 'Local development server'
    },
    {
      url: publishedApiUrl,
      description: 'Published Render API'
    }
  ],
  tags: [
    {
      name: 'Authors',
      description: 'Create, read, update, and delete authors'
    },
    {
      name: 'Books',
      description: 'Create, read, update, and delete books'
    }
  ],
  components: {
    schemas: {
      Author: {
        _id: '65f2d87159a6ce95c7bc1234',
        firstName: 'Chimamanda',
        lastName: 'Adichie',
        nationality: 'Nigerian',
        birthYear: 1977,
        favoriteGenre: 'Fiction',
        isAwardWinner: true
      },
      AuthorInput: {
        firstName: 'Chimamanda',
        lastName: 'Adichie',
        nationality: 'Nigerian',
        birthYear: 1977,
        favoriteGenre: 'Fiction',
        isAwardWinner: true
      },
      Book: {
        _id: '65f2d87159a6ce95c7bc5678',
        title: 'Purple Hibiscus',
        authorName: 'Chimamanda Adichie',
        genre: 'Fiction',
        publishedYear: 2003,
        pageCount: 307,
        rating: 4.8,
        isAvailable: true,
        format: 'Paperback',
        summary: 'A coming-of-age novel about family, freedom, and identity.'
      },
      BookInput: {
        title: 'Purple Hibiscus',
        authorName: 'Chimamanda Adichie',
        genre: 'Fiction',
        publishedYear: 2003,
        pageCount: 307,
        rating: 4.8,
        isAvailable: true,
        format: 'Paperback',
        summary: 'A coming-of-age novel about family, freedom, and identity.'
      },
      CreatedDocument: {
        _id: '65f2d87159a6ce95c7bc5678'
      },
      ValidationError: {
        error: 'Validation failed',
        details: ['title is required']
      },
      Error: {
        error: 'Unable to fetch books'
      }
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
