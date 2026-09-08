import { Toaster } from 'sonner'
import { CreateNewUser } from './components/CreateNewUser'
import { DashboardStats } from './components/DashboardStats'
import { ListOfUsers } from './components/ListOfUsers'

function App() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="max-w-3xl text-left">
          <span className="text-sm font-semibold uppercase tracking-wide text-purple-600">
            React · TypeScript · Redux Toolkit
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
            User Management Dashboard
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-600">
            Aplicación CRUD para gestionar usuarios con Redux Toolkit, RTK Query, formularios validados y una interfaz responsive orientada a producto.
          </p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
          <div className="space-y-6">
            <DashboardStats />
            <ListOfUsers />
          </div>

          <CreateNewUser />
        </div>
      </section>

      <Toaster richColors position="top-right" />
    </main>
  )
}

export default App
