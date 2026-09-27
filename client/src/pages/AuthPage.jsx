import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = isRegister
        ? await api.register(form)
        : await api.login({ email: form.email, password: form.password });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth">
      <section className="auth-intro">
        <p className="brand">Job Tracker</p>
        <h1>Know where every application stands.</h1>
        <div className="auth-strip" aria-hidden="true">
          <span className="seg-applied" style={{ flexGrow: 5 }} />
          <span className="seg-interview" style={{ flexGrow: 3 }} />
          <span className="seg-offer" style={{ flexGrow: 1 }} />
          <span className="seg-rejected" style={{ flexGrow: 2 }} />
        </div>
      </section>

      <section className="auth-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>{isRegister ? 'Create your account' : 'Log in'}</h2>

          {isRegister && (
            <label className="field">
              Name
              <input value={form.name} onChange={update('name')} autoComplete="name" required />
            </label>
          )}

          <label className="field">
            Email
            <input type="email" value={form.email} onChange={update('email')} autoComplete="email" required />
          </label>

          <label className="field">
            Password
            <input
              type="password"
              value={form.password}
              onChange={update('password')}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              minLength={6}
              required
            />
            {isRegister && <span className="hint">At least 6 characters.</span>}
          </label>

          {error && <p className="error" role="alert">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Please wait' : isRegister ? 'Create account' : 'Log in'}
          </button>

          <p className="switch">
            {isRegister ? 'Already have an account?' : 'New here?'}{' '}
            <Link to={isRegister ? '/login' : '/register'}>
              {isRegister ? 'Log in' : 'Create an account'}
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
