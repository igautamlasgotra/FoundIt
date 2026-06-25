// Presentation helpers shared across item components.

export const STATUS_META = {
  open: { label: 'Open', cls: 'badge--open' },
  potential_match: { label: 'Potential match', cls: 'badge--match' },
  claim_pending: { label: 'Claim pending', cls: 'badge--pending' },
  claim_approved: { label: 'Claim approved', cls: 'badge--pending' },
  collected: { label: 'Collected', cls: 'badge--closed' },
  closed: { label: 'Closed', cls: 'badge--closed' },
  expired: { label: 'Expired', cls: 'badge--closed' },
  removed: { label: 'Removed', cls: 'badge--removed' },
};

export const statusMeta = (s) => STATUS_META[s] || { label: s, cls: 'badge--closed' };

export const typeLabel = (t) => (t === 'lost' ? 'Lost' : 'Found');

export function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

// Display label for an item's location — uses the custom text for "Other".
export function locationLabel(item) {
  if (item.location === 'Other' && item.locationOther) return item.locationOther;
  return item.location;
}

// Display label for an item's category — uses the custom text for "Other".
export function categoryLabel(item) {
  if (item.category === 'Other' && item.categoryOther) return item.categoryOther;
  return item.category;
}

// Reduce any stored phone to its 10 significant digits.
function tenDigits(phone) {
  const d = String(phone || '').replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('91')) return d.slice(2);
  return d.slice(-10);
}

// Pretty display, e.g. "+91 98765 43210".
export function formatPhone(phone) {
  const t = tenDigits(phone);
  if (t.length !== 10) return phone || '';
  return `+91 ${t.slice(0, 5)} ${t.slice(5)}`;
}

// Build tel: and WhatsApp links. +91 is the standard country code; an optional
// message is prefilled into the WhatsApp chat so the conversation starts with
// the item's details already in context.
export function phoneLinks(phone, message) {
  const t = tenDigits(phone);
  if (t.length !== 10) return null;
  const intl = `91${t}`;
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return { tel: `tel:+${intl}`, whatsapp: `https://wa.me/${intl}${query}` };
}

// Prebuilt WhatsApp message carrying the item's details + link.
export function whatsappMessage(item, reporterName) {
  const kind = item.type === 'lost' ? 'LOST' : 'FOUND';
  return [
    `Hi ${reporterName || ''}`.trim() + ',',
    `I'm reaching out via FoundIt (SMVDU) about your ${kind} item:`,
    '',
    `📦 ${item.title}`,
    `🏷️ ${item.category}`,
    `📍 ${locationLabel(item)}`,
    `📅 ${formatDate(item.dateLostOrFound)}`,
    '',
    typeof window !== 'undefined' ? window.location.href : '',
  ].join('\n');
}
