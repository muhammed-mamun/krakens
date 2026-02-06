import { ref } from 'vue'

export function useAsync<T = any>() {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const data = ref<T | null>(null)

    const execute = async (fn: () => Promise<T>) => {
        loading.value = true
        error.value = null
        try {
            data.value = await fn()
            return data.value
        } catch (err: any) {
            error.value = err.message || 'An error occurred'
            throw err
        } finally {
            loading.value = false
        }
    }

    const reset = () => {
        loading.value = false
        error.value = null
        data.value = null
    }

    return {
        loading,
        error,
        data,
        execute,
        reset
    }
}
