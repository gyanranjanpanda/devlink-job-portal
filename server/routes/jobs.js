const router = require('express').Router();
const Job = require('../models/Job');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/jobs  — search, filter, paginate
router.get('/', async (req, res) => {
  const { q, type, location, page = 1, limit = 10 } = req.query;
  const filter = { status: 'open' };
  if (q) filter.$text = { $search: q };
  if (type) filter.type = type;
  if (location) filter.location = new RegExp(location, 'i');

  const skip = (page - 1) * limit;
  const [jobs, total] = await Promise.all([
    Job.find(filter).populate('postedBy', 'name avatar company').sort({ createdAt: -1 }).skip(skip).limit(+limit),
    Job.countDocuments(filter)
  ]);
  res.json({ jobs, total, pages: Math.ceil(total / limit), page: +page });
});

// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  const job = await Job.findById(req.params.id).populate('postedBy', 'name avatar company website');
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json({ job });
});

// POST /api/jobs — employer only
router.post('/', authenticate, authorize('employer'), async (req, res) => {
  const job = await Job.create({ ...req.body, postedBy: req.user._id, company: req.user.company });
  res.status(201).json({ job });
});

// PUT /api/jobs/:id — employer only (own job)
router.put('/:id', authenticate, authorize('employer'), async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, postedBy: req.user._id });
  if (!job) return res.status(404).json({ message: 'Job not found or not authorized' });
  Object.assign(job, req.body);
  await job.save();
  res.json({ job });
});

// DELETE /api/jobs/:id
router.delete('/:id', authenticate, authorize('employer'), async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.user._id });
  if (!job) return res.status(404).json({ message: 'Not found or not authorized' });
  res.json({ message: 'Job deleted' });
});

// GET /api/jobs/employer/mine
router.get('/employer/mine', authenticate, authorize('employer'), async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
  res.json({ jobs });
});

module.exports = router;
