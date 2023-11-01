const express = require('express');
const toursRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/usersRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.use(express.json());

// app.get('/', (req, res) => {
//   res
//   .status(200)
//   .json({ message: 'Hello from the server side', app : "natours" });
// });

// app.post("/", (req,res) => {
//     res.send("You can post to the endpoint..")
// })

// app.route('/api/v1/tours').get(getAllTours).post(createTour);

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

app.all('*', (req, res, next) => {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: `Can't find ${req.originalUrl} on this server`,
  //   });
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
