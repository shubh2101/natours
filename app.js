const express = require('express');
const fs = require('fs');

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

let tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
app.get('/api/v1/tours', (req, res) => {
  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours } });
});

app.get('/api/v1/tours/:id', (req, res) => {
  const id = +req.params.id; //covert to number
  if (id >= tours.length || id < 0 || isNaN(id)) {
    return res.status(404).json({ status: 'Failed', message: 'Invalid Id' });
  }
  const tour = tours.find((el) => el.id === id);
  res.status(200).json({ status: 'success', data: { tour } });
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  // tours.push(newTour);
  const newTour = { id: newId, ...req.body };
  tours = [...tours, newTour];

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.patch('/api/v1/tours/:id', (req, res) => {
 
  const id = +req.params.id;
  const tour = tours.find((tour) => tour.id === id);
  
  if (!tour) {
    return res.status(404).json({
      status: 'Failed',
      message: 'Invalid Id',
    });
  }

  //   const updatedTour = { ...tour, ...req.body };
  const updatedTour = Object.assign(tour, req.body);
 
  const updatedTours = tours.map((tour) =>
    tour.id === updatedTour.id ? updatedTour : tour
  );

  fs.writeFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    (err) => {
      if (err) {
        return res.status(501).json({
          status: 'failed',
          message: 'Something Went wrong...try again',
        });
      }
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updated tour here...',
    },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`app is running on the ${port}...`);
});
