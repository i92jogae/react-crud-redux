import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const DEFAULT_STATE = [
  {
    id: '1',
    name: 'Enrique Pérez',
    email: 'miguel@gmail.com',
    github: 'miguel'
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
export type UserId = string

export interface User {
  name: string;
  email: string;
  github: string;
}

export interface UserWithId extends User {
  id: UserId
}

const initialState: UserWithId[] = (() => {
  const persistedState = localStorage.getItem("_redux_state_")
  if (persistedState) {
    return JSON.parse(persistedState).users
  }
  return DEFAULT_STATE
})()

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addNewUser: (state, action: PayloadAction<User>) => {
      const id = crypto.randomUUID()
      state.push({ id, ...action.payload}) // Redux allows you to update the state without needing to return a new one, in a very simple way.
    },
    deleteUserById: (state, action: PayloadAction<UserId>) => {
      const id = action.payload;
      return state.filter((user) => user.id !== id);
    },
    rollbackUser: (state, action: PayloadAction<UserWithId>) => {
      const isUserAlreadyDefined = state.some(user => user.id === action.payload.id)
      if (!isUserAlreadyDefined) {
        state.push(action.payload)
      }
    }
  },
})

export default usersSlice.reducer

export const { deleteUserById, addNewUser, rollbackUser } = usersSlice.actions