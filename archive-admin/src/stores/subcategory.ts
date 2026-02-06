import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { subcategoryService } from '@/services'
import { MESSAGES } from '@/constants/messages'
import type { Subcategory, CreateSubcategoryRequest, UpdateSubcategoryRequest } from '@/types/api'

export const useSubcategoryStore = defineStore('subcategory', () => {
    const subcategories = ref<Subcategory[]>([])
    const currentSubcategory = ref<Subcategory | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    /**
     * Fetch all subcategories or by parent ID
     */
    const fetchSubcategories = async (parentId?: number) => {
        try {
            loading.value = true
            error.value = null
            const response = await subcategoryService.getSubcategories(parentId)

            if (response.status && response.data) {
                subcategories.value = response.data
            }
        } catch (err: any) {
            error.value = err.message || MESSAGES.ERROR.GENERIC
            console.error('Fetch subcategories error:', err)
        } finally {
            loading.value = false
        }
    }

    /**
     * Fetch subcategory by ID
     */
    const fetchSubcategoryById = async (id: number) => {
        try {
            loading.value = true
            error.value = null
            const response = await subcategoryService.getSubcategoryById(id)

            if (response.status && response.data) {
                currentSubcategory.value = response.data
                return response.data
            }
        } catch (err: any) {
            error.value = err.message || MESSAGES.ERROR.GENERIC
            console.error('Fetch subcategory error:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Create new subcategory
     */
    const createSubcategory = async (data: CreateSubcategoryRequest) => {
        try {
            loading.value = true
            error.value = null
            const response = await subcategoryService.createSubcategory(data)

            if (response.status) {
                toast.success('Subcategory Created', {
                    description: MESSAGES.SUCCESS.SUBCATEGORY_CREATED,
                })

                // Refresh subcategories list
                await fetchSubcategories()
            }
        } catch (err: any) {
            error.value = err.message || MESSAGES.ERROR.GENERIC
            console.error('Create subcategory error:', err)
            toast.error('Creation Failed', {
                description: err.response?.data?.message || MESSAGES.ERROR.GENERIC,
            })
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Update subcategory
     */
    const updateSubcategory = async (id: number, data: UpdateSubcategoryRequest) => {
        try {
            loading.value = true
            error.value = null
            const response = await subcategoryService.updateSubcategory(id, data)

            if (response.status) {
                toast.success('Subcategory Updated', {
                    description: MESSAGES.SUCCESS.SUBCATEGORY_UPDATED,
                })

                // Refresh subcategories list
                await fetchSubcategories()
            }
        } catch (err: any) {
            error.value = err.message || MESSAGES.ERROR.GENERIC
            console.error('Update subcategory error:', err)
            toast.error('Update Failed', {
                description: err.response?.data?.message || MESSAGES.ERROR.GENERIC,
            })
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Delete subcategory
     */
    const deleteSubcategory = async (id: number) => {
        try {
            loading.value = true
            error.value = null
            const response = await subcategoryService.deleteSubcategory(id)

            if (response.status) {
                toast.success('Subcategory Deleted', {
                    description: MESSAGES.SUCCESS.SUBCATEGORY_DELETED,
                })

                // Remove from local state
                subcategories.value = subcategories.value.filter((s) => s.id !== id)
            }
        } catch (err: any) {
            error.value = err.message || MESSAGES.ERROR.GENERIC
            console.error('Delete subcategory error:', err)
            toast.error('Deletion Failed', {
                description: err.response?.data?.message || MESSAGES.ERROR.GENERIC,
            })
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        subcategories,
        currentSubcategory,
        loading,
        error,
        fetchSubcategories,
        fetchSubcategoryById,
        createSubcategory,
        updateSubcategory,
        deleteSubcategory,
    }
})
