import type React from "react";
import { useUserActions } from "../hooks/useUserActions";

export function CreateNewUser() {
  const { addUser } = useUserActions();

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.target
    const formData = new FormData(form)

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const github = formData.get('github') as string

    addUser({ name, email, github })
    form.reset()
  }
  return (
    <section className="w-full  rounded-2xl border border-gray-200 bg-white p-6 mt-2 text-left shadow-sm">
      <header className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Crear nuevo usuario
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Añade un usuario a la lista rellenando sus datos.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Nombre
          </label>

          <input
            type="text"
            id="name"
            name="name"
            placeholder="Ej: Miguel Pérez"
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email
          </label>

          <input
            type="email"
            id="email"
            name="email"
            placeholder="ejemplo@email.com"
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            required
          />
        </div>

        <div>
          <label
            htmlFor="github"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Usuario de GitHub
          </label>

          <input
            type="text"
            id="github"
            name="github"
            placeholder="Ej: i92jogae"
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
        >
          Crear usuario
        </button>
      </form>
    </section>
  )
}