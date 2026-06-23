import { statusMeta, typeLabel } from '../lib/display.js';
import { TagIcon } from './Icons.jsx';

export function StatusBadge({ status }) {
  const { label, cls } = statusMeta(status);
  return <span className={`badge ${cls}`}>{label}</span>;
}

export function TypeBadge({ type }) {
  return (
    <span className={`badge ${type === 'lost' ? 'badge--lost' : 'badge--found'}`}>
      {typeLabel(type)}
    </span>
  );
}

export function CategoryChip({ category }) {
  return (
    <span className="chip">
      <TagIcon size={13} /> {category}
    </span>
  );
}
