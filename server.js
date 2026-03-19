const dotenv = require('dotenv');
dotenv.config({ quiet: true });

const express = require('express');
const swaggerUi = require('swagger-ui-express');

const mongodb = require('./data/database');
const swaggerDocument = require('./swagger-output.json');

const app = express();
const port = process.env.PORT || 3000;
const swaggerUiHandler = swaggerUi.setup(swaggerDocument);

app.use(express.json());

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
  } else {
    console.log('Database connection ready');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
