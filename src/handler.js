const { nanoid } = require('nanoid');
const bookshelf = require('./bookshelf');

const addBookHandler = (req, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;

  // input validation
  if (name === '' || name === undefined) { // not specify book name
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);

    return response;
  }

  if (readPage > pageCount) { // readPage > pageCount
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);

    return response;
  }

  const id = nanoid(16);
  const isFinishedReading = pageCount === readPage;
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const insertBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    isFinishedReading,
    createdAt,
    updatedAt,
  };

  bookshelf.push(insertBook);

  const isSuccess = bookshelf.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });

    response.code(201);

    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);

  return response;
};

const getBooksHandler = () => ({
  status: 'success',
  data: {
    books: bookshelf,
  },
});

const getBookByIDHandler = (req, h) => {
  const { id } = req.params;

  const book = bookshelf.filter((n) => n.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: { book },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);

  return response;
};

const editBookHandler = (req, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;

  // input validation
  if (name === '' || name === undefined) { // not specify book name
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);

    return response;
  }

  if (readPage > pageCount) { // readPage > pageCount
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);

    return response;
  }

  const { id } = req.params;
  const updatedAt = new Date().toISOString();
  const index = bookshelf.findIndex((n) => n.id === id);

  if (index !== -1) {
    bookshelf[index] = {
      ...bookshelf[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);

  return response;
};

module.exports = {
  addBookHandler, getBooksHandler, getBookByIDHandler, editBookHandler,
};
