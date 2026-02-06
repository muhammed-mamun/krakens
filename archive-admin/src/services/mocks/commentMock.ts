import type { ApiResponse, Comment, UpdateCommentRequest } from '@/types/api'

// Mock data
let mockComments: Comment[] = [
    {
        id: 1,
        uuid: '019c249f-ea82-7e54-8195-00c4742a6f12',
        post_id: 1,
        user_id: 1,
        author_name: 'John Doe',
        author_email: 'john@example.com',
        content: 'Great article! Very informative and well-written.',
        status: 'pending',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 2,
        uuid: '019c249f-ea82-7e54-8195-00c4742a6f13',
        post_id: 1,
        author_name: 'Jane Smith',
        author_email: 'jane@example.com',
        content: 'Thanks for sharing this. I learned a lot from your post.',
        status: 'approved',
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 3,
        uuid: '019c249f-ea82-7e54-8195-00c4742a6f14',
        post_id: 2,
        author_name: 'Bob Wilson',
        author_email: 'bob@example.com',
        content: 'This is spam! Buy cheap products now!!!',
        status: 'pending',
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 4,
        uuid: '019c249f-ea82-7e54-8195-00c4742a6f15',
        post_id: 2,
        author_name: 'Alice Brown',
        author_email: 'alice@example.com',
        content: 'Could you elaborate more on this topic? I have some questions.',
        status: 'pending',
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
        id: 5,
        uuid: '019c249f-ea82-7e54-8195-00c4742a6f16',
        post_id: 3,
        author_name: 'Charlie Davis',
        author_email: 'charlie@example.com',
        content: 'Excellent work! Keep it up.',
        status: 'approved',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const commentMockService = {
    async getComments(params?: { post_id?: number; status?: string; limit?: number; offset?: number }): Promise<ApiResponse<Comment[]>> {
        await delay(500)

        let filtered = [...mockComments]

        if (params?.post_id) {
            filtered = filtered.filter(c => c.post_id === params.post_id)
        }

        if (params?.status) {
            filtered = filtered.filter(c => c.status === params.status)
        }

        if (params?.limit) {
            filtered = filtered.slice(params.offset || 0, (params.offset || 0) + params.limit)
        }

        return {
            status: true,
            message: 'Comments retrieved successfully',
            data: filtered,
        }
    },

    async getCommentById(id: number): Promise<ApiResponse<Comment>> {
        await delay(300)

        const comment = mockComments.find(c => c.id === id)

        if (!comment) {
            throw new Error('Comment not found')
        }

        return {
            status: true,
            message: 'Comment retrieved successfully',
            data: comment,
        }
    },

    async updateComment(id: number, data: UpdateCommentRequest): Promise<ApiResponse<Comment>> {
        await delay(500)

        const index = mockComments.findIndex(c => c.id === id)

        if (index === -1) {
            throw new Error('Comment not found')
        }

        mockComments[index] = {
            ...mockComments[index],
            ...data,
            updated_at: new Date().toISOString(),
        }

        return {
            status: true,
            message: 'Comment updated successfully',
            data: mockComments[index],
        }
    },

    async deleteComment(id: number): Promise<ApiResponse<null>> {
        await delay(500)

        mockComments = mockComments.filter(c => c.id !== id)

        return {
            status: true,
            message: 'Comment deleted successfully',
            data: null,
        }
    },

    async approveComment(id: number): Promise<ApiResponse<Comment>> {
        await delay(500)

        const index = mockComments.findIndex(c => c.id === id)

        if (index === -1) {
            throw new Error('Comment not found')
        }

        mockComments[index].status = 'approved'
        mockComments[index].updated_at = new Date().toISOString()

        return {
            status: true,
            message: 'Comment approved successfully',
            data: mockComments[index],
        }
    },

    async rejectComment(id: number, reason?: string): Promise<ApiResponse<Comment>> {
        await delay(500)

        const index = mockComments.findIndex(c => c.id === id)

        if (index === -1) {
            throw new Error('Comment not found')
        }

        mockComments[index].status = 'rejected'
        mockComments[index].moderation_reason = reason
        mockComments[index].updated_at = new Date().toISOString()

        return {
            status: true,
            message: 'Comment rejected successfully',
            data: mockComments[index],
        }
    },

    async markAsSpam(id: number): Promise<ApiResponse<Comment>> {
        await delay(500)

        const index = mockComments.findIndex(c => c.id === id)

        if (index === -1) {
            throw new Error('Comment not found')
        }

        mockComments[index].status = 'spam'
        mockComments[index].updated_at = new Date().toISOString()

        return {
            status: true,
            message: 'Comment marked as spam successfully',
            data: mockComments[index],
        }
    },
}
