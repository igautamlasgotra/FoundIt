import { Link } from 'react-router-dom';
import { StatusBadge, TypeBadge, CategoryChip } from './Badge.jsx';
import { formatDate, locationLabel, categoryLabel } from '../lib/display.js';
import { BoxIcon, MapPinIcon } from './Icons.jsx';

// Browse-grid card: photo (or icon placeholder), title, chips, meta.
export default function ItemCard({ item }) {
  return (
    <Link to={`/items/${item.id}`} className="item-card glass" aria-label={item.title}>
      <div className="item-card__media">
        {item.photoUrl ? (
          <img src={item.photoUrl} alt={item.title} loading="lazy" />
        ) : (
          <div className="item-card__placeholder">
            <BoxIcon size={40} />
          </div>
        )}
        <div className="item-card__type">
          <TypeBadge type={item.type} />
        </div>
      </div>

      <div className="item-card__body">
        <div className="item-card__row">
          <CategoryChip category={categoryLabel(item)} />
          <StatusBadge status={item.status} />
        </div>
        <h3 className="item-card__title">{item.title}</h3>
        <p className="item-card__meta muted">
          <MapPinIcon size={14} /> {locationLabel(item)} · {formatDate(item.dateLostOrFound)}
        </p>
      </div>
    </Link>
  );
}
