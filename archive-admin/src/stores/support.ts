import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supportService } from '@/services'
import { useToast } from '@/composables/useToast'
import type { SupportTicket, UpdateSupportTicketRequest, SupportTicketReply, CreateSupportTicketReplyRequest } from '@/types/api'

export const useSupportStore = defineStore('support', () => {
    const tickets = ref<SupportTicket[]>([])
    const currentTicket = ref<SupportTicket | null>(null)
    const replies = ref<SupportTicketReply[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const toast = useToast()

    const fetchTickets = async (params?: { status?: string; priority?: string; limit?: number; offset?: number }) => {
        loading.value = true
        error.value = null
        try {
            const response = await supportService.getTickets(params)
            if (response.status && response.data) {
                tickets.value = response.data
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch tickets'
            toast.error('Error', error.value)
        } finally {
            loading.value = false
        }
    }

    const fetchTicketById = async (id: number) => {
        loading.value = true
        error.value = null
        try {
            const response = await supportService.getTicketById(id)
            if (response.status && response.data) {
                currentTicket.value = response.data
                return response.data
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch ticket'
            toast.error('Error', error.value)
            throw err
        } finally {
            loading.value = false
        }
    }

    const fetchReplies = async (ticketId: number) => {
        loading.value = true
        error.value = null
        try {
            const response = await supportService.getReplies(ticketId)
            if (response.status && response.data) {
                replies.value = response.data
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch replies'
            toast.error('Error', error.value)
        } finally {
            loading.value = false
        }
    }

    const updateTicket = async (id: number, data: UpdateSupportTicketRequest) => {
        loading.value = true
        error.value = null
        try {
            const response = await supportService.updateTicket(id, data)
            if (response.status) {
                toast.success('Success', 'Ticket updated')
                await fetchTickets()
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to update ticket'
            toast.error('Error', error.value)
            throw err
        } finally {
            loading.value = false
        }
    }

    const createReply = async (data: CreateSupportTicketReplyRequest) => {
        loading.value = true
        error.value = null
        try {
            const response = await supportService.createReply(data)
            if (response.status) {
                toast.success('Success', 'Reply sent')
                await fetchReplies(data.ticket_id)
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to send reply'
            toast.error('Error', error.value)
            throw err
        } finally {
            loading.value = false
        }
    }

    const assignTicket = async (id: number, userId: number) => {
        try {
            const response = await supportService.assignTicket(id, userId)
            if (response.status) {
                toast.success('Success', 'Ticket assigned')
                await fetchTickets()
            }
        } catch (err: any) {
            toast.error('Error', 'Failed to assign ticket')
            throw err
        }
    }

    const closeTicket = async (id: number) => {
        try {
            const response = await supportService.closeTicket(id)
            if (response.status) {
                toast.success('Success', 'Ticket closed')
                await fetchTickets()
            }
        } catch (err: any) {
            toast.error('Error', 'Failed to close ticket')
            throw err
        }
    }

    return {
        tickets,
        currentTicket,
        replies,
        loading,
        error,
        fetchTickets,
        fetchTicketById,
        fetchReplies,
        updateTicket,
        createReply,
        assignTicket,
        closeTicket
    }
})
