import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { DEFAULT_USERS, getUsersFromLocalStorage, saveUsersToLocalStorage } from './storage'
import type { User, UserId, UserWithId } from './types'

type ApiError = {
  message: string
}

const API_DELAY = 350

const wait = () =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, API_DELAY)
  })

const normalize = (value: string) => value.trim().toLowerCase()
const getDefaultUsers = () => DEFAULT_USERS.map((user) => ({ ...user }))

const findDuplicatedUser = (users: UserWithId[], user: User, currentUserId?: UserId) => {
  const email = normalize(user.email)
  const github = normalize(user.github)

  return users.find(
    (storedUser) =>
      storedUser.id !== currentUserId &&
      (normalize(storedUser.email) === email || normalize(storedUser.github) === github)
  )
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fakeBaseQuery<ApiError>(),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query<UserWithId[], void>({
      async queryFn() {
        await wait()

        return {
          data: getUsersFromLocalStorage()
        }
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Users', id: 'LIST' },
              ...result.map(({ id }) => ({ type: 'Users' as const, id }))
            ]
          : [{ type: 'Users', id: 'LIST' }]
    }),

    addUser: builder.mutation<UserWithId, User>({
      async queryFn(user) {
        await wait()

        const users = getUsersFromLocalStorage()
        const duplicatedUser = findDuplicatedUser(users, user)

        if (duplicatedUser) {
          return {
            error: {
              message: 'Ya existe un usuario con ese email o usuario de GitHub'
            }
          }
        }

        const newUser: UserWithId = {
          id: crypto.randomUUID(),
          ...user
        }

        saveUsersToLocalStorage([...users, newUser])

        return {
          data: newUser
        }
      },
      invalidatesTags: [{ type: 'Users', id: 'LIST' }]
    }),

    updateUser: builder.mutation<UserWithId, UserWithId>({
      async queryFn(userToUpdate) {
        await wait()

        const users = getUsersFromLocalStorage()
        const userExists = users.some((user) => user.id === userToUpdate.id)

        if (!userExists) {
          return {
            error: {
              message: 'No se ha encontrado el usuario que quieres editar'
            }
          }
        }

        const duplicatedUser = findDuplicatedUser(users, userToUpdate, userToUpdate.id)

        if (duplicatedUser) {
          return {
            error: {
              message: 'Ya existe otro usuario con ese email o usuario de GitHub'
            }
          }
        }

        const updatedUsers = users.map((user) =>
          user.id === userToUpdate.id ? userToUpdate : user
        )

        saveUsersToLocalStorage(updatedUsers)

        return {
          data: userToUpdate
        }
      },
      async onQueryStarted(userToUpdate, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
            const userIndex = draft.findIndex((user) => user.id === userToUpdate.id)

            if (userIndex !== -1) {
              draft[userIndex] = userToUpdate
            }
          })
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (_result, _error, user) => [{ type: 'Users', id: user.id }]
    }),

    deleteUser: builder.mutation<{ id: UserId }, UserId>({
      async queryFn(id) {
        await wait()

        const users = getUsersFromLocalStorage()
        const userExists = users.some((user) => user.id === id)

        if (!userExists) {
          return {
            error: {
              message: 'No se ha encontrado el usuario que quieres eliminar'
            }
          }
        }

        saveUsersToLocalStorage(users.filter((user) => user.id !== id))

        return {
          data: { id }
        }
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
            const userIndex = draft.findIndex((user) => user.id === id)

            if (userIndex !== -1) {
              draft.splice(userIndex, 1)
            }
          })
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' }
      ]
    }),

    resetUsers: builder.mutation<UserWithId[], void>({
      async queryFn() {
        await wait()

        const defaultUsers = getDefaultUsers()
        saveUsersToLocalStorage(defaultUsers)

        return {
          data: defaultUsers
        }
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
            draft.splice(0, draft.length, ...getDefaultUsers())
          })
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: [{ type: 'Users', id: 'LIST' }]
    })
  })
})

export const {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useResetUsersMutation,
  useUpdateUserMutation
} = usersApi
