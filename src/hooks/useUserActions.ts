import { toast } from 'sonner'
import {
  useAddUserMutation,
  useDeleteUserMutation,
  useResetUsersMutation,
  useUpdateUserMutation
} from '../store/users/api'
import type { User, UserId, UserWithId } from '../store/users/types'

export const useUserActions = () => {
  const [createUser, { isLoading: isCreating }] = useAddUserMutation()
  const [editUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()
  const [resetUsers, { isLoading: isResetting }] = useResetUsersMutation()

  const addUser = async (user: User) => {
    const createdUser = await createUser(user).unwrap()

    toast.success(`Usuario ${createdUser.name} creado correctamente`)
  }

  const updateUser = async (user: UserWithId) => {
    const updatedUser = await editUser(user).unwrap()

    toast.success(`Usuario ${updatedUser.name} actualizado correctamente`)
  }

  const removeUser = async (id: UserId) => {
    await deleteUser(id).unwrap()

    toast.success('Usuario eliminado correctamente')
  }

  const resetDemoData = async () => {
    await resetUsers().unwrap()

    toast.success('Datos de demo restaurados')
  }

  return {
    addUser,
    updateUser,
    removeUser,
    resetDemoData,
    isCreating,
    isUpdating,
    isDeleting,
    isResetting
  }
}
