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

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// app.route('/api/v1/tours').get(getAllTours).post(createTour);

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

// app
//   .route('/api/v1/tours/:id')
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);

// app.route('/api/v1/users').get(getAllUsers).post(createUser);

// app
//   .route('/api/v1/users/:id')
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser);

const port = 3000;
app.listen(port, () => {
  console.log(`app is running on the ${port}...`);
});
