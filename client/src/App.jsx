import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import AuthPanel from './components/AuthPanel'
import ChatAssistant from './components/ChatAssistant'
import CodeEditor from './components/CodeEditor'
import LanguageSelector from './components/LanguageSelector'
import Loader from './components/Loader'
import LoginPage from './components/LoginPage'
import Navbar from './components/Navbar'
import OutputPanel from './components/OutputPanel'
import WorkspacePage from './components/WorkspacePage'

const buildEnvApiBaseUrl = import.meta.env.REACT_APP_API_URL || import.meta.env.VITE_API_BASE_URL
const runtimeApiBaseUrl = typeof window !== 'undefined' ? window.location.origin : ''
const isDevMode = Boolean(import.meta.env.DEV)

const isPrivateNetworkUrl = (value) => {
  if (!value || typeof value !== 'string') {
    return false
  }

  const url = value.replace(/\/$/, '')
  return /^https?:\/\/(localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(?::\d{1,5})?$/.test(url)
}

const getFallbackApiBaseUrl = () => {
  // In Vite dev, use relative `/api` and let vite.config proxy handle backend routing.
  // This avoids browser CORS issues for localhost/LAN device access.
  if (isDevMode) {
    return ''
  }

  const normalizedRuntimeOrigin = runtimeApiBaseUrl.replace(/\/$/, '')
  const normalizedBuildUrl = buildEnvApiBaseUrl?.replace(/\/$/, '') || ''

  if (normalizedBuildUrl && isPrivateNetworkUrl(normalizedBuildUrl)) {
    const runtimeIsPublic = normalizedRuntimeOrigin && !isPrivateNetworkUrl(normalizedRuntimeOrigin)

    if (typeof window !== 'undefined' && runtimeIsPublic) {
      console.warn(
        'Ignoring private backend URL in browser runtime:',
        normalizedBuildUrl,
        'Using frontend origin instead.'
      )
      return normalizedRuntimeOrigin
    }
  }

  return normalizedBuildUrl || normalizedRuntimeOrigin
}

const API_BASE_URL = getFallbackApiBaseUrl()
const getApiUrl = (path) => `${API_BASE_URL}${path}`

const starterMessage = {
  role: 'assistant',
  content:
    'Hi! I am your AI chat assistant. Ask me why your code is failing, request a refactor, or ask for a simpler explanation.',
}

const getStoredValue = (key, fallback = '') => {
  if (typeof window === 'undefined') {
    return fallback
  }

  return window.localStorage.getItem(key) || fallback
}

const getStoredUser = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const value = window.localStorage.getItem('authUser')
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

function App() {
  const navigate = useNavigate()
  const [code, setCode] = useState(
    'function greet(name) {\n  return `Hello ${name}`\n}\n\nconsole.log(gret("World"))'
  )
  const [language, setLanguage] = useState('javascript')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [chatQuestion, setChatQuestion] = useState('')
  const [chatMessages, setChatMessages] = useState([starterMessage])
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState('')
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authToken, setAuthToken] = useState(() => getStoredValue('authToken'))
  const [authUser, setAuthUser] = useState(() => getStoredUser())
  const [theme, setTheme] = useState(() => getStoredValue('theme', 'dark'))
  const [apiStatus, setApiStatus] = useState({
    tone: 'pending',
    text: 'Checking backend connection...',
  })
  const [appLoading, setAppLoading] = useState(true)

  const isAuthenticated = Boolean(authToken && authUser)

  const storeAuthSession = (token, user) => {
    setAuthToken(token)
    setAuthUser(user)

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('authToken', token)
      window.localStorage.setItem('authUser', JSON.stringify(user))
    }
  }

  const clearAuthSession = () => {
    setAuthToken('')
    setAuthUser(null)

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('authToken')
      window.localStorage.removeItem('authUser')
    }
  }

  useEffect(() => {
    const initializeApp = async () => {
      setAppLoading(true)
      try {
        const response = await fetch(getApiUrl('/api/health'))

        if (!response.ok) {
          throw new Error('Unable to reach the API')
        }

        const data = await response.json()

        setApiStatus({
          tone: 'success',
          text: data.message,
        })
      } catch (error) {
        const warningMessage = isPrivateNetworkUrl(buildEnvApiBaseUrl)
          ? `Backend is not reachable at ${API_BASE_URL}. The configured API URL appears to be a private/internal address. Set VITE_API_BASE_URL to your public backend domain, then rebuild and redeploy.`
          : `Backend is not reachable at ${API_BASE_URL}. Check VITE_API_BASE_URL / REACT_APP_API_URL and backend CORS settings, then rebuild and redeploy.`

        setApiStatus({
          tone: 'warning',
          text: warningMessage,
        })
        console.error('Backend health check failed:', error)
      }

      if (authToken) {
        try {
          const response = await fetch(getApiUrl('/api/auth/me'), {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          })

          if (!response.ok) {
            throw new Error('Stored session is no longer valid.')
          }

          const data = await response.json()
          const user = data.data?.user || null

          if (user) {
            setAuthUser(user)
          }
        } catch {
          clearAuthSession()
        }
      }

      setAppLoading(false)
    }

    initializeApp()
  }, [authToken])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement
      root.classList.remove('theme-light', 'theme-dark')
      root.classList.add(theme === 'light' ? 'theme-light' : 'theme-dark')
      window.localStorage.setItem('theme', theme)
    }
  }, [theme])

  const handleAuthFieldChange = (event) => {
    const { name, value } = event.target
    setAuthForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleAuthModeChange = (nextMode) => {
    setAuthMode(nextMode)
    setAuthError('')
    setAuthForm({ name: '', email: '', password: '' })
  }

  const handleAuthSubmit = async (event) => {
    event.preventDefault()
    setAuthLoading(true)
    setAuthError('')

    try {
      const endpoint = authMode === 'signup' ? 'signup' : 'login'
      const payload = authMode === 'signup'
        ? authForm
        : {
            email: authForm.email,
            password: authForm.password,
          }

      const response = await fetch(getApiUrl(`/api/auth/${endpoint}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Authentication request failed.')
      }

      storeAuthSession(data.data?.token || '', data.data?.user || null)
      setAuthForm({ name: '', email: '', password: '' })
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setAuthError(requestError.message || 'Unable to complete the authentication request.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleForgotPassword = async (email) => {
    if (!email || !email.trim()) {
      setAuthError('Please enter your email before requesting a password reset.')
      return
    }

    setAuthLoading(true)
    setAuthError('')
    try {
      const response = await fetch(getApiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Unable to complete forgot password request.')
      }

      setAuthError('')
      setApiStatus({
        tone: 'success',
        text: data.message || 'Reset instructions sent. Check your email.',
      })
    } catch (requestError) {
      setAuthError(requestError.message || 'Unable to complete forgot password request.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      if (authToken) {
        await fetch(getApiUrl('/api/auth/logout'), {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
      }
    } finally {
      clearAuthSession()
      setResult(null)
      setError('')
      setChatError('')
      setChatMessages([starterMessage])
      navigate('/login', { replace: true })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!authToken) {
      setError('Please log in to use the AI debugger.')
      navigate('/login', { replace: true })
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(getApiUrl('/api/debug'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ code, language }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          clearAuthSession()
          navigate('/login', { replace: true })
        }

        throw new Error(data.message || 'Unable to analyze the submitted code.')
      }

      setResult(data.data)
    } catch (requestError) {
      setResult(null)
      setError(requestError.message || 'Something went wrong while contacting the backend.')
    } finally {
      setLoading(false)
    }
  }

  const handleChatSubmit = async (event) => {
    event.preventDefault()

    const trimmedQuestion = chatQuestion.trim()

    if (!trimmedQuestion) {
      return
    }

    if (!authToken) {
      setChatError('Please log in to chat with the AI assistant.')
      navigate('/login', { replace: true })
      return
    }

    const history = chatMessages.filter((message) => message.role === 'user' || message.role === 'assistant')
    const newUserMessage = { role: 'user', content: trimmedQuestion }

    setChatMessages((previous) => [...previous, newUserMessage])
    setChatQuestion('')
    setChatError('')
    setChatLoading(true)

    try {
      const response = await fetch(getApiUrl('/api/chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          code,
          language,
          question: trimmedQuestion,
          history,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          clearAuthSession()
          navigate('/login', { replace: true })
        }

        throw new Error(data.message || 'Unable to get a chat response right now.')
      }

      setChatMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          content: data.data?.reply || 'No response was returned by the AI assistant.',
        },
      ])
    } catch (requestError) {
      setChatError(requestError.message || 'Something went wrong while sending your question.')
    } finally {
      setChatLoading(false)
    }
  }

  const handleClearCode = () => {
    setCode('')
    setResult(null)
    setError('')
  }

  if (appLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="max-w-lg rounded-3xl border border-slate-800/80 bg-slate-900/85 p-8 text-center shadow-2xl shadow-slate-950/60">
          <p className="mb-4 text-sm uppercase tracking-[0.28em] text-cyan-300">Initializing application</p>
          <h1 className="mb-3 text-2xl font-semibold text-white">Connecting to your backend</h1>
          <p className="mb-6 text-sm text-slate-300">
            Establishing a secure connection with the deployed API and validating your session.
          </p>
          <Loader text="Loading app..." />
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage
              apiStatus={apiStatus}
              authMode={authMode}
              authForm={authForm}
              authLoading={authLoading}
              authError={authError}
              onModeChange={handleAuthModeChange}
              onFormChange={handleAuthFieldChange}
              onSubmit={handleAuthSubmit}
              onForgotPassword={handleForgotPassword}
              theme={theme}
              onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <WorkspacePage
              apiStatus={apiStatus}
              authUser={authUser}
              code={code}
              language={language}
              loading={loading}
              result={result}
              error={error}
              chatMessages={chatMessages}
              chatQuestion={chatQuestion}
              chatLoading={chatLoading}
              chatError={chatError}
              theme={theme}
              onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
              onLanguageChange={setLanguage}
              onCodeChange={setCode}
              onClearCode={handleClearCode}
              onDebugSubmit={handleSubmit}
              onQuestionChange={setChatQuestion}
              onChatSubmit={handleChatSubmit}
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}

export default App
