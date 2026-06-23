import { Link } from 'react-router-dom';

// SMVDU crest + FoundIt wordmark.
export default function Logo({ to = '/', showSub = true }) {
  return (
    <Link to={to} className="brand" aria-label="FoundIt — SMVDU Lost & Found">
      <img src="/smvdu-logo.png" alt="SMVDU" className="brand__logo" />
      <span>
        Found<span className="accent">It</span>
        {showSub && <span className="brand__sub">&nbsp;· SMVDU</span>}
      </span>
    </Link>
  );
}
