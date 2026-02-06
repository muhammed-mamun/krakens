import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { toast } from 'vue-sonner'
import { API_CONFIG } from '@/config/api.config'

// Create axios instance for Postal service
const postalClient: AxiosInstance = axios.create({
    baseURL: API_CONFIG.POSTAL_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor - Add auth token
postalClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth-token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

// Response interceptor - Handle errors
postalClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
    },
    async (error) => {
        if (error.response) {
            const status = error.response.status
            const message = error.response.data?.message || 'An error occurred'

            // Handle specific error codes
            switch (status) {
                case 401:
                    // Unauthorized - clear auth and redirect to login
                    if (window.location.pathname !== '/login') {
                        const { useAuthStore } = await import('@/stores/auth')
                        const authStore = useAuthStore()

                        authStore.user = null
                        localStorage.removeItem('auth-token')
                        localStorage.removeItem('user')

                        toast.error('Session expired', {
                            description: 'Please login again',
                        })

                        window.location.href = '/login'
                    }
                    break
                case 403:
                    toast.error('Access denied', {
                        description: 'You do not have permission to perform this action',
                    })
                    break
                case 404:
                    toast.error('Not found', {
                        description: message,
                    })
                    break
                case 500:
                    toast.error('Server error', {
                        description: 'Something went wrong on our end',
                    })
                    break
                default:
                    toast.error('Error', {
                        description: message,
                    })
            }
        } else if (error.request) {
            toast.error('Network error', {
                description: 'Please check your internet connection',
            })
        }

        return Promise.reject(error)
    },
)

// Generic API methods for Postal
export const postalApi = {
    get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return postalClient.get<T>(url, config)
    },

    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return postalClient.post<T>(url, data, config)
    },

    put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return postalClient.put<T>(url, data, config)
    },

    delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return postalClient.delete<T>(url, config)
    },

    patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return postalClient.patch<T>(url, data, config)
    },
}

export default postalClient
