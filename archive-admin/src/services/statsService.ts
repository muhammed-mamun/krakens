import { api } from './api'
import { postalApi } from './postalApi'
import type { ApiResponse } from '@/types/api'

export interface DashboardStats {
    categories: number
    subcategories: number
    posts: number
    publishedPosts: number
    draftPosts: number
    archivedPosts: number
    pendingComments: number
    openTickets: number
}

export interface StatsResponse {
    total: number
    published?: number
    draft?: number
    archived?: number
    pending?: number
}

export const statsService = {
    /**
     * Get comprehensive dashboard statistics
     */
    async getDashboardStats(): Promise<DashboardStats> {
        try {
            // Fetch all data in parallel
            const [categoriesRes, subcategoriesRes, postsRes] = await Promise.all([
                api.get<ApiResponse<any[]>>('/categories'),
                api.get<ApiResponse<any[]>>('/sub-categories'),
                postalApi.get<ApiResponse<any[]>>('/posts'),
            ])

            const categories = categoriesRes.data.data || []
            const subcategories = subcategoriesRes.data.data || []
            const posts = postsRes.data.data || []

            // Calculate post statistics
            const publishedPosts = posts.filter((p: any) => p.status === 'published').length
            const draftPosts = posts.filter((p: any) => p.status === 'draft').length
            const archivedPosts = posts.filter((p: any) => p.status === 'archived').length

            return {
                categories: categories.length,
                subcategories: subcategories.length,
                posts: posts.length,
                publishedPosts,
                draftPosts,
                archivedPosts,
                pendingComments: 0, // TODO: Implement when comment API is ready
                openTickets: 0, // TODO: Implement when support API is ready
            }
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error)
            // Return zeros on error
            return {
                categories: 0,
                subcategories: 0,
                posts: 0,
                publishedPosts: 0,
                draftPosts: 0,
                archivedPosts: 0,
                pendingComments: 0,
                openTickets: 0,
            }
        }
    },

    /**
     * Get category count
     */
    async getCategoryCount(): Promise<number> {
        try {
            const response = await api.get<ApiResponse<any[]>>('/categories')
            return response.data.data?.length || 0
        } catch (error) {
            console.error('Failed to fetch category count:', error)
            return 0
        }
    },

    /**
     * Get subcategory count
     */
    async getSubcategoryCount(): Promise<number> {
        try {
            const response = await api.get<ApiResponse<any[]>>('/sub-categories')
            return response.data.data?.length || 0
        } catch (error) {
            console.error('Failed to fetch subcategory count:', error)
            return 0
        }
    },

    /**
     * Get post statistics
     */
    async getPostStats(): Promise<StatsResponse> {
        try {
            const response = await postalApi.get<ApiResponse<any[]>>('/posts')
            const posts = response.data.data || []

            return {
                total: posts.length,
                published: posts.filter((p: any) => p.status === 'published').length,
                draft: posts.filter((p: any) => p.status === 'draft').length,
                archived: posts.filter((p: any) => p.status === 'archived').length,
            }
        } catch (error) {
            console.error('Failed to fetch post stats:', error)
            return {
                total: 0,
                published: 0,
                draft: 0,
                archived: 0,
            }
        }
    },
}
