import { useState } from 'react'
import Loader from './Loader'

const highlightedSections = {
  code: 'border-sky-500/30 bg-sky-500/10',
  output: 'border-emerald-500/30 bg-emerald-500/10',
}

const sectionIcons = {
  code: '💡',
  output: '📤',
}

const OutputPanel = ({ result, error, isLoading }) => {
  const [copyState, setCopyState] = useState('idle')
  const analysis = result?.analysis
  const correctedCode = analysis?.correctedCode || result?.raw || 'No corrected code returned yet.'
  const output = analysis?.output || 'No output provided.'
  const detectedErrors = Array.isArray(analysis?.errors) ? analysis.errors.filter(Boolean) : []
  const hasDetectedIssues = detectedErrors.length > 0
  const showResult = Boolean(result)

  const copyOutput = async () => {
    if (!result) return

    const outputText = [
      `Model: ${result.model || 'OpenRouter'}`,
      '',
      'Corrected Code:',
      correctedCode,
      '',
      'Code Output:',
      output,
    ].join('\n')

    try {
      await navigator.clipboard.writeText(outputText)
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 1800)
    } catch {
      setCopyState('failed')
      window.setTimeout(() => setCopyState('idle'), 1800)
    }
  }

  return (
    <section className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur md:p-6 theme-surface theme-border">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300">
            AI analysis output
          </p>
          <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">Output Panel</h2>
          <p className="text-sm text-slate-300">
            The corrected code and its output will appear here.
          </p>
        </div>

        <button
          type="button"
          onClick={copyOutput}
          disabled={!result || isLoading}
          className="inline-flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {copyState === 'copied' ? '✅ Copied' : copyState === 'failed' ? '⚠️ Copy failed' : '📋 Copy Output'}
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
          <Loader text="Analyzing your code..." />
        </div>
      ) : null}

      {!isLoading && (error || hasDetectedIssues) ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100">
          {error ? <p>{error}</p> : null}
          {hasDetectedIssues ? (
            <div className="mt-3">
              <p className="font-semibold">Detected code issues:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-200">
                {detectedErrors.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {!isLoading && !showResult ? (
        <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-sm text-slate-300">
          Submit code to view the AI analysis in this panel.
        </div>
      ) : null}

      {!isLoading && showResult ? (
        <>
          <div className="mb-4 rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
            Model used: <strong className="text-sky-300">{result.model || 'OpenRouter'}</strong>
          </div>

          <div className="space-y-4">
            <article className={`rounded-2xl border p-4 ${highlightedSections.code}`}>
              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <span aria-hidden="true">{sectionIcons.code}</span>
                  <span>Corrected Code</span>
                </h3>
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-sky-200">
                  Separate view
                </span>
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950/80 p-3 font-mono text-xs text-sky-50 sm:text-sm theme-code-bg">
                {correctedCode}
              </pre>
            </article>

            <article className={`rounded-2xl border p-4 ${highlightedSections.output}`}>
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-white">
                <span aria-hidden="true">{sectionIcons.output}</span>
                <span>Code Output</span>
              </h3>
              <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950/80 p-3 font-mono text-xs text-emerald-50 sm:text-sm theme-code-bg">
                {output}
              </pre>
            </article>
          </div>
        </>
      ) : null}
    </section>
  )
}

export default OutputPanel
