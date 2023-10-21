const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    let queryStr = JSON.stringify(queryObj);
    //advance filtering
    queryStr = queryStr.replace(/\b(gte?|lte?)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));
    let query = Tour.find(JSON.parse(queryStr));
    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt _id');
    }

    //limiting fileds
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    }

    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    const totalTours = await Tour.countDocuments();
    if (req.query.page) {
      if (skip >= totalTours) throw new Error('This page does not exist');
    }

    const totalPages = Math.ceil(totalTours / limit);

    //execute query
    const tours = await query;

    res.status(200).json({
      status: 'success',
      count: tours.length,
      totalTours,
      currentPage: page,
      totalPages,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
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
    res.status(400).json({
      status: 'Failed',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: err,
    });
  }
};
