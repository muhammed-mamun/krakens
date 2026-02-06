import type { ApiResponse, SupportTicket, UpdateSupportTicketRequest, SupportTicketReply, CreateSupportTicketReplyRequest } from '@/types/api'

// Mock data
let mockTickets: SupportTicket[] = [
    {
        id: 1,
        uuid: '019c249f-ea82-7e54-8195-00c4742a6f20',
        user_id: 1,
        user_name: 'John Doe',
        user_email: 'john@example.com',
        subject: 'Cannot upload images',
        message: 'I am trying to upload images to my post but getting an error. Can you help?',
        status: 'open',
        priority: 'high',
        category: 'bug',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 2,
        uuid: '019c249f-ea82-7e54-8195-00c4742a6f21',
        user_name: 'Jane Smith',
        user_email: 'jane@example.com',
        subject: 'Feature request: Dark mode',
        message: 'It would be great to have a dark mode option for the admin panel.',
        status: 'in_progress',
        priority: 'medium',
        category: 'feature',
        assigned_to: 1,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 3,
        uuid: '019c249f-ea82-7e54-8195-00c4742a6f22',
        user_name: 'Bob Wilson',
        user_email: 'bob@example.com',
        subject: 'How to create categories?',
        message: 'I am new to the platform. Can you guide me on how to create categories?',
        status: 'resolved',
        priority: 'low',
        category: 'question',
        assigned_to: 1,
        created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 4,
        uuid: '019c249f-ea82-7e54-8195-00c4742a6f23',
        user_name: 'Alice Brown',
        user_email: 'alice@example.com',
        subject: 'Great platform!',
        message: 'Just wanted to say this is an amazing platform. Keep up the good work!',
        status: 'open',
        priority: 'low',
        category: 'feedback',
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 5,
        uuid: '019c249f-ea82-7e54-8195-00c4742a6f24',
        user_name: 'Charlie Davis',
        user_email: 'charlie@example.com',
        subject: 'Login issues',
        message: 'I cannot login to my account. It says invalid credentials but I am sure my password is correct.',
        status: 'open',
        priority: 'urgent',
        category: 'bug',
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
]

let mockReplies: Record<number, SupportTicketReply[]> = {
    1: [
        {
            id: 1,
            ticket_id: 1,
            user_id: 1,
            message: 'Thank you for reporting this. We are looking into it.',
            is_staff: true,
            created_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
        },
    ],
    2: [
        {
            id: 2,
            ticket_id: 2,
            user_id: 1,
            message: 'Great suggestion! We have added this to our roadmap.',
            is_staff: true,
            created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        },
    ],
    3: [
        {
            id: 3,
            ticket_id: 3,
            user_id: 1,
            message: 'Sure! You can create categories by going to the Categories page and clicking "Create Category".',
            is_staff: true,
            created_at: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 4,
            ticket_id: 3,
            user_id: 2,
            message: 'Thank you! That was very helpful.',
            is_staff: false,
            created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        },
    ],
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const supportMockService = {
    async getTickets(params?: { status?: string; priority?: string; limit?: number; offset?: number }): Promise<ApiResponse<SupportTicket[]>> {
        await delay(500)

        let filtered = [...mockTickets]

        if (params?.status) {
            filtered = filtered.filter(t => t.status === params.status)
        }

        if (params?.priority) {
            filtered = filtered.filter(t => t.priority === params.priority)
        }

        if (params?.limit) {
            filtered = filtered.slice(params.offset || 0, (params.offset || 0) + params.limit)
        }

        return {
            status: true,
            message: 'Tickets retrieved successfully',
            data: filtered,
        }
    },

    async getTicketById(id: number): Promise<ApiResponse<SupportTicket>> {
        await delay(300)

        const ticket = mockTickets.find(t => t.id === id)

        if (!ticket) {
            throw new Error('Ticket not found')
        }

        return {
            status: true,
            message: 'Ticket retrieved successfully',
            data: ticket,
        }
    },

    async updateTicket(id: number, data: UpdateSupportTicketRequest): Promise<ApiResponse<SupportTicket>> {
        await delay(500)

        const index = mockTickets.findIndex(t => t.id === id)

        if (index === -1) {
            throw new Error('Ticket not found')
        }

        mockTickets[index] = {
            ...mockTickets[index],
            ...data,
            updated_at: new Date().toISOString(),
        }

        return {
            status: true,
            message: 'Ticket updated successfully',
            data: mockTickets[index],
        }
    },

    async getReplies(ticketId: number): Promise<ApiResponse<SupportTicketReply[]>> {
        await delay(300)

        const replies = mockReplies[ticketId] || []

        return {
            status: true,
            message: 'Replies retrieved successfully',
            data: replies,
        }
    },

    async createReply(data: CreateSupportTicketReplyRequest): Promise<ApiResponse<SupportTicketReply>> {
        await delay(500)

        const newReply: SupportTicketReply = {
            id: Date.now(),
            ticket_id: data.ticket_id,
            user_id: 1,
            message: data.message,
            is_staff: true,
            created_at: new Date().toISOString(),
        }

        if (!mockReplies[data.ticket_id]) {
            mockReplies[data.ticket_id] = []
        }

        mockReplies[data.ticket_id].push(newReply)

        return {
            status: true,
            message: 'Reply created successfully',
            data: newReply,
        }
    },

    async assignTicket(id: number, userId: number): Promise<ApiResponse<SupportTicket>> {
        await delay(500)

        const index = mockTickets.findIndex(t => t.id === id)

        if (index === -1) {
            throw new Error('Ticket not found')
        }

        mockTickets[index].assigned_to = userId
        mockTickets[index].status = 'in_progress'
        mockTickets[index].updated_at = new Date().toISOString()

        return {
            status: true,
            message: 'Ticket assigned successfully',
            data: mockTickets[index],
        }
    },

    async closeTicket(id: number): Promise<ApiResponse<SupportTicket>> {
        await delay(500)

        const index = mockTickets.findIndex(t => t.id === id)

        if (index === -1) {
            throw new Error('Ticket not found')
        }

        mockTickets[index].status = 'closed'
        mockTickets[index].updated_at = new Date().toISOString()

        return {
            status: true,
            message: 'Ticket closed successfully',
            data: mockTickets[index],
        }
    },
}
