/**
 * Status Constants
 * Centralized status definitions
 */

export const CATEGORY_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    DELETED: 'deleted',
} as const

export const USER_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
} as const

export const USER_ROLES = {
    ADMIN: 'admin',
    EDITOR: 'editor',
    VIEWER: 'viewer',
} as const

export type CategoryStatus = typeof CATEGORY_STATUS[keyof typeof CATEGORY_STATUS]
export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS]
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

// Status display configurations
export const STATUS_CONFIG = {
    [CATEGORY_STATUS.PENDING]: {
        label: 'Pending',
        color: 'yellow',
        bgClass: 'bg-yellow-500',
        textClass: 'text-yellow-900',
    },
    [CATEGORY_STATUS.APPROVED]: {
        label: 'Approved',
        color: 'green',
        bgClass: 'bg-green-500',
        textClass: 'text-white',
    },
    [CATEGORY_STATUS.REJECTED]: {
        label: 'Rejected',
        color: 'red',
        bgClass: 'bg-red-500',
        textClass: 'text-white',
    },
    [CATEGORY_STATUS.DELETED]: {
        label: 'Deleted',
        color: 'gray',
        bgClass: 'bg-gray-500',
        textClass: 'text-white',
    },
} as const

export const ROLE_CONFIG = {
    [USER_ROLES.ADMIN]: {
        label: 'Administrator',
        color: 'purple',
        permissions: ['all'],
    },
    [USER_ROLES.EDITOR]: {
        label: 'Editor',
        color: 'blue',
        permissions: ['create', 'update', 'read'],
    },
    [USER_ROLES.VIEWER]: {
        label: 'Viewer',
        color: 'gray',
        permissions: ['read'],
    },
} as const
