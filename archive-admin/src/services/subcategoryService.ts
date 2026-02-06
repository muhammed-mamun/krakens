import { api } from './api'
import type {
    ApiResponse,
    Subcategory,
    CreateSubcategoryRequest,
    UpdateSubcategoryRequest,
} from '@/types/api'

export const subcategoryService = {
    /**
     * Get all subcategories or by parent ID
     */
    async getSubcategories(parentId?: number): Promise<ApiResponse<Subcategory[]>> {
        const params = parentId ? { parent_id: parentId } : undefined
        const response = await api.get<ApiResponse<Subcategory[]>>('/sub-categories', { params })
        return response.data
    },

    /**
     * Get subcategory by ID
     */
    async getSubcategoryById(id: number): Promise<ApiResponse<Subcategory>> {
        const response = await api.get<ApiResponse<Subcategory>>(`/sub-categories/${id}`)
        return response.data
    },

    /**
     * Create a new subcategory
     */
    async createSubcategory(data: CreateSubcategoryRequest): Promise<ApiResponse<null>> {
        const response = await api.post<ApiResponse<null>>('/sub-categories', data)
        return response.data
    },

    /**
     * Update subcategory
     */
    async updateSubcategory(
        id: number,
        data: UpdateSubcategoryRequest,
    ): Promise<ApiResponse<null>> {
        const response = await api.put<ApiResponse<null>>(`/sub-categories/${id}`, data)
        return response.data
    },

    /**
     * Delete subcategory
     */
    async deleteSubcategory(id: number): Promise<ApiResponse<null>> {
        const response = await api.delete<ApiResponse<null>>(`/sub-categories/${id}`)
        return response.data
    },
}
