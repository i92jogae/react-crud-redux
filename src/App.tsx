import { Toaster } from 'sonner'
import { CreateNewUser } from './components/CreateNewUser'
import { DashboardStats } from './components/DashboardStats'
import { ListOfUsers } from './components/ListOfUsers'

function App() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 sm:py-8 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-16rem] h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="animate-float absolute right-[-10rem] top-28 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-[-10rem] h-96 w-96 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(circle_at_top,black,transparent_72%)]" />
      </div>

      <section className="relative z-10 mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-5 sm:gap-6">
        <header className="animate-fade-up flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-emerald-950/20 backdrop-blur sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 text-left">
            <span className="inline-flex w-fit items-center rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-200">
              React · TypeScript · RTK Query
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              User Management{' '}
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Gestiona usuarios, filtros, validaciones y persistencia desde una interfaz responsive.
            </p>
          </div>

          <a
            href="https://github.com/i92jogae/react-crud-redux"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          >
            Ver repositorio
          </a>
        </header>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_390px] xl:items-start">
          <div className="animate-fade-up-delay-1 min-w-0 space-y-5">
            <DashboardStats />
            <ListOfUsers />
          </div>

          <div className="animate-fade-up-delay-2 min-w-0">
            <CreateNewUser />
          </div>
        </div>
      </section>

      <Toaster richColors position="top-right" />
    </main>
  )
}

export default App
