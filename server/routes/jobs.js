const express = require('express');
const mongoose = require('mongoose');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();
const { STATUSES } = Job;

router.use(auth); // every job route needs a valid token

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pick = (body) => {
  const { company, role, status, link, appliedDate, notes } = body;
  const data = { company, role, status, link, appliedDate, notes };
  Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
  return data;
};

// GET /api/jobs?status=Interview&search=google
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { status, search } = req.query;
    const filter = { user: req.userId };

    if (status) {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({ message: 'Invalid status filter' });
      }
      filter.status = status;
    }
    if (search) {
      const rx = new RegExp(escapeRegex(String(search)), 'i');
      filter.$or = [{ company: rx }, { role: rx }];
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  })
);

// GET /api/jobs/stats/summary  -> { Applied: 3, Interview: 1, Offer: 0, Rejected: 2, total: 6 }
router.get(
  '/stats/summary',
  asyncHandler(async (req, res) => {
    const rows = await Job.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const stats = Object.fromEntries(STATUSES.map((s) => [s, 0]));
    let total = 0;
    rows.forEach((r) => {
      stats[r._id] = r.count;
      total += r.count;
    });
    res.json({ ...stats, total });
  })
);

// POST /api/jobs
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const job = await Job.create({ ...pick(req.body), user: req.userId });
    res.status(201).json(job);
  })
);

// GET /api/jobs/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const job = await Job.findOne({ _id: req.params.id, user: req.userId });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  })
);

// PUT /api/jobs/:id
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      pick(req.body),
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  })
);

// DELETE /api/jobs/:id
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  })
);

module.exports = router;
