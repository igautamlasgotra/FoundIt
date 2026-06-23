import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Field from '../components/Field.jsx';

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSubmitting(true);
    try {
      await register(form);
      navigate('/home', { replace: true });
    } catch (err) {
      // Surface server-side field validation under each input when available.
      if (Array.isArray(err.details)) {
        const map = {};
        err.details.forEach((d) => {
          if (d.field) map[d.field] = d.message;
        });
        setFieldErrors(map);
      }
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="auth-wrap glass">
        <h1 style={{ fontSize: 'var(--fs-h2)', textAlign: 'center' }}>Create your account</h1>
        <p className="muted center" style={{ marginTop: 0 }}>
          Use your SMVDU email to join.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="form-alert form-alert--error" role="alert">
              {error}
            </div>
          )}
          <Field
            id="name"
            label="Full name"
            value={form.name}
            onChange={set('name')}
            error={fieldErrors.name}
            autoComplete="name"
          />
          <Field
            id="email"
            label="SMVDU email"
            type="email"
            value={form.email}
            onChange={set('email')}
            error={fieldErrors.email}
            autoComplete="email"
            placeholder="you@smvdu.ac.in"
          />
          <Field
            id="phone"
            label="Mobile number (+91)"
            type="tel"
            value={form.phone}
            onChange={(v) => set('phone')(v.replace(/\D/g, '').slice(0, 10))}
            error={fieldErrors.phone}
            autoComplete="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit number"
          />
          <Field
            id="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={set('password')}
            error={fieldErrors.password}
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
          <button className="btn btn--block" type="submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="muted center" style={{ marginTop: 'var(--sp-6)', fontSize: 'var(--fs-sm)' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
