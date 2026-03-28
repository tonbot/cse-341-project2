const dotenv = require('dotenv');
dotenv.config({ quiet: true });

const express = require('express');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const swaggerUi = require('swagger-ui-express');

const { configurePassport, passport } = require('./config/passport');
const mongodb = require('./data/database');
const swaggerDocument = require('./swagger-output.json');

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const MongoStore = connectMongo.default || connectMongo.MongoStore || connectMongo;
const swaggerUiHandler = swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    persistAuthorization: true
  }
});

configurePassport();

if (isProduction) {
  app.set('trust proxy', 1);
}

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'development-session-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      dbName: process.env.DB_NAME,
      collectionName: 'sessions'
    }),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUiHandler);
app.get('/api-docs/', swaggerUiHandler);
app.get('/api-docs.json', (req, res) => {
  res.status(200).json(swaggerDocument);
});

app.use('/', require('./routes'));

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Unexpected server error' });
});

mongodb.initDb((err) => {
  if (err) {
    console.error('Unable to connect to database', err.message);
    process.exit(1);
  }

  console.log('Database connection ready');

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
});
