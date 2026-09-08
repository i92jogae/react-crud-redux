import { useGetUsersQuery } from '../store/users/api'

export function DashboardStats() {
  const { data: users = [], isLoading } = useGetUsersQuery()

  const usersWithGithub = users.filter((user) => user.github.length > 0).length
  const visibleTotal = isLoading ? '...' : users.length
  const githubTotal = isLoading ? '...' : usersWithGithub

  return (
    <section aria-label="Resumen de usuarios" className="grid gap-4 md:grid-cols-3">
      <article className="rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm">
        <p className="text-sm font-medium text-gray-500">Usuarios totales</p>
        <strong className="mt-2 block text-3xl font-bold text-gray-900">{visibleTotal}</strong>
      </article>

      <article className="rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm">
        <p className="text-sm font-medium text-gray-500">Perfiles GitHub</p>
        <strong className="mt-2 block text-3xl font-bold text-gray-900">{githubTotal}</strong>
      </article>

      <article className="rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm">
        <p className="text-sm font-medium text-gray-500">Fuente de datos</p>
        <strong className="mt-2 block text-lg font-bold text-gray-900">RTK Query</strong>
        <p className="mt-1 text-sm text-gray-500">API simulada con caché</p>
      </article>
    </section>
  )
}
