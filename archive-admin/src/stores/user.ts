import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userService } from '@/services'
import { useToast } from '@/composables/useToast'
import { MESSAGES } from '@/constants/messages'
import type { User, UpdateUserRequest, ChangePasswordRequest } from '@/types/api'

export const useUserStore = defineStore('user', () => {
    const profile = ref<User | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const toast = useToast()

    /**
     * Fetch user profile
     */
    const fetchProfile = async () => {
        try {
            loading.value = true
            error.value = null
            const response = await userService.getProfile()

            if (response.status && response.data) {
                profile.value = response.data
            }
        } catch (err: any) {
            error.value = err.message || MESSAGES.ERROR.GENERIC
            console.error('Fetch profile error:', err)
            toast.error('Error', error.value)
        } finally {
            loading.value = false
        }
    }

    /**
     * Update user profile
     */
    const updateProfile = async (data: UpdateUserRequest) => {
        try {
            loading.value = true
            error.value = null
            const response = await userService.updateProfile(data)

            if (response.status && response.data) {
                profile.value = response.data
                toast.success('Profile Updated', MESSAGES.SUCCESS.PROFILE_UPDATED)
            }
        } catch (err: any) {
            error.value = err.message || MESSAGES.ERROR.GENERIC
            console.error('Update profile error:', err)
            toast.error('Update Failed', err.response?.data?.message || MESSAGES.ERROR.GENERIC)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Change password
     */
    const changePassword = async (data: ChangePasswordRequest) => {
        try {
            loading.value = true
            error.value = null
            const response = await userService.changePassword(data)

            if (response.status) {
                toast.success('Password Changed', MESSAGES.SUCCESS.PASSWORD_CHANGED)
            }
        } catch (err: any) {
            error.value = err.message || MESSAGES.ERROR.GENERIC
            console.error('Change password error:', err)
            toast.error('Password Change Failed', err.response?.data?.message || MESSAGES.ERROR.GENERIC)
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        profile,
        loading,
        error,
        fetchProfile,
        updateProfile,
        changePassword,
    }
})
