const AppError = require('../utils/appError');

const handleCastErrorDb = (err) => {
  const message = `Invalid ${err.path} : ${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDb = (err) => {
  const value = Object.values(err.keyValue)[0];
  const field = Object.keys(err.keyValue)[0];
  const message = `Duplicate ${field} value : ${value}, Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDb = (err) => {
  const { message } = err;
  return new AppError(message, 400);
};

const sendDevErrror = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  //operational trusted error : send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //programming errors or other unknown error : don't leak error details
  } else {
    // 1) Log error
    // console.error('ERROR', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong.',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevErrror(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') err = handleCastErrorDb(err);
    const error = { ...err };
    if (error.code === 11000) err = handleDuplicateFieldsDb(err);

    if (err.name === 'ValidationError') err = handleValidationErrorDb(err);
    sendProdError(err, res);
  }
};
