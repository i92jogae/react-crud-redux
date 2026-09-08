export type UserId = string

export interface User {
  name: string
  email: string
  github: string
}

export interface UserWithId extends User {
  id: UserId
}

export type SortBy = 'name' | 'email' | 'github'
export type SortDirection = 'asc' | 'desc'

export interface UsersUiState {
  search: string
  sortBy: SortBy
  sortDirection: SortDirection
}
