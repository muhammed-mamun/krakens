/**
 * useConfirm Composable
 * Provides a programmatic way to show confirmation dialogs
 * Replaces browser's confirm() with custom modal
 */

import { ref } from 'vue'

interface ConfirmOptions {
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'warning' | 'info'
}

interface ConfirmState {
    isOpen: boolean
    title: string
    message: string
    confirmText: string
    cancelText: string
    type: 'danger' | 'warning' | 'info'
    resolve: ((value: boolean) => void) | null
}

const state = ref<ConfirmState>({
    isOpen: false,
    title: 'Confirm Action',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'warning',
    resolve: null,
})

export function useConfirm() {
    const confirm = (options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            state.value = {
                isOpen: true,
                title: options.title || 'Confirm Action',
                message: options.message,
                confirmText: options.confirmText || 'Confirm',
                cancelText: options.cancelText || 'Cancel',
                type: options.type || 'warning',
                resolve,
            }
        })
    }

    const handleConfirm = () => {
        if (state.value.resolve) {
            state.value.resolve(true)
        }
        state.value.isOpen = false
        state.value.resolve = null
    }

    const handleCancel = () => {
        if (state.value.resolve) {
            state.value.resolve(false)
        }
        state.value.isOpen = false
        state.value.resolve = null
    }

    return {
        state,
        confirm,
        handleConfirm,
        handleCancel,
    }
}
