const router = require('express').Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { authenticate, authorize } = require('../middleware/auth');

// POST /api/applications/:jobId  — apply
router.post('/:jobId', authenticate, authorize('jobseeker'), async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job || job.status === 'closed') return res.status(400).json({ message: 'Job not available' });

  const existing = await Application.findOne({ job: job._id, applicant: req.user._id });
  if (existing) return res.status(400).json({ message: 'Already applied' });

  const app = await Application.create({
    job: job._id, applicant: req.user._id, employer: job.postedBy,
    coverLetter: req.body.coverLetter || '', resumeUrl: req.user.resume
  });
  job.applicants.push(app._id);
  await job.save();
  res.status(201).json({ application: app });
});

// GET /api/applications/mine  — jobseeker's own applications
router.get('/mine', authenticate, authorize('jobseeker'), async (req, res) => {
  const apps = await Application.find({ applicant: req.user._id })
    .populate('job', 'title company location type').sort({ createdAt: -1 });
  res.json({ applications: apps });
});

// GET /api/applications/job/:jobId  — employer sees applicants for a job
router.get('/job/:jobId', authenticate, authorize('employer'), async (req, res) => {
  const job = await Job.findOne({ _id: req.params.jobId, postedBy: req.user._id });
  if (!job) return res.status(403).json({ message: 'Not authorized' });
  const apps = await Application.find({ job: job._id })
    .populate('applicant', 'name email avatar skills bio resume location').sort({ createdAt: -1 });
  res.json({ applications: apps });
});

// PUT /api/applications/:id/status  — employer updates status
router.put('/:id/status', authenticate, authorize('employer'), async (req, res) => {
  const app = await Application.findOne({ _id: req.params.id, employer: req.user._id });
  if (!app) return res.status(404).json({ message: 'Application not found' });
  app.status = req.body.status;
  await app.save();
  res.json({ application: app });
});

module.exports = router;
