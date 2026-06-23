import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Field from '../components/Field.jsx';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  return (
    <div className="app-shell">
      <div className="profile-grid">
        <ProfileDetails user={user} updateProfile={updateProfile} />
        <ChangePassword />
      </div>
    </div>
  );
}

function ProfileDetails({ user, updateProfile }) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSaved(false);
    setSaving(true);
    try {
      await updateProfile({ name, phone });
      setSaved(true);
    } catch (err) {
      if (Array.isArray(err.details)) {
        const map = {};
        err.details.forEach((d) => d.field && (map[d.field] = d.message));
        setFieldErrors(map);
      }
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-card glass">
      <h1 style={{ fontSize: 'var(--fs-h3)' }}>Your profile</h1>
      <p className="muted" style={{ marginTop: 0 }}>
        Your mobile number lets people contact you about matched items.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="form-alert form-alert--error" role="alert">
            {error}
          </div>
        )}
        {saved && (
          <div className="form-alert form-alert--ok" role="status">
            Profile updated ✓
          </div>
        )}

        <div className="field">
          <span className="field__label">Email</span>
          <input className="field__input" value={user.email} disabled />
        </div>

        <Field id="name" label="Full name" value={name} onChange={setName} error={fieldErrors.name} />
        <Field
          id="phone"
          label="Mobile number (+91)"
          type="tel"
          value={phone}
          onChange={(v) => setPhone(v.replace(/\D/g, '').slice(0, 10))}
          error={fieldErrors.phone}
          autoComplete="tel"
          inputMode="numeric"
          maxLength={10}
          placeholder="10-digit number"
        />

        <button className="btn btn--block" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}

function ChangePassword() {
  const { changePassword } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setDone(false);

    if (form.newPassword.length < 8) {
      return setFieldErrors({ newPassword: 'New password must be at least 8 characters' });
    }
    if (form.newPassword !== form.confirm) {
      return setFieldErrors({ confirm: 'Passwords do not match' });
    }

    setSaving(true);
    try {
      await changePassword(form.currentPassword, form.newPassword);
      setDone(true);
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-card glass">
      <h2 style={{ fontSize: 'var(--fs-h3)' }}>Change password</h2>
      <p className="muted" style={{ marginTop: 0 }}>
        Enter your current password, then your new one.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="form-alert form-alert--error" role="alert">
            {error}
          </div>
        )}
        {done && (
          <div className="form-alert form-alert--ok" role="status">
            Password changed ✓
          </div>
        )}
        <Field
          id="currentPassword"
          label="Current password"
          type="password"
          value={form.currentPassword}
          onChange={set('currentPassword')}
          autoComplete="current-password"
        />
        <Field
          id="newPassword"
          label="New password"
          type="password"
          value={form.newPassword}
          onChange={set('newPassword')}
          error={fieldErrors.newPassword}
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />
        <Field
          id="confirm"
          label="Confirm new password"
          type="password"
          value={form.confirm}
          onChange={set('confirm')}
          error={fieldErrors.confirm}
          autoComplete="new-password"
        />
        <button className="btn btn--block" type="submit" disabled={saving}>
          {saving ? 'Changing…' : 'Change password'}
        </button>
      </form>
    </div>
  );
}
