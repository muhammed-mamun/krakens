import { defineStore } from 'pinia'
import { ref } from 'vue'
import { commentService } from '@/services'
import { useToast } from '@/composables/useToast'
import type { Comment, UpdateCommentRequest } from '@/types/api'

export const useCommentStore = defineStore('comment', () => {
    const comments = ref<Comment[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const toast = useToast()

    const fetchComments = async (params?: { post_id?: number; status?: string; limit?: number; offset?: number }) => {
        loading.value = true
        error.value = null
        try {
            const response = await commentService.getComments(params)
            if (response.status && response.data) {
                comments.value = response.data
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch comments'
            toast.error('Error', error.value)
        } finally {
            loading.value = false
        }
    }

    const updateComment = async (id: number, data: UpdateCommentRequest) => {
        loading.value = true
        error.value = null
        try {
            const response = await commentService.updateComment(id, data)
            if (response.status) {
                toast.success('Success', 'Comment updated')
                await fetchComments()
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to update comment'
            toast.error('Error', error.value)
            throw err
        } finally {
            loading.value = false
        }
    }

    const approveComment = async (id: number) => {
        try {
            const response = await commentService.approveComment(id)
            if (response.status) {
                toast.success('Success', 'Comment approved')
                await fetchComments()
            }
        } catch (err: any) {
            toast.error('Error', 'Failed to approve comment')
            throw err
        }
    }

    const rejectComment = async (id: number, reason?: string) => {
        try {
            const response = await commentService.rejectComment(id, reason)
            if (response.status) {
                toast.success('Success', 'Comment rejected')
                await fetchComments()
            }
        } catch (err: any) {
            toast.error('Error', 'Failed to reject comment')
            throw err
        }
    }

    const markAsSpam = async (id: number) => {
        try {
            const response = await commentService.markAsSpam(id)
            if (response.status) {
                toast.success('Success', 'Comment marked as spam')
                await fetchComments()
            }
        } catch (err: any) {
            toast.error('Error', 'Failed to mark as spam')
            throw err
        }
    }

    const deleteComment = async (id: number) => {
        try {
            const response = await commentService.deleteComment(id)
            if (response.status) {
                toast.success('Success', 'Comment deleted')
                comments.value = comments.value.filter(c => c.id !== id)
            }
        } catch (err: any) {
            toast.error('Error', 'Failed to delete comment')
            throw err
        }
    }

    return {
        comments,
        loading,
        error,
        fetchComments,
        updateComment,
        approveComment,
        rejectComment,
        markAsSpam,
        deleteComment
    }
})
