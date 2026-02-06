/**
 * UI Messages Constants
 * Centralized user-facing messages
 */

export const MESSAGES = {
    // Success messages
    SUCCESS: {
        LOGIN: 'Welcome back!',
        LOGOUT: 'Logged out successfully',
        REGISTER: 'Account created successfully',
        CATEGORY_CREATED: 'Category created successfully',
        CATEGORY_UPDATED: 'Category updated successfully',
        CATEGORY_DELETED: 'Category deleted successfully',
        SUBCATEGORY_CREATED: 'Subcategory created successfully',
        SUBCATEGORY_UPDATED: 'Subcategory updated successfully',
        SUBCATEGORY_DELETED: 'Subcategory deleted successfully',
        PROFILE_UPDATED: 'Profile updated successfully',
        PASSWORD_CHANGED: 'Password changed successfully',
    },

    // Error messages
    ERROR: {
        GENERIC: 'Something went wrong. Please try again.',
        NETWORK: 'Network error. Please check your connection.',
        UNAUTHORIZED: 'You are not authorized to perform this action.',
        SESSION_EXPIRED: 'Your session has expired. Please login again.',
        INVALID_CREDENTIALS: 'Invalid email or password.',
        VALIDATION_FAILED: 'Please check your input and try again.',
        NOT_FOUND: 'The requested resource was not found.',
        SERVER_ERROR: 'Server error. Please try again later.',
    },

    // Confirmation messages
    CONFIRM: {
        DELETE_CATEGORY: 'Are you sure you want to delete this category?',
        DELETE_SUBCATEGORY: 'Are you sure you want to delete this subcategory?',
        LOGOUT: 'Are you sure you want to logout?',
        DISCARD_CHANGES: 'You have unsaved changes. Are you sure you want to leave?',
    },

    // Loading messages
    LOADING: {
        PLEASE_WAIT: 'Please wait...',
        LOADING: 'Loading...',
        SAVING: 'Saving...',
        DELETING: 'Deleting...',
        PROCESSING: 'Processing...',
    },

    // Empty states
    EMPTY: {
        NO_CATEGORIES: 'No categories found',
        NO_SUBCATEGORIES: 'No subcategories found',
        NO_RESULTS: 'No results found',
        NO_DATA: 'No data available',
    },
} as const

export type Messages = typeof MESSAGES
