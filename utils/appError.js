class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
    //captureStackTrace line prevents this class from showing up in the stack trace,
    //which is part of the console log that shows where in code the error occurred.
  }
}

module.exports = AppError;
