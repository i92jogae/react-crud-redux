import { describe, expect, it, beforeEach } from 'vitest'
import { setupTestStore } from '../../test/test-utils'
import { usersApi } from './api'
import { getUsersFromLocalStorage, saveUsersToLocalStorage } from './storage'
import type { UserWithId } from './types'

const users: UserWithId[] = [
  {
    id: '1',
    name: 'Ana López',
    email: 'ana@test.com',
    github: 'ana'
  },
  {
    id: '2',
    name: 'Carlos Ruiz',
    email: 'carlos@test.com',
    github: 'carlos'
  }
]

describe('usersApi', () => {
  beforeEach(() => {
    localStorage.clear()
    saveUsersToLocalStorage(users)
  })

  it('gets users from the simulated API', async () => {
    const store = setupTestStore()

    const result = await store.dispatch(usersApi.endpoints.getUsers.initiate()).unwrap()

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Ana López')
  })

  it('creates a user and persists it', async () => {
    const store = setupTestStore()

    await store.dispatch(
      usersApi.endpoints.addUser.initiate({
        name: 'Laura García',
        email: 'laura@test.com',
        github: 'laura'
      })
    ).unwrap()

    expect(getUsersFromLocalStorage()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Laura García',
          email: 'laura@test.com',
          github: 'laura'
        })
      ])
    )
  })

  it('updates a user', async () => {
    const store = setupTestStore()

    await store.dispatch(
      usersApi.endpoints.updateUser.initiate({
        id: '1',
        name: 'Ana López Updated',
        email: 'ana.updated@test.com',
        github: 'ana-updated'
      })
    ).unwrap()

    expect(getUsersFromLocalStorage()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '1',
          name: 'Ana López Updated'
        })
      ])
    )
  })

  it('deletes a user', async () => {
    const store = setupTestStore()

    await store.dispatch(usersApi.endpoints.deleteUser.initiate('1')).unwrap()

    expect(getUsersFromLocalStorage()).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: '1' })])
    )
  })
})
