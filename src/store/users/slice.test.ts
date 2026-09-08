import { describe, expect, it } from 'vitest'
import reducer, { resetFilters, setSearch, setSortBy, toggleSortDirection } from './slice'
import { DEFAULT_USERS_UI_STATE } from './storage'
import type { UsersUiState } from './types'

describe('users UI slice', () => {
  it('updates the search term', () => {
    const state = reducer(DEFAULT_USERS_UI_STATE, setSearch('miguel'))

    expect(state.search).toBe('miguel')
  })

  it('changes the sort field and resets direction to ascending', () => {
    const initialState: UsersUiState = {
      search: '',
      sortBy: 'name',
      sortDirection: 'desc'
    }

    const state = reducer(initialState, setSortBy('email'))

    expect(state.sortBy).toBe('email')
    expect(state.sortDirection).toBe('asc')
  })

  it('toggles sort direction when selecting the same field', () => {
    const state = reducer(DEFAULT_USERS_UI_STATE, setSortBy('name'))

    expect(state.sortDirection).toBe('desc')
  })

  it('toggles the sort direction manually', () => {
    const state = reducer(DEFAULT_USERS_UI_STATE, toggleSortDirection())

    expect(state.sortDirection).toBe('desc')
  })

  it('resets persisted filters', () => {
    const initialState: UsersUiState = {
      search: 'juan',
      sortBy: 'github',
      sortDirection: 'desc'
    }

    const state = reducer(initialState, resetFilters())

    expect(state).toEqual(DEFAULT_USERS_UI_STATE)
  })
})
