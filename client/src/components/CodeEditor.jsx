import Editor from '@monaco-editor/react'

const MonacoLanguageMap = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  csharp: 'csharp',
  php: 'php',
  ruby: 'ruby',
  go: 'go',
  rust: 'rust',
  kotlin: 'kotlin',
  swift: 'swift',
  html: 'html',
  css: 'css',
}

const CodeEditor = ({
  label = 'Code',
  value,
  onChange,
  placeholder = 'Paste your code here...',
  name = 'code',
  language = 'javascript',
  height = 'clamp(260px, 52vh, 420px)',
}) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor={name} className="text-sm font-semibold text-slate-200">
          {label}
        </label>
        <span className="text-xs text-slate-400">Optimized for mobile, tablet, and desktop</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/90 shadow-inner shadow-slate-950/40 theme-surface theme-border">
        <Editor
          height={height}
          defaultLanguage="javascript"
          language={MonacoLanguageMap[language] || 'plaintext'}
          theme="vs-dark"
          value={value}
          onChange={(updatedValue) => onChange(updatedValue || '')}
          loading={<div className="p-4 text-sm text-slate-300">Loading editor...</div>}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'Consolas, "Courier New", monospace',
            wordWrap: 'on',
            smoothScrolling: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 14, bottom: 14 },
            tabSize: 2,
            placeholder,
          }}
        />
      </div>
    </div>
  )
}

export default CodeEditor
