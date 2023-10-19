const express = require('express');
const toursRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/usersRoutes');

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

module.exports = app


