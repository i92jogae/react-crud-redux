import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { saveUsersToLocalStorage } from '../store/users/storage'
import type { UserWithId } from '../store/users/types'
import { renderWithProviders } from '../test/test-utils'
import { ListOfUsers } from './ListOfUsers'

const users: UserWithId[] = [
  {
    id: '1',
    name: 'Ana López',
    email: 'ana@test.com',
    github: 'ana'
  },
  {
    id: '2',
    name: 'Laura García',
    email: 'laura@test.com',
    github: 'laura'
  }
]

describe('ListOfUsers', () => {
  beforeEach(() => {
    localStorage.clear()
    saveUsersToLocalStorage(users)
  })

  it('renders users from the API cache', async () => {
    renderWithProviders(<ListOfUsers />)

    expect(screen.getByText(/cargando usuarios/i)).toBeInTheDocument()
    expect(await screen.findByText('Ana López')).toBeInTheDocument()
    expect(screen.getByText('Laura García')).toBeInTheDocument()
  })

  it('filters users by search term', async () => {
    const user = userEvent.setup()

    renderWithProviders(<ListOfUsers />)

    await screen.findByText('Ana López')
    await user.type(screen.getByLabelText(/buscar usuarios/i), 'laura')

    expect(screen.getByText('Laura García')).toBeInTheDocument()
    expect(screen.queryByText('Ana López')).not.toBeInTheDocument()
  })

  it('deletes a user after confirmation', async () => {
    const user = userEvent.setup()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderWithProviders(<ListOfUsers />)

    await screen.findByText('Ana López')
    await user.click(screen.getByRole('button', { name: /eliminar usuario ana lópez/i }))

    await waitFor(() => {
      expect(screen.queryByText('Ana López')).not.toBeInTheDocument()
    })

    confirmSpy.mockRestore()
  })
})
