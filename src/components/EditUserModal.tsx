import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useUserActions } from '../hooks/useUserActions'
import { userFormSchema, type UserFormData } from '../store/users/schema'
import type { UserWithId } from '../store/users/types'

type EditUserModalProps = {
  user: UserWithId | null
  onClose: () => void
}

export function EditUserModal({ user, onClose }: EditUserModalProps) {
  const { isUpdating, updateUser } = useUserActions()
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      github: user?.github ?? ''
    }
  })

  useEffect(() => {
    if (!user) return

    reset({
      name: user.name,
      email: user.email,
      github: user.github
    })
  }, [reset, user])

  if (!user) return null

  const onSubmit = async (data: UserFormData) => {
    try {
      await updateUser({
        id: user.id,
        ...data
      })
      onClose()
    } catch {
      // Error handled by the RTK Query error middleware
    }
  }

  const isButtonDisabled = isUpdating || isSubmitting

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <section
        aria-labelledby="edit-user-title"
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-xl"
      >
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-purple-600">
              Edición
            </span>
            <h2 id="edit-user-title" className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
              Editar usuario
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Actualiza los datos principales de {user.name}.
            </p>
          </div>

          <button
            type="button"
            aria-label="Cerrar modal de edición"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label htmlFor="edit-name" className="mb-2 block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="edit-name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'edit-name-error' : undefined}
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              {...register('name')}
            />
            {errors.name && (
              <p id="edit-name-error" className="mt-2 text-sm text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="edit-email" className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="edit-email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'edit-email-error' : undefined}
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              {...register('email')}
            />
            {errors.email && (
              <p id="edit-email-error" className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="edit-github" className="mb-2 block text-sm font-medium text-gray-700">
              Usuario de GitHub
            </label>
            <input
              type="text"
              id="edit-github"
              aria-invalid={Boolean(errors.github)}
              aria-describedby={errors.github ? 'edit-github-error' : undefined}
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              {...register('github')}
            />
            {errors.github && (
              <p id="edit-github-error" className="mt-2 text-sm text-red-600">
                {errors.github.message}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isButtonDisabled}
              className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isButtonDisabled ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
