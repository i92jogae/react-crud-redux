import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useUserActions } from '../hooks/useUserActions'
import { userFormSchema, type UserFormData } from '../store/users/schema'

const inputClassName =
  'block w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100'

export function CreateNewUser() {
  const { addUser, isCreating } = useUserActions()
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      github: ''
    }
  })

  const onSubmit = async (data: UserFormData) => {
    try {
      await addUser(data)
      reset()
    } catch {
      // Error handled by the RTK Query error middleware
    }
  }

  const isButtonDisabled = isCreating || isSubmitting

  return (
    <section className="w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 text-left shadow-2xl shadow-slate-950/10">
      <header className="mb-6">
        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
          Nuevo registro
        </span>
        <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950">
          Crear nuevo usuario
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Añade un usuario a la lista con validación de formulario y sincronización con la API simulada.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            placeholder="Ej: Miguel Pérez"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={inputClassName}
            {...register('name')}
          />
          {errors.name && (
            <p id="name-error" className="mt-2 text-sm font-medium text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="ejemplo@email.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={inputClassName}
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="mt-2 text-sm font-medium text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="github" className="mb-2 block text-sm font-semibold text-slate-700">
            Usuario de GitHub
          </label>
          <input
            type="text"
            id="github"
            placeholder="Ej: i92jogae"
            aria-invalid={Boolean(errors.github)}
            aria-describedby={errors.github ? 'github-error' : undefined}
            className={inputClassName}
            {...register('github')}
          />
          {errors.github && (
            <p id="github-error" className="mt-2 text-sm font-medium text-red-600">
              {errors.github.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isButtonDisabled}
          className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:from-emerald-300 hover:to-cyan-300 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isButtonDisabled ? 'Creando usuario...' : 'Crear usuario'}
        </button>
      </form>
    </section>
  )
}
