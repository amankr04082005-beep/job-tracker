import { STATUSES } from '../constants';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// Only allow http/https links so a saved "javascript:..." value can never run.
const isSafeUrl = (url) => /^https?:\/\//i.test(url || '');

export default function JobRow({ job, onStatusChange, onEdit, onDelete }) {
  return (
    <li className="job-row">
      <div className="job-main">
        <h3>{job.company}</h3>
        <p className="job-role">{job.role}</p>
        <p className="job-meta">
          <span>Applied {formatDate(job.appliedDate)}</span>
          {isSafeUrl(job.link) && (
            <a href={job.link} target="_blank" rel="noreferrer">
              Job posting
            </a>
          )}
        </p>
        {job.notes && <p className="job-notes">{job.notes}</p>}
      </div>

      <div className="job-actions">
        <select
          className="status-select"
          data-status={job.status}
          value={job.status}
          aria-label={`Status for ${job.company}`}
          onChange={(e) => onStatusChange(job, e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button className="text-button" onClick={() => onEdit(job)}>
          Edit
        </button>
        <button className="text-button danger" onClick={() => onDelete(job)}>
          Delete
        </button>
      </div>
    </li>
  );
}
