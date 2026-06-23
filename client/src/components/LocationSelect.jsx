import { useConfig } from '../context/ConfigContext.jsx';

// Location dropdown with optgroups (Boys Hostels, Academic Blocks, etc.).
// Falls back to a flat list if grouped config isn't available.
export default function LocationSelect({ value, onChange, includeAll = false, ...rest }) {
  const config = useConfig();
  const groups = config?.locationGroups;

  return (
    <select
      className="field__input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    >
      {includeAll ? (
        <option value="">All locations</option>
      ) : (
        <option value="">Select a location</option>
      )}
      {groups
        ? groups.map((g) => (
            <optgroup key={g.label} label={g.label}>
              {g.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </optgroup>
          ))
        : config?.locations?.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
    </select>
  );
}
