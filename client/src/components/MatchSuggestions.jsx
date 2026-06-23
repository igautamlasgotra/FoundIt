import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { formatDate, locationLabel, typeLabel } from '../lib/display.js';
import { SparklesIcon, MapPinIcon, BoxIcon } from './Icons.jsx';

// Shows AI-suggested matches for an item: the opposite-type report(s), each with
// a confidence meter and a human-readable reason.
export default function MatchSuggestions({ itemId }) {
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    let active = true;
    api(`/items/${itemId}/matches`)
      .then((res) => active && setMatches(res.matches))
      .catch(() => active && setMatches([]));
    return () => {
      active = false;
    };
  }, [itemId]);

  if (!matches || matches.length === 0) return null;

  return (
    <section style={{ marginTop: 'var(--sp-8)' }}>
      <h2 style={{ fontSize: 'var(--fs-h3)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span className="iconbox" style={{ width: '2rem', height: '2rem' }}>
          <SparklesIcon size={16} />
        </span>
        Possible {matches.length === 1 ? 'match' : 'matches'}
      </h2>
      <p className="muted" style={{ marginTop: 0, fontSize: 'var(--fs-sm)' }}>
        Suggested by FoundIt's AI matching engine. Open one to review and contact the person.
      </p>

      <div className="match-list">
        {matches.map((m) => (
          <Link key={m.matchId} to={`/items/${m.item.id}`} className="match-card glass">
            <div className="match-card__media" aria-hidden="true">
              {m.item.photoUrl ? (
                <img src={m.item.photoUrl} alt={m.item.title} loading="lazy" />
              ) : (
                <BoxIcon size={28} />
              )}
            </div>
            <div className="match-card__body">
              <div className="match-card__top">
                <strong>{m.item.title}</strong>
                <span className={`badge ${m.item.type === 'lost' ? 'badge--lost' : 'badge--found'}`}>
                  {typeLabel(m.item.type)}
                </span>
              </div>
              <p className="item-card__meta muted" style={{ margin: '2px 0' }}>
                <MapPinIcon size={13} /> {locationLabel(m.item)} · {formatDate(m.item.dateLostOrFound)}
              </p>

              <div className="confidence" title={`${m.score}% confidence`}>
                <div className="confidence__bar">
                  <span style={{ width: `${m.score}%` }} data-level={m.score >= 80 ? 'high' : m.score >= 60 ? 'mid' : 'low'} />
                </div>
                <span className="confidence__pct">{m.score}%</span>
              </div>

              <p className="match-card__reason">“{m.reason}”</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
