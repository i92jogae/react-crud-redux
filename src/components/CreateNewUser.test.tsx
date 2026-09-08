import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderWithProviders } from '../test/test-utils'
import { getUsersFromLocalStorage } from '../store/users/storage'
import { CreateNewUser } from './CreateNewUser'

describe('CreateNewUser', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates a new user from valid form data', async () => {
    const user = userEvent.setup()

    renderWithProviders(<CreateNewUser />)

    await user.type(screen.getByLabelText(/nombre/i), 'Laura García')
    await user.type(screen.getByLabelText(/email/i), 'laura@test.com')
    await user.type(screen.getByLabelText(/usuario de github/i), 'laura')
    await user.click(screen.getByRole('button', { name: /crear usuario/i }))

    await waitFor(() => {
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
  })

  it('shows validation messages when submitted with invalid data', async () => {
    const user = userEvent.setup()

    renderWithProviders(<CreateNewUser />)

    await user.type(screen.getByLabelText(/email/i), 'invalid-email')
    await user.click(screen.getByRole('button', { name: /crear usuario/i }))

    expect(await screen.findByText(/el nombre debe tener al menos 2 caracteres/i)).toBeInTheDocument()
    expect(screen.getByText(/introduce un email válido/i)).toBeInTheDocument()
    expect(screen.getByText(/el usuario de github debe tener al menos 2 caracteres/i)).toBeInTheDocument()
  })
})
