const fs = require('fs');
const Tour = require('../models/tourModel');

const tourFilePath = `${__dirname}/../dev-data/data/tours-simple.json`;
let tours = JSON.parse(fs.readFileSync(tourFilePath));

exports.getAllTours = (req, res) => {
  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours } });
};

exports.getTour = (req, res) => {
  const id = +req.params.id; //covert to number

  const tour = tours.find((el) => el.id === id);
  res.status(200).json({ status: 'success', data: { tour } });
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(401).json({
      status: 'Failed',
      message: err,
    });
  }
};

exports.updateTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((tour) => tour.id === id);

  //   const updatedTour = { ...tour, ...req.body };
  const updatedTour = Object.assign(tour, req.body);

  const updatedTours = tours.map((tour) =>
    tour.id === updatedTour.id ? updatedTour : tour
  );

  fs.writeFile(tourFilePath, JSON.stringify(updatedTours), (err) => {
    if (err) {
      return res.status(501).json({
        status: 'failed',
        message: 'Something Went wrong...try again',
      });
    } else {
      return res.status(200).json({
        status: 'success',
        data: {
          tour: updatedTour,
        },
      });
    }
  });
};
exports.deleteTour = (req, res) => {
  const id = +req.params.id;
  const updatedTours = tours.filter((tour) => tour.id !== id);

  fs.writeFile(tourFilePath, JSON.stringify(updatedTours), (err) => {
    if (err) {
      return res.status(404).json({
        status: 'Failed',
        message: 'Something went wrong..',
      });
    } else {
      return res.status(200).json({
        status: 'success',
        data: null,
      });
    }
  });
};
