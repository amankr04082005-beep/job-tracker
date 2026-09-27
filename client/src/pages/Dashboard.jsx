import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import JobForm from '../components/JobForm';
import JobRow from '../components/JobRow';
import PipelineStrip from '../components/PipelineStrip';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Wait 300ms after the user stops typing before calling the API.
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  const load = useCallback(async () => {
    try {
      const [jobList, summary] = await Promise.all([
        api.getJobs({ status: statusFilter, search: debouncedSearch }),
        api.getStats(),
      ]);
      setJobs(jobList);
      setStats(summary);
      setError('');
    } catch (err) {
      if (err.status === 401) return logout();
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearch, logout]);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setEditingJob(null);
    setFormOpen(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingJob(null);
  };

  const handleSave = async (data) => {
    if (editingJob) await api.updateJob(editingJob._id, data);
    else await api.createJob(data);
    closeForm();
    await load();
  };

  const handleStatusChange = async (job, status) => {
    try {
      await api.updateJob(job._id, { status });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (job) => {
    if (!window.confirm(`Delete ${job.role} at ${job.company}?`)) return;
    try {
      await api.deleteJob(job._id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const filtered = Boolean(statusFilter || debouncedSearch);

  return (
    <div className="app">
      <header className="topbar">
        <p className="brand">Job Tracker</p>
        <div className="topbar-user">
          <span>{user?.name}</span>
          <button className="text-button" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <main className="content">
        <PipelineStrip stats={stats} active={statusFilter} onSelect={setStatusFilter} />

        <div className="toolbar">
          <input
            className="search"
            type="search"
            placeholder="Search company or role"
            aria-label="Search company or role"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={openAdd}>
            Add job
          </button>
        </div>

        {formOpen && (
          <JobForm key={editingJob?._id || 'new'} job={editingJob} onSave={handleSave} onCancel={closeForm} />
        )}

        {error && <p className="error" role="alert">{error}</p>}

        {loading ? (
          <p className="muted">Loading your jobs</p>
        ) : jobs.length === 0 ? (
          <div className="empty">
            <p>{filtered ? 'No jobs match this filter.' : 'No applications yet.'}</p>
            {!filtered && (
              <button className="btn btn-primary" onClick={openAdd}>
                Add your first job
              </button>
            )}
          </div>
        ) : (
          <ul className="job-list">
            {jobs.map((job) => (
              <JobRow
                key={job._id}
                job={job}
                onStatusChange={handleStatusChange}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
