import { useState } from 'react';
import { api } from '../lib/api.js';
import Field from './Field.jsx';

// Modal for submitting a claim. If the item has a verifying question, the
// claimant must answer it; the answer is private and only the reporter/admin
// sees it during review.
export default function ClaimModal({ item, onClose, onSubmitted }) {
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api(`/items/${item.id}/claims`, { method: 'POST', body: { answer, message } });
      onSubmitted();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal glass" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontSize: 'var(--fs-h3)', marginBottom: 'var(--sp-2)' }}>
          Claim "{item.title}"
        </h2>
        <p className="muted" style={{ marginTop: 0, fontSize: 'var(--fs-sm)' }}>
          The reporter will review your claim before any handover.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="form-alert form-alert--error" role="alert">
              {error}
            </div>
          )}

          {item.hasVerification ? (
            <Field
              id="answer"
              label={`Verification: ${item.verifyingQuestion}`}
              value={answer}
              onChange={setAnswer}
              placeholder="Your answer (kept private)"
            />
          ) : (
            <div className="info-note" style={{ marginBottom: 'var(--sp-4)' }}>
              This item has no verification question — add a note below to help the
              reporter confirm it's yours.
            </div>
          )}

          <label className="field">
            <span className="field__label">Message (optional)</span>
            <textarea
              className="field__input"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Any details that prove the item is yours…"
            />
          </label>

          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
