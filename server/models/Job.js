const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  company:     { type: String, required: true },
  location:    { type: String, required: true },
  type:        { type: String, enum: ['full-time','part-time','contract','internship','remote'], default: 'full-time' },
  description: { type: String, required: true },
  requirements:[{ type: String }],
  skills:      [{ type: String }],
  salary:      { min: Number, max: Number, currency: { type: String, default: 'INR' } },
  postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicants:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
  status:      { type: String, enum: ['open','closed'], default: 'open' },
  logo:        { type: String, default: '' }
}, { timestamps: true });

jobSchema.index({ title: 'text', company: 'text', description: 'text' });

module.exports = mongoose.model('Job', jobSchema);
