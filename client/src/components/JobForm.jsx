import { useState } from 'react';
import { STATUSES } from '../constants';

const today = () => new Date().toISOString().slice(0, 10);

export default function JobForm({ job, onSave, onCancel }) {
  const [form, setForm] = useState({
    company: job?.company || '',
    role: job?.role || '',
    status: job?.status || 'Applied',
    link: job?.link || '',
    appliedDate: job?.appliedDate ? job.appliedDate.slice(0, 10) : today(),
    notes: job?.notes || '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.appliedDate) delete payload.appliedDate;
      await onSave(payload);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form className="job-form" onSubmit={handleSubmit}>
      <h2>{job ? 'Edit job' : 'Add a job'}</h2>

      <div className="form-grid">
        <label className="field">
          Company
          <input value={form.company} onChange={update('company')} required autoFocus />
        </label>
        <label className="field">
          Role
          <input value={form.role} onChange={update('role')} required />
        </label>
        <label className="field">
          Status
          <select value={form.status} onChange={update('status')}>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Applied on
          <input type="date" value={form.appliedDate} onChange={update('appliedDate')} />
        </label>
        <label className="field field-wide">
          Job posting link
          <input type="url" value={form.link} onChange={update('link')} placeholder="https://" />
        </label>
        <label className="field field-wide">
          Notes
          <textarea rows="3" value={form.notes} onChange={update('notes')} />
        </label>
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving' : job ? 'Save changes' : 'Add job'}
        </button>
        <button className="btn btn-ghost" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
