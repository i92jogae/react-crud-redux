import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useAppDispatch, useAppSelector } from '../hooks/store'
import { useUserActions } from '../hooks/useUserActions'
import { useGetUsersQuery } from '../store/users/api'
import { resetFilters, setSearch, setSortBy, toggleSortDirection } from '../store/users/slice'
import type { SortBy, UserWithId } from '../store/users/types'
import { EditUserModal } from './EditUserModal'

const sortOptions: { label: string; value: SortBy }[] = [
  { label: 'Nombre', value: 'name' },
  { label: 'Email', value: 'email' },
  { label: 'GitHub', value: 'github' }
]

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message)
  }

  return 'No se han podido cargar los usuarios'
}

function downloadJson(users: UserWithId[]) {
  const blob = new Blob([JSON.stringify(users, null, 2)], {
    type: 'application/json;charset=utf-8'
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'redux-users-dashboard-users.json'
  link.click()

  URL.revokeObjectURL(url)
}

export function ListOfUsers() {
  const dispatch = useAppDispatch()
  const { search, sortBy, sortDirection } = useAppSelector((state) => state.usersUi)
  const { data: users = [], error, isError, isFetching, isLoading, refetch } = useGetUsersQuery()
  const { isDeleting, isResetting, removeUser, resetDemoData } = useUserActions()
  const [editingUser, setEditingUser] = useState<UserWithId | null>(null)

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return users
      .filter((user) => {
        if (!normalizedSearch) return true

        return [user.name, user.email, user.github].some((value) =>
          value.toLowerCase().includes(normalizedSearch)
        )
      })
      .sort((firstUser, secondUser) => {
        const compareResult = firstUser[sortBy].localeCompare(secondUser[sortBy], 'es', {
          sensitivity: 'base'
        })

        return sortDirection === 'asc' ? compareResult : -compareResult
      })
  }, [search, sortBy, sortDirection, users])

  const handleDeleteUser = async (user: UserWithId) => {
    const isConfirmed = window.confirm(
      `¿Seguro que quieres eliminar a ${user.name}? Esta acción no se puede deshacer.`
    )

    if (!isConfirmed) return

    try {
      await removeUser(user.id)
    } catch {
      // Error handled by the RTK Query error middleware
    }
  }

  const handleResetDemoData = async () => {
    const isConfirmed = window.confirm(
      '¿Quieres restaurar los usuarios iniciales de la demo? Se perderán los cambios locales.'
    )

    if (!isConfirmed) return

    try {
      await resetDemoData()
      dispatch(resetFilters())
    } catch {
      // Error handled by the RTK Query error middleware
    }
  }

  const handleExportUsers = () => {
    downloadJson(filteredUsers)
    toast.success('Usuarios exportados en JSON')
  }

  const hasActiveFilters = search.trim().length > 0
  const hasUsersToExport = filteredUsers.length > 0

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-4 text-left shadow-xl shadow-slate-950/10 sm:p-6">
      <header className="mb-6 flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
            Gestión
          </span>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
            Usuarios: {users.length}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Busca, ordena, edita, elimina, exporta y restaura usuarios desde un estado centralizado.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
          {isFetching && !isLoading && (
            <span className="inline-flex items-center justify-center rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
              Sincronizando...
            </span>
          )}

          <button
            type="button"
            onClick={handleExportUsers}
            disabled={!hasUsersToExport}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Exportar JSON
          </button>

          <button
            type="button"
            onClick={() => void handleResetDemoData()}
            disabled={isResetting}
            className="rounded-xl border border-slate-200 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isResetting ? 'Restaurando...' : 'Restaurar demo'}
          </button>
        </div>
      </header>

      <div className="mb-6 grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_180px_auto_auto]">
        <div className="min-w-0">
          <label htmlFor="search-users" className="sr-only">
            Buscar usuarios
          </label>
          <input
            id="search-users"
            type="search"
            value={search}
            onChange={(event) => dispatch(setSearch(event.target.value))}
            placeholder="Buscar por nombre, email o GitHub"
            className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        <label className="sr-only" htmlFor="sort-users">
          Ordenar usuarios
        </label>
        <select
          id="sort-users"
          value={sortBy}
          onChange={(event) => dispatch(setSortBy(event.target.value as SortBy))}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => dispatch(toggleSortDirection())}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        >
          {sortDirection === 'asc' ? 'Ascendente' : 'Descendente'}
        </button>

        <button
          type="button"
          onClick={() => dispatch(resetFilters())}
          disabled={!hasActiveFilters}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Limpiar
        </button>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          Cargando usuarios...
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{getErrorMessage(error)}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-3 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !isError && filteredUsers.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
          <h3 className="text-lg font-bold text-slate-950">No hay usuarios para mostrar</h3>
          <p className="mt-2 text-sm text-slate-500">
            {hasActiveFilters
              ? 'Prueba con otra búsqueda o limpia los filtros aplicados.'
              : 'Crea el primer usuario desde el formulario lateral.'}
          </p>
        </div>
      )}

      {!isLoading && !isError && filteredUsers.length > 0 && (
        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="hidden grid-cols-[1.1fr_1.45fr_1fr_112px] gap-4 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500 md:grid">
            <span>Nombre</span>
            <span>Email</span>
            <span>GitHub</span>
            <span className="text-right">Acciones</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <article
                key={user.id}
                className="grid min-w-0 gap-4 p-4 transition hover:bg-slate-50 md:grid-cols-[1.1fr_1.45fr_1fr_112px] md:items-center md:px-5 md:py-4"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 md:hidden">
                    Nombre
                  </p>
                  <p className="mt-1 font-bold text-slate-950 md:mt-0">{user.name}</p>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 md:hidden">
                    Email
                  </p>
                  <p className="mt-1 break-all text-sm text-slate-600 md:mt-0 md:truncate">
                    {user.email}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 md:hidden">
                    GitHub
                  </p>
                  <a
                    href={`https://github.com/${user.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block max-w-full truncate text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline md:mt-0"
                  >
                    @{user.github}
                  </a>
                </div>

                <div className="flex min-w-0 items-center gap-2 md:justify-end">
                  <button
                    type="button"
                    aria-label={`Editar usuario ${user.name}`}
                    onClick={() => setEditingUser(user)}
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 md:flex-none md:p-2"
                  >
                    <span className="md:sr-only">Editar</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="ml-2 size-5 md:ml-0"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    aria-label={`Eliminar usuario ${user.name}`}
                    disabled={isDeleting}
                    onClick={() => void handleDeleteUser(user)}
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60 md:flex-none md:p-2"
                  >
                    <span className="md:sr-only">Eliminar</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="ml-2 size-5 md:ml-0"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} />
    </section>
  )
}
