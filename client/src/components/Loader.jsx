const Loader = ({ text = 'Loading...', inline = false }) => {
  const Wrapper = inline ? 'span' : 'div'

  return (
    <Wrapper
      className={`flex items-center gap-2 text-sm font-medium text-slate-200 ${inline ? 'inline-flex' : ''}`}
      role="status"
      aria-live="polite"
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400/40 border-t-sky-400" aria-hidden="true" />
      <span>{text}</span>
    </Wrapper>
  )
}

export default Loader
