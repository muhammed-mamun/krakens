/**
 * API Endpoints Constants
 * Centralized API endpoint definitions following DRY principle
 */

export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
    },

    // Users
    USERS: {
        PROFILE: '/users/profile',
        CHANGE_PASSWORD: '/users/change-password',
    },

    // Categories
    CATEGORIES: {
        LIST: '/categories',
        CREATE: '/categories',
        GET: (uuid: string) => `/categories/${uuid}`,
        UPDATE: (slug: string) => `/categories/${slug}`,
        DELETE: (uuid: string) => `/categories/${uuid}`,
    },

    // Subcategories
    SUBCATEGORIES: {
        LIST: '/sub-categories',
        CREATE: '/sub-categories',
        GET: (id: number) => `/sub-categories/${id}`,
        UPDATE: (id: number) => `/sub-categories/${id}`,
        DELETE: (id: number) => `/sub-categories/${id}`,
        BY_PARENT: (parentId: number) => `/sub-categories?parent_id=${parentId}`,
    },

    // Health
    HEALTH: '/hello',
} as const

export type ApiEndpoints = typeof API_ENDPOINTS
