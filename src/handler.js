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
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

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
    finished,
    insertedAt,
    updatedAt,
  };

  bookshelf.push(insertBook);

  const isSuccess = bookshelf.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
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

const getBooksHandler = (req) => {
  const { name, reading, finished } = req.query;

  let books = bookshelf;
  if (name !== undefined) {
    books = books.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()));
  } else if (reading !== undefined) {
    if (reading === '1') {
      books = books.filter((b) => b.reading === true);
    } else {
      books = books.filter((b) => b.reading === false);
    }
    // const isReading = (reading === '1');
    // books.filter((b) => b.reading === isReading);
  } else if (finished !== undefined) {
    if (finished === '1') {
      books = books.filter((b) => b.finished === true);
    } else {
      books = books.filter((b) => b.finished === false);
    }
    // const isFinished = (finished === '1');
    // books.filter((b) => b.finished === isFinished);
  }

  const allBooks = [];
  for (let i = 0; i < books.length; i += 1) {
    const { id, name, publisher } = bookshelf[i];

    const tempObj = {
      id, name, publisher,
    };

    allBooks.push(tempObj);
  }

  return {
    status: 'success',
    data: {
      books: allBooks,
    },
  };
};

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

const deleteBookHandler = (req, h) => {
  const { id } = req.params;
  const index = bookshelf.findIndex((n) => n.id === id);

  if (index !== -1) {
    bookshelf.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);

  return response;
};

module.exports = {
  addBookHandler, getBooksHandler, getBookByIDHandler, editBookHandler, deleteBookHandler,
};
