import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useUserActions } from '../hooks/useUserActions'
import { userFormSchema, type UserFormData } from '../store/users/schema'

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
    <section className="w-full rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm">
      <header className="mb-6">
        <span className="text-sm font-semibold uppercase tracking-wide text-purple-600">
          Nuevo registro
        </span>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
          Crear nuevo usuario
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Añade un usuario a la lista con validación de formulario y sincronización con la API simulada.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            placeholder="Ej: Miguel Pérez"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            {...register('name')}
          />
          {errors.name && (
            <p id="name-error" className="mt-2 text-sm text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="ejemplo@email.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="mt-2 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="github" className="mb-2 block text-sm font-medium text-gray-700">
            Usuario de GitHub
          </label>
          <input
            type="text"
            id="github"
            placeholder="Ej: i92jogae"
            aria-invalid={Boolean(errors.github)}
            aria-describedby={errors.github ? 'github-error' : undefined}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            {...register('github')}
          />
          {errors.github && (
            <p id="github-error" className="mt-2 text-sm text-red-600">
              {errors.github.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isButtonDisabled}
          className="inline-flex w-full items-center justify-center rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isButtonDisabled ? 'Creando usuario...' : 'Crear usuario'}
        </button>
      </form>
    </section>
  )
}
