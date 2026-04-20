const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role:     { type: String, enum: ['jobseeker', 'employer'], default: 'jobseeker' },
  avatar:   { type: String, default: '' },
  bio:      { type: String, default: '' },
  skills:   [{ type: String }],
  resume:   { type: String, default: '' },   // Cloudinary URL
  company:  { type: String, default: '' },   // for employers
  website:  { type: String, default: '' },
  location: { type: String, default: '' },
  refreshToken: { type: String, default: '' }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
