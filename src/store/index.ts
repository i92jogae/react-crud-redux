import { configureStore, isRejectedWithValue, type Middleware } from '@reduxjs/toolkit'
import { toast } from 'sonner'
import { usersApi } from './users/api'
import usersUiReducer from './users/slice'
import { saveUsersUiState } from './users/storage'
import type { UsersUiState } from './users/types'

const getRejectedMessage = (payload: unknown) => {
  if (typeof payload === 'object' && payload !== null && 'message' in payload) {
    return String(payload.message)
  }

  return 'Ha ocurrido un error al sincronizar los usuarios'
}

const persistenceLocalStorageMiddleware: Middleware = (storeApi) => (next) => (action) => {
  const result = next(action)
  const state = storeApi.getState() as { usersUi: UsersUiState }

  saveUsersUiState(state.usersUi)

  return result
}

const rtkQueryErrorToastMiddleware: Middleware = () => (next) => (action) => {
  const result = next(action)

  if (isRejectedWithValue(action)) {
    toast.error(getRejectedMessage(action.payload))
  }

  return result
}

export const store = configureStore({
  reducer: {
    usersUi: usersUiReducer,
    [usersApi.reducerPath]: usersApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(usersApi.middleware)
      .concat(persistenceLocalStorageMiddleware)
      .concat(rtkQueryErrorToastMiddleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
