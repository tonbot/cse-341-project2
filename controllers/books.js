const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const { buildBookPayload } = require('../models/books');

const getBooksCollection = () =>
  mongodb.getDb().db(process.env.DB_NAME).collection('books');

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
    const books = await getBooksCollection().find().sort({ title: 1 }).toArray();
    res.status(200).json(books);
  } catch (error) {
    handleServerError(res, 'Unable to fetch books', error);
  }
};

const getSingle = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid book id' });
  }

  try {
    const book = await getBooksCollection().findOne({ _id: new ObjectId(req.params.id) });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    handleServerError(res, 'Unable to fetch book', error);
  }
};

const createBook = async (req, res) => {
  const validation = buildBookPayload(req.body);

  if (!validation.isValid) {
    return sendValidationError(res, validation.errors);
  }

  try {
    const response = await getBooksCollection().insertOne(validation.payload);

    if (!response.acknowledged) {
      return res.status(500).json({ error: 'Unable to create book' });
    }

    res.status(201).json({ _id: response.insertedId });
  } catch (error) {
    handleServerError(res, 'Unable to create book', error);
  }
};

const updateBook = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid book id' });
  }

  const validation = buildBookPayload(req.body);

  if (!validation.isValid) {
    return sendValidationError(res, validation.errors);
  }

  try {
    const response = await getBooksCollection().updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: validation.payload }
    );

    if (!response.matchedCount) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(204).send();
  } catch (error) {
    handleServerError(res, 'Unable to update book', error);
  }
};

const deleteBook = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid book id' });
  }

  try {
    const response = await getBooksCollection().deleteOne({ _id: new ObjectId(req.params.id) });

    if (!response.deletedCount) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(204).send();
  } catch (error) {
    handleServerError(res, 'Unable to delete book', error);
  }
};

module.exports = {
  getAll,
  getSingle,
  createBook,
  updateBook,
  deleteBook
};
