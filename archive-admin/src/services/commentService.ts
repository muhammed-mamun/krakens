import { api } from './api'
import { commentMockService } from './mocks/commentMock'
import { API_CONFIG } from '@/config/api.config'
import type {
    ApiResponse,
    Comment,
    UpdateCommentRequest,
} from '@/types/api'

export const commentService = {
    async getComments(params?: { post_id?: number; status?: string; limit?: number; offset?: number }): Promise<ApiResponse<Comment[]>> {
        if (API_CONFIG.USE_MOCK_COMMENTS) return commentMockService.getComments(params)
        const response = await api.get<ApiResponse<Comment[]>>('/comments', { params })
        return response.data
    },

    async getCommentById(id: number): Promise<ApiResponse<Comment>> {
        if (API_CONFIG.USE_MOCK_COMMENTS) return commentMockService.getCommentById(id)
        const response = await api.get<ApiResponse<Comment>>(`/comments/${id}`)
        return response.data
    },

    async updateComment(id: number, data: UpdateCommentRequest): Promise<ApiResponse<Comment>> {
        if (API_CONFIG.USE_MOCK_COMMENTS) return commentMockService.updateComment(id, data)
        const response = await api.put<ApiResponse<Comment>>(`/comments/${id}`, data)
        return response.data
    },

    async deleteComment(id: number): Promise<ApiResponse<null>> {
        if (API_CONFIG.USE_MOCK_COMMENTS) return commentMockService.deleteComment(id)
        const response = await api.delete<ApiResponse<null>>(`/comments/${id}`)
        return response.data
    },

    async approveComment(id: number): Promise<ApiResponse<Comment>> {
        if (API_CONFIG.USE_MOCK_COMMENTS) return commentMockService.approveComment(id)
        const response = await api.post<ApiResponse<Comment>>(`/comments/${id}/approve`)
        return response.data
    },

    async rejectComment(id: number, reason?: string): Promise<ApiResponse<Comment>> {
        if (API_CONFIG.USE_MOCK_COMMENTS) return commentMockService.rejectComment(id, reason)
        const response = await api.post<ApiResponse<Comment>>(`/comments/${id}/reject`, { reason })
        return response.data
    },

    async markAsSpam(id: number): Promise<ApiResponse<Comment>> {
        if (API_CONFIG.USE_MOCK_COMMENTS) return commentMockService.markAsSpam(id)
        const response = await api.post<ApiResponse<Comment>>(`/comments/${id}/spam`)
        return response.data
    }
}
