import Loader from './Loader'

const ChatAssistant = ({
  messages,
  question,
  onQuestionChange,
  onSubmit,
  isLoading,
  error,
  isAuthenticated,
}) => {
  return (
    <section className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur md:p-6 theme-surface theme-border">
      <div className="mb-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
          Chat assistant
        </p>
        <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">Ask AI About Your Code</h2>
        <p className="text-sm text-slate-300">
          Ask follow-up questions just like ChatGPT and keep the conversation history in one place.
        </p>
      </div>

      <div className="mb-4 flex max-h-[360px] min-h-[220px] flex-col gap-3 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/70 p-3 sm:max-h-[420px] sm:min-h-[280px] theme-surface theme-border">
        {messages.map((message, index) => {
          const isUser = message.role === 'user'

          return (
            <div key={`${message.role}-${index}`} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[94%] break-words rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[90%] ${
                  isUser
                    ? 'bg-sky-500 text-white'
                    : 'border border-slate-700 bg-slate-900 text-slate-100 dark:text-slate-100'
                }`}
              >
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-80">
                  {isUser ? 'You' : 'AI Assistant'}
                </div>
                <p className="m-0 whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          )
        })}

        {isLoading ? (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 dark:text-slate-100">
              <Loader text="Thinking..." />
            </div>
          </div>
        ) : null}
      </div>

      {!isAuthenticated ? (
        <div className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100 dark:text-amber-100">
          Sign in to send protected chat requests to the backend.
        </div>
      ) : null}

      {error ? (
        <div className="mb-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100 dark:text-rose-100">
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-3">
        <label htmlFor="chat-question" className="text-sm font-semibold text-slate-200 dark:text-slate-200">
          Ask a question
        </label>
        <textarea
          id="chat-question"
          value={question}
          onChange={(event) => onQuestionChange(event.target.value)}
          placeholder="Why is this code failing? Can you explain the fix in simple terms?"
          rows={3}
          disabled={!isAuthenticated}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 transition placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">The current code from the editor is sent with your question.</p>
          <button
            type="submit"
            disabled={isLoading || !question.trim() || !isAuthenticated}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-cyan-400 hover:to-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default ChatAssistant
