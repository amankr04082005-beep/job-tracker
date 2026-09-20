// Express 4 does not catch errors from async handlers, so we forward them to errorHandler.
module.exports = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
