const { addBookHandler, getBooksHandler, getBookByIDHandler } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookByIDHandler,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: () => {},
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: () => {},
  },
];

module.exports = routes;
