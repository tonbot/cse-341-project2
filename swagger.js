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
      name: 'Auth',
      description: 'GitHub OAuth login and session-based authentication'
    },
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
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'connect.sid',
        description:
          'Session cookie created after a successful GitHub OAuth login at /auth/login.'
      }
    },
    schemas: {
      UserProfile: {
        _id: '65f2d87159a6ce95c7bc9999',
        githubId: '123456789',
        username: 'octocat',
        displayName: 'The Octocat',
        email: 'octocat@example.com',
        avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
        profileUrl: 'https://github.com/octocat',
        provider: 'github',
        createdAt: '2026-03-28T10:00:00.000Z',
        updatedAt: '2026-03-28T10:00:00.000Z'
      },
      AuthStatus: {
        isAuthenticated: true,
        user: {
          _id: '65f2d87159a6ce95c7bc9999',
          githubId: '123456789',
          username: 'octocat',
          displayName: 'The Octocat',
          email: 'octocat@example.com',
          avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
          profileUrl: 'https://github.com/octocat',
          provider: 'github',
          createdAt: '2026-03-28T10:00:00.000Z',
          updatedAt: '2026-03-28T10:00:00.000Z'
        }
      },
      CurrentUserResponse: {
        user: {
          _id: '65f2d87159a6ce95c7bc9999',
          githubId: '123456789',
          username: 'octocat',
          displayName: 'The Octocat',
          email: 'octocat@example.com',
          avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
          profileUrl: 'https://github.com/octocat',
          provider: 'github',
          createdAt: '2026-03-28T10:00:00.000Z',
          updatedAt: '2026-03-28T10:00:00.000Z'
        }
      },
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
      AuthenticationError: {
        error: 'Authentication required'
      },
      ConfigError: {
        error: 'Authentication is not configured',
        details: [
          'GITHUB_CLIENT_ID is required',
          'GITHUB_CLIENT_SECRET is required',
          'SESSION_SECRET is required'
        ]
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
