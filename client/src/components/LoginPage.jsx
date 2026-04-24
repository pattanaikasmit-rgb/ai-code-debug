import AuthPanel from './AuthPanel'
import Navbar from './Navbar'

const LoginPage = ({
  apiStatus,
  authMode,
  authForm,
  authLoading,
  authError,
  onModeChange,
  onFormChange,
  onSubmit,
  onForgotPassword,
  theme,
  onToggleTheme,
}) => (
  <div className="min-h-screen bg-[var(--body-bg)] theme-text">
    <Navbar title="AI Code Debugger" theme={theme} onToggleTheme={onToggleTheme} />

    <main className="mx-auto grid max-w-6xl gap-5 px-3 py-4 sm:gap-6 sm:px-4 md:px-6 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] lg:items-center lg:py-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/75 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur md:p-6 lg:p-8 theme-surface theme-border">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-indigo-500/10" aria-hidden="true" />

        <div className="relative">
          <div className="inline-flex rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200 sm:text-xs">
            Separate secure login
          </div>

          <h2 className="mb-3 mt-4 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            Sign in once and go straight to your{' '}
            <span className="bg-gradient-to-r from-sky-300 to-indigo-300 bg-clip-text text-transparent">
              AI debugging dashboard
            </span>
            .
          </h2>

          <p className="max-w-2xl text-sm text-slate-300 md:text-base">
            The login screen is now fully separated from the workspace, so users authenticate first and are then redirected directly into the protected debugger.
          </p>

          <div
            className={`mt-5 inline-flex rounded-full border px-4 py-2 text-sm font-medium ${
              apiStatus.tone === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : apiStatus.tone === 'warning'
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                  : 'border-sky-500/30 bg-sky-500/10 text-sky-200'
            }`}
          >
            {apiStatus.text}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm font-semibold text-white">What happens next?</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-300">
              <li>• Login or create your account.</li>
              <li>• Get redirected to the protected workspace automatically.</li>
              <li>• Start debugging code and chatting with the assistant securely.</li>
            </ul>
          </div>
        </div>
      </section>

      <AuthPanel
        mode={authMode}
        onModeChange={onModeChange}
        form={authForm}
        onFormChange={onFormChange}
        onSubmit={onSubmit}
        onForgotPassword={onForgotPassword}
        loading={authLoading}
        error={authError}
      />
    </main>
  </div>
)

export default LoginPage