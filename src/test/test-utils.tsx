 
import { render, type RenderOptions } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { usersApi } from '../store/users/api'
import usersUiReducer from '../store/users/slice'

export const setupTestStore = () =>
  configureStore({
    reducer: {
      usersUi: usersUiReducer,
      [usersApi.reducerPath]: usersApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(usersApi.middleware)
  })

type TestStore = ReturnType<typeof setupTestStore>

type ExtendedRenderOptions = Omit<RenderOptions, 'queries'> & {
  store?: TestStore
}

export const renderWithProviders = (
  ui: ReactElement,
  { store = setupTestStore(), ...renderOptions }: ExtendedRenderOptions = {}
) => ({
  store,
  ...render(<Provider store={store}>{ui}</Provider>, renderOptions)
})
