import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Field from '../components/Field.jsx';

// Forgot-password: the user submits their email; this queues a request that an
// admin reviews. On approval an admin emails them a temporary password, which
// they then change from Profile → Change password.
export default function ResetPassword() {
  const { requestReset } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await requestReset(email);
      setMessage(res.message || 'Your request has been sent to the admins.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="auth-wrap glass">
        <h1 style={{ fontSize: 'var(--fs-h2)', textAlign: 'center' }}>Reset password</h1>
        <p className="muted center" style={{ marginTop: 0 }}>
          Enter your registered email. An admin will review your request and email
          you a temporary password.
        </p>

        {message ? (
          <>
            <div className="form-alert form-alert--ok" role="status">
              {message}
            </div>
            <p className="muted center" style={{ fontSize: 'var(--fs-sm)' }}>
              Once you receive the temporary password, log in and change it from
              <strong> Profile → Change password</strong>.
            </p>
            <p className="center">
              <Link className="btn btn--ghost" to="/login">
                Back to log in
              </Link>
            </p>
          </>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="form-alert form-alert--error" role="alert">
                {error}
              </div>
            )}
            <Field
              id="email"
              label="Registered email"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              placeholder="you@smvdu.ac.in"
            />
            <button className="btn btn--block" type="submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Submit request'}
            </button>
            <p className="muted center" style={{ marginTop: 'var(--sp-4)', fontSize: 'var(--fs-sm)' }}>
              Remembered it? <Link to="/login">Back to log in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
