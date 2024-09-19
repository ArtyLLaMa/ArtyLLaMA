const chalk = require('chalk');

exports.errorHandler = (err, req, res, next) => {
  console.error(chalk.red('Error:'), err);
  if (!res.headersSent) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred. Please try again later.',
    });
  } else if (!res.writableEnded) {
    res.end();
  }
};
