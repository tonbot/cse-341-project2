const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const { buildAuthorPayload } = require('../models/authors');

const getAuthorsCollection = () =>
  mongodb.getDb().db(process.env.DB_NAME).collection('authors');

const sendValidationError = (res, errors) =>
  res.status(400).json({
    error: 'Validation failed',
    details: errors
  });

const handleServerError = (res, message, error) => {
  console.error(error);
  res.status(500).json({ error: message });
};

const getAll = async (req, res) => {
  try {
    const authors = await getAuthorsCollection().find().sort({ lastName: 1, firstName: 1 }).toArray();
    res.status(200).json(authors);
  } catch (error) {
    handleServerError(res, 'Unable to fetch authors', error);
  }
};

const getSingle = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid author id' });
  }

  try {
    const author = await getAuthorsCollection().findOne({ _id: new ObjectId(req.params.id) });

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.status(200).json(author);
  } catch (error) {
    handleServerError(res, 'Unable to fetch author', error);
  }
};

const createAuthor = async (req, res) => {
  const validation = buildAuthorPayload(req.body);

  if (!validation.isValid) {
    return sendValidationError(res, validation.errors);
  }

  try {
    const response = await getAuthorsCollection().insertOne(validation.payload);

    if (!response.acknowledged) {
      return res.status(500).json({ error: 'Unable to create author' });
    }

    res.status(201).json({ _id: response.insertedId });
  } catch (error) {
    handleServerError(res, 'Unable to create author', error);
  }
};

const updateAuthor = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid author id' });
  }

  const validation = buildAuthorPayload(req.body);

  if (!validation.isValid) {
    return sendValidationError(res, validation.errors);
  }

  try {
    const response = await getAuthorsCollection().updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: validation.payload }
    );

    if (!response.matchedCount) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.status(204).send();
  } catch (error) {
    handleServerError(res, 'Unable to update author', error);
  }
};

const deleteAuthor = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid author id' });
  }

  try {
    const response = await getAuthorsCollection().deleteOne({ _id: new ObjectId(req.params.id) });

    if (!response.deletedCount) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.status(204).send();
  } catch (error) {
    handleServerError(res, 'Unable to delete author', error);
  }
};

module.exports = {
  getAll,
  getSingle,
  createAuthor,
  updateAuthor,
  deleteAuthor
};
