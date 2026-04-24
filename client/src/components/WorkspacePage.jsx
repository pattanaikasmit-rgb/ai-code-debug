import ChatAssistant from './ChatAssistant'
import CodeEditor from './CodeEditor'
import LanguageSelector from './LanguageSelector'
import Loader from './Loader'
import Navbar from './Navbar'
import OutputPanel from './OutputPanel'

const languageOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'swift', label: 'Swift' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
]

const getFirstName = (name) => {
  if (!name || typeof name !== 'string') {
    return 'Developer'
  }

  const first = name.trim().split(/\s+/)[0]
  return first || 'Developer'
}

const WorkspacePage = ({
  apiStatus,
  authUser,
  code,
  language,
  loading,
  result,
  error,
  chatMessages,
  chatQuestion,
  chatLoading,
  chatError,
  theme,
  onToggleTheme,
  onLanguageChange,
  onCodeChange,
  onClearCode,
  onDebugSubmit,
  onQuestionChange,
  onChatSubmit,
  onLogout,
}) => (
  <div className="min-h-screen theme-text">
    <Navbar title="AI Code Debugger" user={authUser} onLogout={onLogout} theme={theme} onToggleTheme={onToggleTheme} />

    <main className="mx-auto grid max-w-7xl gap-4 px-3 py-4 sm:gap-5 sm:px-4 md:px-6 lg:gap-6 lg:py-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <section className="rounded-3xl border bg-slate-900/70 p-3 shadow-2xl shadow-slate-950/40 backdrop-blur sm:p-4 md:p-6 theme-surface theme-border">
        <div className="mb-5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-300 sm:text-xs">
            AI-powered debugging workspace
          </p>
          <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">Debug Your Code</h2>
          <p className="max-w-2xl text-sm text-slate-300 md:text-base">
            Paste code, pick a language, and get a clear AI explanation with fixes and corrected code.
          </p>
        </div>

        <div
          className={`mb-5 inline-flex rounded-full border px-4 py-2 text-sm font-medium ${
            apiStatus.tone === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : apiStatus.tone === 'warning'
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                : 'border-sky-500/30 bg-sky-500/10 text-sky-200'
          }`}
        >
          {apiStatus.text}
        </div>

        <form className="space-y-4" onSubmit={onDebugSubmit}>
          <LanguageSelector value={language} onChange={onLanguageChange} options={languageOptions} />

          <CodeEditor
            value={code}
            onChange={onCodeChange}
            language={language}
            placeholder="Paste your code here for analysis..."
          />

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid gap-2 sm:grid-cols-2 lg:flex">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-900/30 transition hover:from-sky-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-75 sm:min-w-36"
                disabled={loading || !code.trim()}
              >
                {loading ? <Loader text="Analyzing..." inline /> : '✨ Debug Code'}
              </button>

              <button
                type="button"
                onClick={onClearCode}
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900 sm:min-w-36"
                disabled={loading && !code}
              >
                🧹 Clear Code
              </button>
            </div>

          </div>
        </form>
      </section>

      <div className="self-start space-y-4 sm:space-y-5 lg:space-y-6 xl:sticky xl:top-24">
        <OutputPanel result={result} error={error} isLoading={loading} />
        <section className="rounded-3xl border border-emerald-500/20 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur md:p-5 theme-surface theme-border">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">Session ready</p>
          <h3 className="mt-2 text-lg font-bold text-white">Welcome, {getFirstName(authUser?.name)} 👋</h3>
          <p className="mt-2 text-sm text-slate-300">
            You are now inside the protected workspace. Start debugging code or chat with the assistant on the right.
          </p>
        </section>
        <ChatAssistant
          messages={chatMessages}
          question={chatQuestion}
          onQuestionChange={onQuestionChange}
          onSubmit={onChatSubmit}
          isLoading={chatLoading}
          error={chatError}
          isAuthenticated
        />
      </div>
    </main>
  </div>
)

export default WorkspacePage