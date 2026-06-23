// Accessible labelled input. Associates the label, marks invalid state for
// screen readers (aria-invalid + aria-describedby), and shows an error message.
export default function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  autoComplete,
  required = true,
  ...rest
}) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <label className="field" htmlFor={id}>
      <span className="field__label">{label}</span>
      <input
        id={id}
        className="field__input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={errorId}
        {...rest}
      />
      {error && (
        <span className="field__error" id={errorId} role="alert">
          {error}
        </span>
      )}
    </label>
  );
}
