import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Field from '../components/Field.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/home';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="auth-wrap glass">
        <h1 style={{ fontSize: 'var(--fs-h2)', textAlign: 'center' }}>Welcome back</h1>
        <p className="muted center" style={{ marginTop: 0 }}>
          Log in to your FoundIt account.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="form-alert form-alert--error" role="alert">
              {error}
            </div>
          )}
          <Field
            id="email"
            label="SMVDU email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            placeholder="you@smvdu.ac.in"
          />
          <Field
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />
          <button className="btn btn--block" type="submit" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="center" style={{ marginTop: 'var(--sp-4)', fontSize: 'var(--fs-sm)' }}>
          <Link to="/reset">Forgot your password?</Link>
        </p>
        <p className="muted center" style={{ marginTop: 'var(--sp-2)', fontSize: 'var(--fs-sm)' }}>
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
