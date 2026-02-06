import { api } from './api'
import { moderationMockService } from './mocks/moderationMock'
import { API_CONFIG } from '@/config/api.config'
import type {
    ApiResponse,
    ModerationStrategy,
    CreateModerationStrategyRequest,
    UpdateModerationStrategyRequest,
} from '@/types/api'

export const moderationService = {
    async getStrategies(): Promise<ApiResponse<ModerationStrategy[]>> {
        if (API_CONFIG.USE_MOCK_MODERATION) return moderationMockService.getStrategies()
        const response = await api.get<ApiResponse<ModerationStrategy[]>>('/moderation/strategies')
        return response.data
    },

    async getStrategyById(id: number): Promise<ApiResponse<ModerationStrategy>> {
        if (API_CONFIG.USE_MOCK_MODERATION) return moderationMockService.getStrategyById(id)
        const response = await api.get<ApiResponse<ModerationStrategy>>(`/moderation/strategies/${id}`)
        return response.data
    },

    async createStrategy(data: CreateModerationStrategyRequest): Promise<ApiResponse<ModerationStrategy>> {
        if (API_CONFIG.USE_MOCK_MODERATION) return moderationMockService.createStrategy(data)
        const response = await api.post<ApiResponse<ModerationStrategy>>('/moderation/strategies', data)
        return response.data
    },

    async updateStrategy(id: number, data: UpdateModerationStrategyRequest): Promise<ApiResponse<ModerationStrategy>> {
        if (API_CONFIG.USE_MOCK_MODERATION) return moderationMockService.updateStrategy(id, data)
        const response = await api.put<ApiResponse<ModerationStrategy>>(`/moderation/strategies/${id}`, data)
        return response.data
    },

    async deleteStrategy(id: number): Promise<ApiResponse<null>> {
        if (API_CONFIG.USE_MOCK_MODERATION) return moderationMockService.deleteStrategy(id)
        const response = await api.delete<ApiResponse<null>>(`/moderation/strategies/${id}`)
        return response.data
    },

    async toggleStrategy(id: number, enabled: boolean): Promise<ApiResponse<ModerationStrategy>> {
        if (API_CONFIG.USE_MOCK_MODERATION) return moderationMockService.toggleStrategy(id, enabled)
        const response = await api.patch<ApiResponse<ModerationStrategy>>(`/moderation/strategies/${id}/toggle`, { enabled })
        return response.data
    }
}
