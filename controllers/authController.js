const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  //check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  const correct = await user.correctPassword(password, user.password);

  if (!user || !correct) {
    return next(new AppError('Incorrect email or password!', 401));
  }

  const token = '';
  res.status(201).json({
    status: 'success',
    token,
  });
  next();
});

//to generate random secret key
//node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
