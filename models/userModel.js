const mongoose = require('mongoose');
const validate = require('validator');
const bcyrpt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please, tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please, tell us your email!'],
    unique: true,
    validate: [validate.isEmail, 'Please, provide a valid email.'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please, provide password !'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not matching',
    },
  },
});

UserSchema.pre('save', async function (next) {
  // run this function only if password is modified
  if (!this.isModified('password')) return next();
  //hash the password with cost of 12
  this.password = await bcyrpt.hash(this.password, 12);
  // delete the passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
