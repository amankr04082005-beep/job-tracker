const mongoose = require('mongoose');

const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'];

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    status: { type: String, enum: STATUSES, default: 'Applied' },
    link: { type: String, trim: true },
    appliedDate: { type: Date, default: Date.now },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
module.exports.STATUSES = STATUSES;
