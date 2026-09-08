import type { UserWithId, UsersUiState } from './types'

export const USERS_STORAGE_KEY = 'react_crud_redux_users'
export const USERS_UI_STORAGE_KEY = 'react_crud_redux_users_ui'
const LEGACY_REDUX_STORAGE_KEY = '_redux_state_'

export const DEFAULT_USERS: UserWithId[] = [
  {
    id: '1',
    name: 'Enrique Pérez',
    email: 'enrique@gmail.com',
    github: 'i92jogae'
  },
  {
    id: '2',
    name: 'Pablo Pérez',
    email: 'pablo@gmail.com',
    github: 'pablo'
  },
  {
    id: '3',
    name: 'Juan Robles',
    email: 'juanrobles@gmail.com',
    github: 'juan'
  }
]

export const DEFAULT_USERS_UI_STATE: UsersUiState = {
  search: '',
  sortBy: 'name',
  sortDirection: 'asc'
}

const isUserWithId = (value: unknown): value is UserWithId => {
  if (typeof value !== 'object' || value === null) return false

  const user = value as Record<string, unknown>

  return (
    typeof user.id === 'string' &&
    typeof user.name === 'string' &&
    typeof user.email === 'string' &&
    typeof user.github === 'string'
  )
}

const isUsersUiState = (value: unknown): value is UsersUiState => {
  if (typeof value !== 'object' || value === null) return false

  const state = value as Record<string, unknown>

  return (
    typeof state.search === 'string' &&
    (state.sortBy === 'name' || state.sortBy === 'email' || state.sortBy === 'github') &&
    (state.sortDirection === 'asc' || state.sortDirection === 'desc')
  )
}

const cloneDefaultUsers = () => DEFAULT_USERS.map((user) => ({ ...user }))

export const getUsersFromLocalStorage = (): UserWithId[] => {
  try {
    const persistedUsers = localStorage.getItem(USERS_STORAGE_KEY)

    if (persistedUsers) {
      const parsedUsers: unknown = JSON.parse(persistedUsers)

      if (Array.isArray(parsedUsers) && parsedUsers.every(isUserWithId)) {
        return parsedUsers
      }
    }

    const legacyState = localStorage.getItem(LEGACY_REDUX_STORAGE_KEY)

    if (legacyState) {
      const parsedLegacyState: unknown = JSON.parse(legacyState)

      if (
        typeof parsedLegacyState === 'object' &&
        parsedLegacyState !== null &&
        'users' in parsedLegacyState &&
        Array.isArray(parsedLegacyState.users) &&
        parsedLegacyState.users.every(isUserWithId)
      ) {
        saveUsersToLocalStorage(parsedLegacyState.users)
        localStorage.removeItem(LEGACY_REDUX_STORAGE_KEY)

        return parsedLegacyState.users
      }
    }
  } catch {
    localStorage.removeItem(USERS_STORAGE_KEY)
  }

  const defaultUsers = cloneDefaultUsers()
  saveUsersToLocalStorage(defaultUsers)

  return defaultUsers
}

export const saveUsersToLocalStorage = (users: UserWithId[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export const loadUsersUiState = (): UsersUiState => {
  try {
    const persistedUiState = localStorage.getItem(USERS_UI_STORAGE_KEY)

    if (!persistedUiState) return DEFAULT_USERS_UI_STATE

    const parsedUiState: unknown = JSON.parse(persistedUiState)

    if (isUsersUiState(parsedUiState)) {
      return parsedUiState
    }
  } catch {
    localStorage.removeItem(USERS_UI_STORAGE_KEY)
  }

  return DEFAULT_USERS_UI_STATE
}

export const saveUsersUiState = (state: UsersUiState) => {
  localStorage.setItem(USERS_UI_STORAGE_KEY, JSON.stringify(state))
}
