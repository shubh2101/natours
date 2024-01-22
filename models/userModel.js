const crypto = require('crypto');
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
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guide'],
    default: 'user',
  },
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
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    select: false,
    default: true,
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

UserSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//removing inactive users from get all users
UserSchema.pre(/^find/, function (next) {
  //this points to current query
  this.find({ active: { $ne: false } });
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
    // console.log(changeTimeStamp, JWTTimestamps);
    return JWTTimestamps < changeTimeStamp;
  }
  //false means not changed
  return false;
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
