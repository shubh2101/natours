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
    select: false,
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
  passwordChangedAt: Date,
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

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return bcyrpt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = async function (JWTTimestamps) {
  if (this.passwordChangedAt) {
    const changeTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    console.log(changeTimeStamp, JWTTimestamps);
    return JWTTimestamps < changeTimeStamp;
  }
  //false means not changed
  return false;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
