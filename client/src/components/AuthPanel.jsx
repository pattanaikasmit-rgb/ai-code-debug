import { useState } from 'react'

const inputClassName =
  'w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 pr-14 text-sm text-slate-100 theme-surface theme-border theme-text transition placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30'

const helperCards = [
  {
    title: 'Protected workspace',
    text: 'Only signed-in users can access the debugger and chat tools.',
  },
  {
    title: 'Fast AI support',
    text: 'Get instant explanations, fixes, and cleaner code suggestions.',
  },
]

const AuthPanel = ({
  mode,
  onModeChange,
  form,
  onFormChange,
  onSubmit,
  onForgotPassword,
  loading,
  error,
  user,
  onLogout,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [forgotMessage, setForgotMessage] = useState('')

  const handleForgotPasswordClick = async () => {
    setForgotMessage('')

    if (!form.email?.trim()) {
      setForgotMessage('Please enter your email in the email field to reset your password.')
      return
    }

    if (typeof onForgotPassword !== 'function') {
      setForgotMessage('Forgot password feature is unavailable. Please contact support.')
      return
    }

    try {
      await onForgotPassword(form.email)
      setForgotMessage('If an account exists with that email, password reset instructions were sent.')
    } catch (err) {
      setForgotMessage(err?.message || 'Could not send reset instructions. Try again later.')
    }
  }

  if (user) {
    return (
      <section className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur md:p-6 theme-surface theme-border">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">Secure session</p>
        <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">Welcome back, {user.name || 'Developer'}</h2>
        <p className="break-words text-sm text-slate-300">
          You are signed in as <span className="font-medium text-slate-100">{user.email}</span>.
        </p>

        <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          Your debug and chat requests are now protected with JWT authentication.
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="mt-4 inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
        >
          Sign Out
        </button>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/75 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur md:p-6 theme-surface theme-border">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-sky-500/8" aria-hidden="true" />

      <div className="relative">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Authentication</p>
            <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">{mode === 'signup' ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-sm text-slate-300">
              Use JWT authentication to protect your debugging workspace and save your sessions securely.
            </p>
          </div>

          <span className="self-start rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-200">
            {mode === 'signup' ? 'New account' : 'Secure login'}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-1">
          <button
            type="button"
            onClick={() => onModeChange('login')}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              mode === 'login' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-900/30' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => onModeChange('signup')}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              mode === 'signup' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-900/30' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          {mode === 'signup' ? (
            <div className="space-y-2">
              <label htmlFor="auth-name" className="text-sm font-semibold text-slate-200">Name</label>
              <input
                id="auth-name"
                name="name"
                type="text"
                value={form.name}
                onChange={onFormChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 theme-surface theme-border theme-text transition placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                placeholder="Enter your name"
                autoComplete="name"
                required
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <label htmlFor="auth-email" className="text-sm font-semibold text-slate-200">Email</label>
            <input
              id="auth-email"
              name="email"
              type="email"
              value={form.email}
              onChange={onFormChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 theme-surface theme-border theme-text transition placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="auth-password" className="text-sm font-semibold text-slate-200">Password</label>
            <div className="relative">
              <input
                id="auth-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={onFormChange}
                className={inputClassName}
                placeholder="At least 8 characters"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-cyan-300 transition hover:text-cyan-200"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-xs text-slate-500">Use at least 8 characters for better security.</p>
            {mode === 'login' ? (
              <div className="mt-2 flex justify-end text-right">
                <button
                  type="button"
                  onClick={handleForgotPasswordClick}
                  className="text-xs font-semibold text-cyan-300 transition hover:text-cyan-200"
                >
                  Forgot password?
                </button>
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
              {error}
            </div>
          ) : null}
          {forgotMessage ? (
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">
              {forgotMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-900/30 transition hover:from-cyan-400 hover:to-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Login to Continue'}
          </button>

          <p className="text-center text-xs text-slate-400">
            {mode === 'signup' ? 'Already have an account?' : 'New here?'}{' '}
            <button
              type="button"
              onClick={() => onModeChange(mode === 'signup' ? 'login' : 'signup')}
              className="font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              {mode === 'signup' ? 'Switch to login' : 'Create one now'}
            </button>
          </p>
        </form>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {helperCards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3 theme-surface theme-border">
              <p className="text-sm font-semibold text-white">{card.title}</p>
              <p className="mt-1 text-xs text-slate-400">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AuthPanel
