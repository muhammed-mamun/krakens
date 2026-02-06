import { api } from './api'
import { supportMockService } from './mocks/supportMock'
import { API_CONFIG } from '@/config/api.config'
import type {
    ApiResponse,
    SupportTicket,
    UpdateSupportTicketRequest,
    SupportTicketReply,
    CreateSupportTicketReplyRequest,
} from '@/types/api'

export const supportService = {
    async getTickets(params?: { status?: string; priority?: string; limit?: number; offset?: number }): Promise<ApiResponse<SupportTicket[]>> {
        if (API_CONFIG.USE_MOCK_SUPPORT) return supportMockService.getTickets(params)
        const response = await api.get<ApiResponse<SupportTicket[]>>('/support/tickets', { params })
        return response.data
    },

    async getTicketById(id: number): Promise<ApiResponse<SupportTicket>> {
        if (API_CONFIG.USE_MOCK_SUPPORT) return supportMockService.getTicketById(id)
        const response = await api.get<ApiResponse<SupportTicket>>(`/support/tickets/${id}`)
        return response.data
    },

    async updateTicket(id: number, data: UpdateSupportTicketRequest): Promise<ApiResponse<SupportTicket>> {
        if (API_CONFIG.USE_MOCK_SUPPORT) return supportMockService.updateTicket(id, data)
        const response = await api.put<ApiResponse<SupportTicket>>(`/support/tickets/${id}`, data)
        return response.data
    },

    async getReplies(ticketId: number): Promise<ApiResponse<SupportTicketReply[]>> {
        if (API_CONFIG.USE_MOCK_SUPPORT) return supportMockService.getReplies(ticketId)
        const response = await api.get<ApiResponse<SupportTicketReply[]>>(`/support/tickets/${ticketId}/replies`)
        return response.data
    },

    async createReply(data: CreateSupportTicketReplyRequest): Promise<ApiResponse<SupportTicketReply>> {
        if (API_CONFIG.USE_MOCK_SUPPORT) return supportMockService.createReply(data)
        const response = await api.post<ApiResponse<SupportTicketReply>>('/support/replies', data)
        return response.data
    },

    async assignTicket(id: number, userId: number): Promise<ApiResponse<SupportTicket>> {
        if (API_CONFIG.USE_MOCK_SUPPORT) return supportMockService.assignTicket(id, userId)
        const response = await api.post<ApiResponse<SupportTicket>>(`/support/tickets/${id}/assign`, { user_id: userId })
        return response.data
    },

    async closeTicket(id: number): Promise<ApiResponse<SupportTicket>> {
        if (API_CONFIG.USE_MOCK_SUPPORT) return supportMockService.closeTicket(id)
        const response = await api.post<ApiResponse<SupportTicket>>(`/support/tickets/${id}/close`)
        return response.data
    }
}
