const Navbar = ({ title = 'AI Code Debugger', user, onLogout, theme = 'dark', onToggleTheme }) => {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl theme-surface-strong theme-border">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-bold text-white shadow-lg shadow-sky-950/30 sm:h-11 sm:w-11">
            AI
          </span>
          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300 sm:text-[11px]">
              Smart debugging workspace
            </p>
            <h1 className="m-0 truncate text-lg font-bold text-white sm:text-xl md:text-2xl">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
          >
            {theme === 'dark' ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>

          {user ? (
            <>
              <div className="hidden rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-right md:block">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300">Signed in</p>
                <p className="text-sm font-semibold text-white">{user.name}</p>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
              >
                Sign Out
              </button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Navbar
