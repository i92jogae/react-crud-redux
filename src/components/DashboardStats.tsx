import { useGetUsersQuery } from '../store/users/api'

const statCards = [
  {
    label: 'Usuarios totales',
    getValue: (usersLength: number, usersWithGithub: number) => usersLength,
    description: 'Registros sincronizados con la API simulada',
    icon: '👥'
  },
  {
    label: 'Perfiles GitHub',
    getValue: (usersLength: number, usersWithGithub: number) => usersWithGithub,
    description: 'Usuarios con perfil técnico asociado',
    icon: '⌁'
  },
  {
    label: 'Fuente de datos',
    getValue: () => 'RTK Query',
    description: 'Caché, invalidación y optimistic updates',
    icon: '⚡'
  }
]

export function DashboardStats() {
  const { data: users = [], isLoading } = useGetUsersQuery()

  const usersWithGithub = users.filter((user) => user.github.length > 0).length

  return (
    <section aria-label="Resumen de usuarios" className="grid gap-4 md:grid-cols-3">
      {statCards.map((card) => {
        const value = isLoading ? '...' : card.getValue(users.length, usersWithGithub)

        return (
          <article
            key={card.label}
            className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 text-left shadow-xl shadow-slate-950/5 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-emerald-950/10"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                <strong className="mt-2 block text-3xl font-black tracking-tight text-slate-950">
                  {value}
                </strong>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-100 to-cyan-100 text-lg text-emerald-700 transition group-hover:scale-105">
                {card.icon}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500">{card.description}</p>
          </article>
        )
      })}
    </section>
  )
}
