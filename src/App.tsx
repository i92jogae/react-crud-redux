import { Toaster } from 'sonner'
import { CreateNewUser } from './components/CreateNewUser'
import { DashboardStats } from './components/DashboardStats'
import { ListOfUsers } from './components/ListOfUsers'

const highlights = [
  { label: 'RTK Query', value: 'Cache + optimistic UI' },
  { label: 'TypeScript', value: 'Typed state and forms' },
  { label: 'CI/CD', value: 'Lint, tests and build' }
]

function App() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-12rem] h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="animate-float absolute right-[-7rem] top-32 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[-8rem] h-96 w-96 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_top,black,transparent_70%)]" />
      </div>

      <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="animate-fade-up grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-emerald-950/30 backdrop-blur md:p-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="max-w-3xl text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
              React · TypeScript · Redux Toolkit
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              User Management{' '}
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Panel de gestión de usuarios construido como una demo de producto: estado global tipado,
              API simulada, caché, formularios validados, feedback visual y pipeline de calidad automatizado.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://redux-users-dashboard.netlify.app/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font800 text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                Ver demo en Netlify
              </a>
              <a
                href="https://github.com/i92jogae/react-crud-redux"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                Ver repositorio
              </a>
            </div>
          </div>

          <aside className="grid gap-3 rounded-3xl border border-white/10 bg-slate-900/70 p-4 text-left shadow-xl shadow-slate-950/30">
            {highlights.map((item) => (
              <article key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
              </article>
            ))}
          </aside>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
          <div className="animate-fade-up-delay-1 space-y-6">
            <DashboardStats />
            <ListOfUsers />
          </div>

          <div className="animate-fade-up-delay-2">
            <CreateNewUser />
          </div>
        </div>
      </section>

      <Toaster richColors position="top-right" />
    </main>
  )
}

export default App
