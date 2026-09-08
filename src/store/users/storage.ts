import type { UserWithId, UsersUiState } from './types'

export const USERS_STORAGE_KEY = 'redux_users_dashboard_users_v2'
export const USERS_UI_STORAGE_KEY = 'redux_users_dashboard_ui_v2'

export const DEFAULT_USERS: UserWithId[] = [
  {
    id: '1',
    name: 'Ana López',
    email: 'ana.lopez@productflow.dev',
    github: 'analopezdev'
  },
  {
    id: '2',
    name: 'Carlos Vega',
    email: 'carlos.vega@productflow.dev',
    github: 'carlosvega'
  },
  {
    id: '3',
    name: 'Lucía Navarro',
    email: 'lucia.navarro@productflow.dev',
    github: 'lucianavarro'
  },
  {
    id: '4',
    name: 'Diego Martín',
    email: 'diego.martin@productflow.dev',
    github: 'diegomartindev'
  },
  {
    id: '5',
    name: 'Marta Ruiz',
    email: 'marta.ruiz@productflow.dev',
    github: 'martaruiz'
  },
  {
    id: '6',
    name: 'Álvaro Romero',
    email: 'alvaro.romero@productflow.dev',
    github: 'alvaroromero'
  },
  {
    id: '7',
    name: 'Sara Molina',
    email: 'sara.molina@productflow.dev',
    github: 'saramolina'
  },
  {
    id: '8',
    name: 'Javier Ortega',
    email: 'javier.ortega@productflow.dev',
    github: 'javierortega'
  }
]

export const DEFAULT_USERS_UI_STATE: UsersUiState = {
  search: '',
  sortBy: 'name',
  sortDirection: 'asc'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isUserWithId(value: unknown): value is UserWithId {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.email === 'string' &&
    typeof value.github === 'string'
  )
}

function isUsersUiState(value: unknown): value is UsersUiState {
  return (
    isRecord(value) &&
    typeof value.search === 'string' &&
    ['name', 'email', 'github'].includes(String(value.sortBy)) &&
    ['asc', 'desc'].includes(String(value.sortDirection))
  )
}

export function getUsersFromLocalStorage(): UserWithId[] {
  try {
    const persistedUsers = window.localStorage.getItem(USERS_STORAGE_KEY)

    if (persistedUsers) {
      const parsedUsers: unknown = JSON.parse(persistedUsers)

      if (Array.isArray(parsedUsers) && parsedUsers.every(isUserWithId)) {
        return parsedUsers
      }
    }

    const legacyState = window.localStorage.getItem('_redux_state_')

    if (legacyState) {
      const parsedLegacyState: unknown = JSON.parse(legacyState)

      if (isRecord(parsedLegacyState)) {
        const legacyUsers = parsedLegacyState.users

        if (Array.isArray(legacyUsers) && legacyUsers.every(isUserWithId)) {
          saveUsersToLocalStorage(legacyUsers)
          return legacyUsers
        }
      }
    }

    return DEFAULT_USERS.map((user) => ({ ...user }))
  } catch {
    return DEFAULT_USERS.map((user) => ({ ...user }))
  }
}

export function saveUsersToLocalStorage(users: UserWithId[]) {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export function loadUsersUiState(): UsersUiState {
  try {
    const persistedUiState = window.localStorage.getItem(USERS_UI_STORAGE_KEY)

    if (!persistedUiState) {
      return { ...DEFAULT_USERS_UI_STATE }
    }

    const parsedUiState: unknown = JSON.parse(persistedUiState)

    if (isUsersUiState(parsedUiState)) {
      return parsedUiState
    }

    return { ...DEFAULT_USERS_UI_STATE }
  } catch {
    return { ...DEFAULT_USERS_UI_STATE }
  }
}

export function saveUsersUiState(uiState: UsersUiState) {
  window.localStorage.setItem(USERS_UI_STORAGE_KEY, JSON.stringify(uiState))
}
