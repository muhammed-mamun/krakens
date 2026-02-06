import type { ApiResponse, ModerationStrategy, CreateModerationStrategyRequest, UpdateModerationStrategyRequest } from '@/types/api'

// Mock data
let mockStrategies: ModerationStrategy[] = [
    {
        id: 1,
        name: 'Keyword Filter',
        type: 'keyword',
        enabled: true,
        priority: 1,
        config: {
            keywords: ['spam', 'buy now', 'click here', 'free money'],
            action: 'reject',
            case_sensitive: false,
        },
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 2,
        name: 'Auto Approve Verified Users',
        type: 'auto_approve',
        enabled: true,
        priority: 2,
        config: {
            min_account_age_days: 30,
            min_approved_comments: 5,
        },
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 3,
        name: 'AI Content Moderation',
        type: 'ai',
        enabled: false,
        priority: 3,
        config: {
            model: 'openai-moderation',
            threshold: 0.7,
            categories: ['hate', 'violence', 'sexual'],
        },
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 4,
        name: 'Manual Review Queue',
        type: 'manual',
        enabled: true,
        priority: 4,
        config: {
            require_review_for_new_users: true,
            require_review_for_links: true,
        },
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const moderationMockService = {
    async getStrategies(): Promise<ApiResponse<ModerationStrategy[]>> {
        await delay(500)

        return {
            status: true,
            message: 'Strategies retrieved successfully',
            data: [...mockStrategies].sort((a, b) => a.priority - b.priority),
        }
    },

    async getStrategyById(id: number): Promise<ApiResponse<ModerationStrategy>> {
        await delay(300)

        const strategy = mockStrategies.find(s => s.id === id)

        if (!strategy) {
            throw new Error('Strategy not found')
        }

        return {
            status: true,
            message: 'Strategy retrieved successfully',
            data: strategy,
        }
    },

    async createStrategy(data: CreateModerationStrategyRequest): Promise<ApiResponse<ModerationStrategy>> {
        await delay(500)

        const newStrategy: ModerationStrategy = {
            id: Date.now(),
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        mockStrategies.push(newStrategy)

        return {
            status: true,
            message: 'Strategy created successfully',
            data: newStrategy,
        }
    },

    async updateStrategy(id: number, data: UpdateModerationStrategyRequest): Promise<ApiResponse<ModerationStrategy>> {
        await delay(500)

        const index = mockStrategies.findIndex(s => s.id === id)

        if (index === -1) {
            throw new Error('Strategy not found')
        }

        mockStrategies[index] = {
            ...mockStrategies[index],
            ...data,
            updated_at: new Date().toISOString(),
        }

        return {
            status: true,
            message: 'Strategy updated successfully',
            data: mockStrategies[index],
        }
    },

    async deleteStrategy(id: number): Promise<ApiResponse<null>> {
        await delay(500)

        mockStrategies = mockStrategies.filter(s => s.id !== id)

        return {
            status: true,
            message: 'Strategy deleted successfully',
            data: null,
        }
    },

    async toggleStrategy(id: number, enabled: boolean): Promise<ApiResponse<ModerationStrategy>> {
        await delay(500)

        const index = mockStrategies.findIndex(s => s.id === id)

        if (index === -1) {
            throw new Error('Strategy not found')
        }

        mockStrategies[index].enabled = enabled
        mockStrategies[index].updated_at = new Date().toISOString()

        return {
            status: true,
            message: `Strategy ${enabled ? 'enabled' : 'disabled'} successfully`,
            data: mockStrategies[index],
        }
    },
}
