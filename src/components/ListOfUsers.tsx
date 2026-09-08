import { useMemo, useState } from 'react'
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

export function ListOfUsers() {
  const dispatch = useAppDispatch()
  const { search, sortBy, sortDirection } = useAppSelector((state) => state.usersUi)
  const { data: users = [], error, isError, isFetching, isLoading, refetch } = useGetUsersQuery()
  const { isDeleting, removeUser } = useUserActions()
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

  const hasActiveFilters = search.trim().length > 0

  return (
    <section className="w-full rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm">
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wide text-purple-600">
            Gestión
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
            Usuarios: {users.length}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Busca, ordena, edita y elimina usuarios desde un estado centralizado.
          </p>
        </div>

        {isFetching && !isLoading && (
          <span className="inline-flex w-fit rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700">
            Sincronizando...
          </span>
        )}
      </header>

      <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_180px_auto_auto]">
        <div>
          <label htmlFor="search-users" className="sr-only">
            Buscar usuarios
          </label>
          <input
            id="search-users"
            type="search"
            value={search}
            onChange={(event) => dispatch(setSearch(event.target.value))}
            placeholder="Buscar por nombre, email o GitHub"
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <label className="sr-only" htmlFor="sort-users">
          Ordenar usuarios
        </label>
        <select
          id="sort-users"
          value={sortBy}
          onChange={(event) => dispatch(setSortBy(event.target.value as SortBy))}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
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
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
        >
          {sortDirection === 'asc' ? 'Ascendente' : 'Descendente'}
        </button>

        <button
          type="button"
          onClick={() => dispatch(resetFilters())}
          disabled={!hasActiveFilters}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Limpiar
        </button>
      </div>

      {isLoading && (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          Cargando usuarios...
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{getErrorMessage(error)}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !isError && filteredUsers.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900">No hay usuarios para mostrar</h3>
          <p className="mt-2 text-sm text-gray-500">
            {hasActiveFilters
              ? 'Prueba con otra búsqueda o limpia los filtros aplicados.'
              : 'Crea el primer usuario desde el formulario lateral.'}
          </p>
        </div>
      )}

      {!isLoading && !isError && filteredUsers.length > 0 && (
        <div className="relative overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  GitHub
                </th>
                <th scope="col" className="px-6 py-3 text-right font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="transition hover:bg-gray-50">
                  <th scope="row" className="px-6 py-4 font-semibold text-gray-900">
                    {user.name}
                  </th>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <a
                      href={`https://github.com/${user.github}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-purple-600 hover:underline"
                    >
                      @{user.github}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        aria-label={`Editar usuario ${user.name}`}
                        onClick={() => setEditingUser(user)}
                        className="rounded-lg border border-gray-300 p-2 text-gray-600 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-5"
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
                        className="rounded-lg border border-gray-300 p-2 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-5"
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} />
    </section>
  )
}
