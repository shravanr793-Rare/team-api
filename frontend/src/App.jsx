
import { useEffect, useRef, useState } from 'react'
import {
  Activity,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleHelp,
  Code2,
  GitBranch,
  Globe,
  LayoutDashboard,
  Play,
  Settings,
  ShieldCheck,
  Terminal,
  Zap,
} from 'lucide-react'

import {
  checkBackendHealth,
  executeApiRequest,
} from './services/api'

const endpoints = [
  {
    method: 'GET',
    path: '/health',
    description: 'Check API health and version',
    category: 'Health',
  },
  {
    method: 'GET',
    path: '/greet/{name}',
    description: 'Generate a personalized greeting',
    category: 'Utility',
  },
  {
    method: 'GET',
    path: '/add',
    description: 'Add two numbers together',
    category: 'Utility',
  },
  {
    method: 'GET',
    path: '/reverse/{text}',
    description: 'Reverse the supplied text',
    category: 'Utility',
  },
  {
    method: 'POST',
    path: '/wordcount',
    description: 'Count words in a text input',
    category: 'Text',
  },
]

const pageToHash = {
  'Overview': '#overview',
  'API Playground': '#playground',
  'Documentation': '#documentation',
  'Settings': '#settings',
  'Help & Support': '#help',
}

const hashToPage = Object.fromEntries(
  Object.entries(pageToHash).map(([page, hash]) => [hash, page]),
)

function getPageFromLocation() {
  return hashToPage[window.location.hash] || 'Overview'
}

function App() {
  const initialPage = getPageFromLocation()
  const initialHistoryState = window.history.state
  const initialStack = Array.isArray(initialHistoryState?.historyStack)
    ? initialHistoryState.historyStack
    : [initialPage]
  const initialIndex = Number.isInteger(initialHistoryState?.historyIndex)
    ? Math.min(initialHistoryState.historyIndex, initialStack.length - 1)
    : initialStack.length - 1

  const [activePage, setActivePage] = useState(initialPage)
  const [canGoBack, setCanGoBack] = useState(initialIndex > 0)
  const [canGoForward, setCanGoForward] = useState(initialIndex < initialStack.length - 1)
  const historyStackRef = useRef(initialStack)
  const historyIndexRef = useRef(initialIndex)
  const [backendStatus, setBackendStatus] = useState('checking')
  const [backendVersion, setBackendVersion] = useState(null)

  function updateHistoryButtons(stack, index) {
    setCanGoBack(index > 0)
    setCanGoForward(index < stack.length - 1)
  }

  function navigateTo(page) {
    if (!pageToHash[page] || page === activePage) return

    const nextStack = historyStackRef.current.slice(0, historyIndexRef.current + 1)
    nextStack.push(page)
    const nextIndex = nextStack.length - 1

    historyStackRef.current = nextStack
    historyIndexRef.current = nextIndex

    window.history.pushState(
      { page, historyStack: nextStack, historyIndex: nextIndex },
      '',
      pageToHash[page],
    )

    setActivePage(page)
    updateHistoryButtons(nextStack, nextIndex)
  }

  function goBack() {
    if (canGoBack) window.history.back()
  }

  function goForward() {
    if (canGoForward) window.history.forward()
  }

  useEffect(() => {
    const currentPage = getPageFromLocation()
    const currentState = window.history.state

    if (
      !currentState ||
      !Array.isArray(currentState.historyStack) ||
      !Number.isInteger(currentState.historyIndex)
    ) {
      const startingStack = [currentPage]
      historyStackRef.current = startingStack
      historyIndexRef.current = 0
      window.history.replaceState(
        { page: currentPage, historyStack: startingStack, historyIndex: 0 },
        '',
        pageToHash[currentPage],
      )
      setActivePage(currentPage)
      updateHistoryButtons(startingStack, 0)
    } else {
      const restoredStack = currentState.historyStack
      const restoredIndex = Math.min(
        currentState.historyIndex,
        restoredStack.length - 1,
      )
      historyStackRef.current = restoredStack
      historyIndexRef.current = restoredIndex
      setActivePage(currentState.page || currentPage)
      updateHistoryButtons(restoredStack, restoredIndex)
    }

    function handlePopState(event) {
      const page = event.state?.page || getPageFromLocation()
      const stack = Array.isArray(event.state?.historyStack)
        ? event.state.historyStack
        : historyStackRef.current
      const index = Number.isInteger(event.state?.historyIndex)
        ? event.state.historyIndex
        : Math.max(0, stack.lastIndexOf(page))

      historyStackRef.current = stack
      historyIndexRef.current = index
      setActivePage(page)
      updateHistoryButtons(stack, index)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    async function checkBackend() {
      try {
        const data = await checkBackendHealth()
        setBackendStatus('connected')
        setBackendVersion(data.version)
      } catch (error) {
        console.error('Backend connection failed:', error)
        setBackendStatus('disconnected')
      }
    }

    checkBackend()
  }, [])

  const navigation = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'API Playground', icon: Terminal },
    { name: 'Documentation', icon: BookOpen },
  ]

  const statusText = {
    checking: 'Checking connection',
    connected: 'Connected',
    disconnected: 'Not connected',
  }

  const statusColor = {
    checking: 'bg-amber-50 text-amber-700',
    connected: 'bg-emerald-50 text-emerald-700',
    disconnected: 'bg-red-50 text-red-700',
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">

      {/* SIDEBAR */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">

        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Code2 size={22} />
          </div>

          <div>
            <h1 className="font-bold tracking-tight">Team API Studio</h1>
            <p className="text-xs text-slate-500">Developer workspace</p>
          </div>
        </div>

        <div className="flex-1 px-4 py-7">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => navigateTo(name)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  activePage === name
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                {name}
              </button>
            ))}
          </nav>

          <p className="mb-3 mt-10 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Preferences
          </p>

          <button
            onClick={() => navigateTo('Settings')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${
              activePage === 'Settings'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Settings size={18} />
            Settings
          </button>

          <button
            onClick={() => navigateTo('Help & Support')}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <CircleHelp size={18} />
            Help & Support
          </button>
        </div>

        {/* DEVELOPER TIP */}
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl bg-indigo-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-indigo-700">
              <Zap size={17} />
              <span className="text-sm font-semibold">Developer tip</span>
            </div>

            <p className="text-xs leading-5 text-slate-600">
              Use the API Playground to test your endpoints without leaving your workspace.
            </p>

            <button
              onClick={() => navigateTo('API Playground')}
              className="mt-3 text-xs font-semibold text-indigo-700 hover:underline"
            >
              Open Playground →
            </button>
          </div>

          {/* USER PROFILE */}
          <div className="mt-5 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
              SR
            </div>

            <div>
              <p className="text-sm font-semibold">Developer</p>
              <p className="text-xs text-slate-500">Project owner</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-w-0 flex-1">

        {/* HEADER */}
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-9">

          <div>
            <p className="text-xs text-slate-400">
              Workspace / {activePage}
            </p>

            <h2 className="mt-1 text-lg font-semibold">{activePage}</h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={goBack}
                disabled={!canGoBack}
                aria-label="Go back"
                title="Go back"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={17} />
              </button>
              <button
                type="button"
                onClick={goForward}
                disabled={!canGoForward}
                aria-label="Go forward"
                title="Go forward"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowRight size={17} />
              </button>
            </div>

            <a
              href="https://github.com/shravanr793-Rare/team-api"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 sm:flex"
            >
              <GitBranch size={16} />
              GitHub
              <ArrowUpRight size={14} />
            </a>

            <div className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${statusColor[backendStatus]}`}>
              <span
                className={`h-2 w-2 rounded-full ${
                  backendStatus === 'connected'
                    ? 'bg-emerald-500'
                    : backendStatus === 'disconnected'
                      ? 'bg-red-500'
                      : 'bg-amber-500'
                }`}
              />

              {statusText[backendStatus]}
            </div>

          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="mx-auto max-w-7xl p-5 md:p-9">

          {/* OVERVIEW PAGE */}
          {activePage === 'Overview' && (
            <>

              {/* WELCOME */}
              <section className="mb-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                  <div>
                    <p className="mb-2 text-sm font-medium text-indigo-600">
                      DEVELOPER CONSOLE
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                      Welcome to your workspace
                    </h1>

                    <p className="mt-2 text-slate-500">
                      Monitor, explore and test your APIs from one place.
                    </p>
                  </div>

                  <button
                    onClick={() => navigateTo('API Playground')}
                    className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                  >
                    <Play size={16} />
                    Open API Playground
                  </button>

                </div>
              </section>

              {/* STATISTICS */}
              <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                  label="Total endpoints"
                  value="05"
                  detail="Available API routes"
                  icon={Code2}
                  iconColor="text-indigo-600 bg-indigo-50"
                />

                <StatCard
                  label="Backend status"
                  value={
                    backendStatus === 'connected'
                      ? 'Online'
                      : backendStatus === 'checking'
                        ? 'Checking'
                        : 'Offline'
                  }
                  detail={statusText[backendStatus]}
                  icon={Activity}
                  iconColor="text-emerald-600 bg-emerald-50"
                />

                <StatCard
                  label="Automated tests"
                  value="Ready"
                  detail="Backend test suite"
                  icon={ShieldCheck}
                  iconColor="text-violet-600 bg-violet-50"
                />

                <StatCard
                  label="API version"
                  value={backendVersion || '—'}
                  detail="Live backend version"
                  icon={Globe}
                  iconColor="text-orange-600 bg-orange-50"
                />

              </section>

              {/* API ENDPOINTS */}
              <section className="mb-8 rounded-xl border border-slate-200 bg-white">

                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
                  <div>
                    <h3 className="font-semibold">API Endpoints</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Your available backend routes
                    </p>
                  </div>

                  <button
                    onClick={() => navigateTo('API Playground')}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Explore all →
                  </button>
                </div>

                <div className="divide-y divide-slate-100">

                  {endpoints.map((endpoint) => (
                    <div
                      key={endpoint.path}
                      className="flex flex-col justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center"
                    >

                      <div className="flex items-center gap-3">

                        <span
                          className={`w-14 rounded-md px-2 py-1 text-center text-xs font-bold ${
                            endpoint.method === 'POST'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {endpoint.method}
                        </span>

                        <div>
                          <p className="font-mono text-sm font-semibold">
                            {endpoint.path}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {endpoint.description}
                          </p>
                        </div>

                      </div>

                      <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                        {endpoint.category}
                      </span>

                    </div>
                  ))}

                </div>

                <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
                  5 routes registered in the FastAPI backend
                </div>

              </section>

              {/* BACKEND CONNECTION */}
              <section className="grid gap-5 lg:grid-cols-2">

                <div className="rounded-xl border border-slate-200 bg-white p-5">

                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                      <Globe size={20} />
                    </div>

                    <div>
                      <h3 className="font-semibold">Backend connection</h3>
                      <p className="text-xs text-slate-500">
                        FastAPI service
                      </p>
                    </div>
                  </div>

                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    API Base URL
                  </p>

                  <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 p-3">
                    <code className="text-sm text-slate-700">
                      http://localhost:8000
                    </code>

                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColor[backendStatus]}`}>
                      {statusText[backendStatus]}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    {backendStatus === 'connected'
                      ? 'Your frontend is successfully communicating with FastAPI.'
                      : backendStatus === 'checking'
                        ? 'Checking backend availability...'
                        : 'Start your FastAPI server to connect this dashboard to your backend.'}
                  </p>

                  <p className="mt-3 font-mono text-xs text-slate-400">
                    uvicorn app.main:app --reload
                  </p>

                </div>

                {/* DEVELOPMENT WORKFLOW */}
                <div className="rounded-xl border border-slate-200 bg-white p-5">

                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                      <CheckCircle2 size={20} />
                    </div>

                    <div>
                      <h3 className="font-semibold">Development Workflow</h3>
                      <p className="text-xs text-slate-500">
                        Project technologies
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <WorkflowItem label="Backend" value="Python · FastAPI" />
                    <WorkflowItem label="Frontend" value="React · Vite · Tailwind" />
                    <WorkflowItem label="Testing" value="Pytest" />
                    <WorkflowItem label="Deployment" value="Docker · Railway" />
                  </div>

                </div>

              </section>

              {/* QUICK ACTIONS AND PROJECT ACTIVITY */}
              <section className="mt-5 grid gap-5 lg:grid-cols-2">

                {/* QUICK ACTIONS */}
                <div className="rounded-xl border border-slate-200 bg-white p-5">

                  <h3 className="font-semibold">Quick Actions</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Common developer shortcuts
                  </p>

                  <div className="mt-5 space-y-3">

                    <QuickAction
                      title="Test an endpoint"
                      description="Run requests in the playground"
                      icon={Play}
                      onClick={() => navigateTo('API Playground')}
                    />

                    <QuickAction
                      title="View documentation"
                      description="Explore API routes and examples"
                      icon={BookOpen}
                      onClick={() => window.open('http://localhost:8000/docs', '_blank')}
                    />

                    <QuickAction
                      title="View source code"
                      description="Open the GitHub repository"
                      icon={GitBranch}
                      onClick={() => window.open('https://github.com/shravanr793-Rare/team-api', '_blank')}
                    />

                  </div>
                </div>

                {/* PROJECT ACTIVITY */}
                <div className="rounded-xl border border-slate-200 bg-white p-5">

                  <h3 className="font-semibold">Project Activity</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Current project overview
                  </p>

                  <div className="mt-5 space-y-5">

                    <ActivityItem
                      title="Frontend initialized"
                      description="React dashboard with Tailwind CSS"
                      icon={Code2}
                    />

                    <ActivityItem
                      title="Backend connected"
                      description="FastAPI service with five routes"
                      icon={Activity}
                    />

                    <ActivityItem
                      title="Automated testing"
                      description="Pytest test suite"
                      icon={ShieldCheck}
                    />

                    <ActivityItem
                      title="Deployment pipeline"
                      description="Docker and GitHub Actions"
                      icon={Globe}
                    />

                  </div>
                </div>

              </section>

            </>
          )}

          {/* API PLAYGROUND */}
          {activePage === 'API Playground' && <ApiPlayground />}

          {/* DOCUMENTATION */}
          {activePage === 'Documentation' && (
            <section className="rounded-xl border border-slate-200 bg-white p-8">

              <BookOpen className="mb-4 text-indigo-600" size={28} />

              <h1 className="text-2xl font-bold">Documentation</h1>

              <p className="mt-2 text-slate-500">
                Explore your FastAPI endpoints and their request/response schemas.
              </p>

              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Open Swagger UI
                <ArrowUpRight size={15} />
              </a>

            </section>
          )}

          {/* SETTINGS */}
          {activePage === 'Settings' && (
            <section className="rounded-xl border border-slate-200 bg-white p-8">
              <Settings className="mb-4 text-indigo-600" size={28} />
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="mt-2 text-slate-500">
                Workspace settings and configuration will be added here.
              </p>
            </section>
          )}

          {/* HELP */}
          {activePage === 'Help & Support' && (
            <section className="rounded-xl border border-slate-200 bg-white p-8">
              <CircleHelp className="mb-4 text-indigo-600" size={28} />
              <h1 className="text-2xl font-bold">Help & Support</h1>
              <p className="mt-2 text-slate-500">
                For API reference and examples, visit the Documentation section.
              </p>
            </section>
          )}

          {/* FOOTER */}
          <footer className="mt-10 flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row">
            <p>Team API Studio · Developer workspace</p>
            <p>Built with React, Tailwind CSS and FastAPI</p>
          </footer>

        </div>
      </main>
    </div>
  )
}

/* API PLAYGROUND COMPONENT */
function ApiPlayground() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('health')
  const [name, setName] = useState('Shravan')
  const [numberA, setNumberA] = useState('10')
  const [numberB, setNumberB] = useState('20')
  const [inputText, setInputText] = useState('Hello Team API Studio')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const endpointOptions = {
    health: {
      method: 'GET',
      path: '/health',
      description: 'Check whether the backend is running.',
    },
    greet: {
      method: 'GET',
      path: '/greet/{name}',
      description: 'Generate a greeting for a name.',
    },
    add: {
      method: 'GET',
      path: '/add',
      description: 'Add two numbers.',
    },
    reverse: {
      method: 'GET',
      path: '/reverse/{text}',
      description: 'Reverse a text string.',
    },
    wordcount: {
      method: 'POST',
      path: '/wordcount',
      description: 'Count the words in a text.',
    },
  }

  const currentEndpoint = endpointOptions[selectedEndpoint]

  async function sendRequest() {
    setLoading(true)
    setResult(null)

    let endpoint = ''
    let options = {}

    try {
      switch (selectedEndpoint) {
        case 'health':
          endpoint = '/health'
          break

        case 'greet':
          if (!name.trim()) {
            throw new Error('Please enter a name.')
          }
          endpoint = `/greet/${encodeURIComponent(name.trim())}`
          break

        case 'add':
          if (numberA.trim() === '' || numberB.trim() === '') {
            throw new Error('Please enter both numbers.')
          }

          if (!Number.isFinite(Number(numberA)) || !Number.isFinite(Number(numberB))) {
            throw new Error('Please enter valid numbers.')
          }

          endpoint = `/add?a=${encodeURIComponent(numberA)}&b=${encodeURIComponent(numberB)}`
          break

        case 'reverse':
          if (!inputText.trim()) {
            throw new Error('Please enter some text.')
          }
          endpoint = `/reverse/${encodeURIComponent(inputText)}`
          break

        case 'wordcount':
          if (!inputText.trim()) {
            throw new Error('Please enter some text.')
          }

          endpoint = '/wordcount'
          options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: inputText,
            }),
          }
          break

        default:
          throw new Error('Select a valid endpoint.')
      }

      const response = await executeApiRequest(endpoint, options)
      setResult(response)

    } catch (error) {
      setResult({
        success: false,
        status: 'Input Error',
        executionTime: 0,
        data: {
          error: error.message,
        },
      })
    } finally {
      setLoading(false)
    }
  }

  function handleEndpointChange(value) {
    setSelectedEndpoint(value)
    setResult(null)
  }

  return (
    <div className="space-y-6">

      {/* PLAYGROUND INTRO */}
      <section>
        <p className="mb-2 text-sm font-medium text-indigo-600">
          DEVELOPER TOOL
        </p>

        <h1 className="text-2xl font-bold">API Playground</h1>

        <p className="mt-2 text-sm text-slate-500">
          Build requests, execute API endpoints and inspect their responses.
        </p>
      </section>

      {/* REQUEST BUILDER */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Request Builder</h2>
            <p className="mt-1 text-xs text-slate-500">
              Configure your API request
            </p>
          </div>

          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            FastAPI
          </span>
        </div>

        {/* ENDPOINT SELECTOR */}
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Select Endpoint
        </label>

        <select
          value={selectedEndpoint}
          onChange={(e) => handleEndpointChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="health">GET /health</option>
          <option value="greet">GET /greet/{'{name}'}</option>
          <option value="add">GET /add</option>
          <option value="reverse">GET /reverse/{'{text}'}</option>
          <option value="wordcount">POST /wordcount</option>
        </select>

        {/* REQUEST DETAILS */}
        <div className="mt-5">

          <div className="mb-3 flex items-center gap-3">
            <span className={`rounded-md px-3 py-1 text-xs font-bold ${
              currentEndpoint.method === 'POST'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-blue-50 text-blue-700'
            }`}>
              {currentEndpoint.method}
            </span>

            <code className="text-sm font-semibold text-slate-700">
              {currentEndpoint.path}
            </code>
          </div>

          <p className="mb-5 text-sm text-slate-500">
            {currentEndpoint.description}
          </p>

          {/* GREETING INPUT */}
          {selectedEndpoint === 'greet' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* ADD INPUTS */}
          {selectedEndpoint === 'add' && (
            <div className="grid gap-4 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  First Number
                </label>

                <input
                  type="number"
                  value={numberA}
                  onChange={(e) => setNumberA(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Second Number
                </label>

                <input
                  type="number"
                  value={numberB}
                  onChange={(e) => setNumberB(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

            </div>
          )}

          {/* TEXT INPUTS */}
          {(selectedEndpoint === 'reverse' ||
            selectedEndpoint === 'wordcount') && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Input Text
              </label>

              <textarea
                rows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your text here..."
                className="w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* HEALTH MESSAGE */}
          {selectedEndpoint === 'health' && (
            <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
              This endpoint does not require any input. Click Send Request to check the backend health.
            </div>
          )}

        </div>

        {/* SEND BUTTON */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">

          <p className="text-xs text-slate-400">
            Base URL: http://localhost:8000
          </p>

          <button
            onClick={sendRequest}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Sending...' : (
              <>
                <Play size={15} />
                Send Request
              </>
            )}
          </button>

        </div>

      </section>

      {/* RESPONSE VIEWER */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">

        <div className="mb-5 flex items-center justify-between">

          <div>
            <h2 className="font-semibold">Response</h2>
            <p className="mt-1 text-xs text-slate-500">
              Server response will appear here
            </p>
          </div>

          {result && (
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
              result.success
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-700'
            }`}>
              {result.success ? 'Success' : 'Failed'}
            </span>
          )}

        </div>

        {result ? (
          <>

            {/* RESPONSE METADATA */}
            <div className="mb-4 grid gap-3 sm:grid-cols-2">

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs text-slate-500">HTTP Status</p>
                <p className="mt-1 text-lg font-bold text-slate-800">
                  {result.status}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Execution Time</p>
                <p className="mt-1 text-lg font-bold text-slate-800">
                  {result.executionTime} ms
                </p>
              </div>

            </div>

            {/* JSON RESPONSE */}
            <div className="overflow-hidden rounded-lg bg-slate-950">

              <div className="border-b border-slate-700 px-4 py-3 text-xs font-medium text-slate-300">
                JSON Response
              </div>

              <pre className="max-h-96 overflow-auto p-4 text-sm leading-6 text-emerald-300">
                {JSON.stringify(result.data, null, 2)}
              </pre>

            </div>

          </>
        ) : (

          <div className="rounded-lg border border-dashed border-slate-300 py-12 text-center">

            <Terminal className="mx-auto mb-3 text-slate-400" size={30} />

            <p className="text-sm font-medium text-slate-600">
              No response yet
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Select an endpoint and send your first request.
            </p>

          </div>

        )}

      </section>

    </div>
  )
}

/* STATISTICS CARD */
function StatCard({ label, value, detail, icon: Icon, iconColor }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>

        <div className={`rounded-lg p-2 ${iconColor}`}>
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>

    </div>
  )
}

/* WORKFLOW ITEM */
function WorkflowItem({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  )
}

/* QUICK ACTION */
function QuickAction({ title, description, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg border border-slate-100 p-3 text-left hover:bg-slate-50"
    >

      <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
        <Icon size={18} />
      </div>

      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>

      <ArrowUpRight size={16} className="text-slate-400" />

    </button>
  )
}

/* PROJECT ACTIVITY */
function ActivityItem({ title, description, icon: Icon }) {
  return (
    <div className="flex items-center gap-3">

      <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
        <Icon size={18} />
      </div>

      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>

    </div>
  )
}

export default App
