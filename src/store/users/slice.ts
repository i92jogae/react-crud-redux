import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { loadUsersUiState } from './storage'
import type { SortBy, UsersUiState } from './types'

const initialState: UsersUiState = loadUsersUiState()

export const usersSlice = createSlice({
  name: 'usersUi',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    setSortBy: (state, action: PayloadAction<SortBy>) => {
      if (state.sortBy === action.payload) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'
        return
      }

      state.sortBy = action.payload
      state.sortDirection = 'asc'
    },
    toggleSortDirection: (state) => {
      state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'
    },
    resetFilters: () => loadUsersUiState()
  }
})

export const { resetFilters, setSearch, setSortBy, toggleSortDirection } = usersSlice.actions

export default usersSlice.reducer
