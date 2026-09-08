import { configureStore, type Middleware } from '@reduxjs/toolkit'
import usersReducer, { rollbackUser } from './users/slice'
import { toast } from 'sonner'

const persistanceLocalStorageMiddleware: Middleware = (store) => (next) => (action) => {
  next(action)
  localStorage.setItem("_redux_state_", JSON.stringify(store.getState()))
}

const syncWithDatabaseMiddleware: Middleware = store => next => action => {
  const { type, payload } = action
  const previousState = store.getState()
  console.log(action, 'state:', store.getState())
  next(action)

  console.log(action, 'state:', store.getState()) 

  // Optimistic UI update
  if (type === 'users/deleteUserById') { 
    const userToRemove = previousState.users.find(user => user.id === payload) 
    fetch(`https://jsonplaceholder.typicode.com/users/${payload}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) toast.success(`Usuario ${payload} eliminado correctamente`)
      })
      .catch((error) => {
        toast.error(`Error deleting user: ${error}`)
        if (userToRemove) store.dispatch(rollbackUser(userToRemove))
      })
  }

}
export const store = configureStore({
  reducer: {
    users: usersReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistanceLocalStorageMiddleware).concat(syncWithDatabaseMiddleware)
})

export type RootState = ReturnType<typeof store.getState> // We retrieve the store type we created
export type AppDispatch = typeof store.dispatch