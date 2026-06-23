// Clean line-icon set (Lucide-style), inline SVG so the bundle stays lean and
// works offline. All inherit `currentColor`. No emoji anywhere in the app.

const S = ({ size = 20, children, ...p }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    {children}
  </svg>
);

export const SearchIcon = (p) => (
  <S {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </S>
);
export const PlusIcon = (p) => (
  <S {...p}>
    <path d="M12 5v14M5 12h14" />
  </S>
);
export const BellIcon = (p) => (
  <S {...p}>
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </S>
);
export const ArrowRightIcon = (p) => (
  <S {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </S>
);
export const CheckIcon = (p) => (
  <S {...p}>
    <path d="M20 6 9 17l-5-5" />
  </S>
);
export const CheckCircleIcon = (p) => (
  <S {...p}>
    <path d="M22 11.1V12a10 10 0 1 1-5.9-9.1" />
    <path d="m9 11 3 3L22 4" />
  </S>
);
export const ShieldCheckIcon = (p) => (
  <S {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </S>
);
export const LockIcon = (p) => (
  <S {...p}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </S>
);
export const MapPinIcon = (p) => (
  <S {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </S>
);
export const CalendarIcon = (p) => (
  <S {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </S>
);
export const TagIcon = (p) => (
  <S {...p}>
    <path d="M3 11V5a2 2 0 0 1 2-2h6l9 9-8 8-9-9Z" />
    <circle cx="7.5" cy="7.5" r="1.2" />
  </S>
);
export const SunIcon = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </S>
);
export const MoonIcon = (p) => (
  <S {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
  </S>
);
export const MenuIcon = (p) => (
  <S {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </S>
);
export const XIcon = (p) => (
  <S {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </S>
);
export const UserIcon = (p) => (
  <S {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </S>
);
export const UsersIcon = (p) => (
  <S {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 21a6.5 6.5 0 0 1 13 0" />
    <path d="M16 5.2a3.5 3.5 0 0 1 0 6.6M18 21a6.5 6.5 0 0 0-3-5.5" />
  </S>
);
export const CpuIcon = (p) => (
  <S {...p}>
    <rect x="7" y="7" width="10" height="10" rx="2" />
    <path d="M9.5 2v3M14.5 2v3M9.5 19v3M14.5 19v3M2 9.5h3M2 14.5h3M19 9.5h3M19 14.5h3" />
  </S>
);
export const SparklesIcon = (p) => (
  <S {...p}>
    <path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z" />
    <path d="M19 14l.8 2 2 .8-2 .8L19 20l-.8-2-2-.8 2-.8.8-2Z" />
  </S>
);
export const ZapIcon = (p) => (
  <S {...p}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
  </S>
);
export const BoxIcon = (p) => (
  <S {...p}>
    <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
    <path d="M3 8l9 5 9-5M12 13v8" />
  </S>
);
export const ImageIcon = (p) => (
  <S {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 16-5-5L5 21" />
  </S>
);
export const MailIcon = (p) => (
  <S {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </S>
);
export const ClipboardCheckIcon = (p) => (
  <S {...p}>
    <rect x="8" y="3" width="8" height="4" rx="1" />
    <path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3" />
    <path d="m9 14 2 2 4-4" />
  </S>
);
export const HandHeartIcon = (p) => (
  <S {...p}>
    <path d="M11 13.5 8.5 11a1.8 1.8 0 0 1 2.5-2.6l.5.5.5-.5A1.8 1.8 0 0 1 14.5 11L12 13.5a.7.7 0 0 1-1 0Z" />
    <path d="M2 16l4-1 5 2 4-1.5a1.5 1.5 0 0 1 1.2 2.6L13 21l-7-1-4 1" />
  </S>
);
export const FileTextIcon = (p) => (
  <S {...p}>
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <path d="M5 3h9l6 6v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    <path d="M8 13h8M8 17h6" />
  </S>
);
export const TrendingUpIcon = (p) => (
  <S {...p}>
    <path d="M3 17l6-6 4 4 7-7" />
    <path d="M17 8h4v4" />
  </S>
);
export const PhoneIcon = (p) => (
  <S {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L20 13l2 5v3a1 1 0 0 1-1 1A17 17 0 0 1 4 5a1 1 0 0 1 1-1Z" />
  </S>
);

export function WhatsAppIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.25.7-1.45 1.34-2 1.4-.5.06-1.16.09-1.87-.12-.43-.13-.98-.32-1.69-.62-2.97-1.28-4.9-4.27-5.05-4.47-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37l.57.01c.18 0 .43-.07.67.51.25.6.84 2.06.91 2.2.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.6.17.3.77 1.27 1.65 2.05 1.14 1.02 2.1 1.33 2.4 1.48.3.15.47.13.64-.08.17-.2.74-.86.94-1.16.2-.3.4-.25.66-.15.27.1 1.7.8 2 .95.3.15.5.22.57.34.07.13.07.73-.18 1.43Z" />
    </svg>
  );
}
