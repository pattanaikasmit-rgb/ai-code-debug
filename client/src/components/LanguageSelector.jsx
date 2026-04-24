const LanguageSelector = ({
  label = 'Language',
  value,
  onChange,
  options = [],
  name = 'language',
}) => {
  return (
    <div className="max-w-xs space-y-2">
      <label htmlFor={name} className="text-sm font-semibold text-slate-200">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 theme-surface theme-border theme-text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSelector
