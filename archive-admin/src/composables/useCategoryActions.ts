import { ref } from 'vue'
import { useCategoryStore } from '@/stores/category'
import { useSubcategoryStore } from '@/stores/subcategory'
import { useConfirm } from '@/composables/useConfirm'
import type { Category, Subcategory, CreateCategoryRequest, UpdateCategoryRequest, CreateSubcategoryRequest, UpdateSubcategoryRequest } from '@/types/api'

export function useCategoryActions() {
    const categoryStore = useCategoryStore()
    const subcategoryStore = useSubcategoryStore()
    const { confirm } = useConfirm()

    const isCategoryModalOpen = ref(false)
    const isSubcategoryModalOpen = ref(false)
    const categoryModalMode = ref<'create' | 'edit'>('create')
    const subcategoryModalMode = ref<'create' | 'edit'>('create')
    const selectedCategory = ref<Category | null>(null)
    const selectedSubcategory = ref<Subcategory | null>(null)

    // Category handlers
    const handleCreateCategory = () => {
        categoryModalMode.value = 'create'
        selectedCategory.value = null
        isCategoryModalOpen.value = true
    }

    const handleEditCategory = (category: Category) => {
        categoryModalMode.value = 'edit'
        selectedCategory.value = category
        isCategoryModalOpen.value = true
    }

    const handleCategoryModalSubmit = async (data: CreateCategoryRequest | UpdateCategoryRequest, onSuccess?: () => void) => {
        if (categoryModalMode.value === 'create') {
            await categoryStore.createCategory(data as CreateCategoryRequest)
        } else if (selectedCategory.value) {
            await categoryStore.updateCategory(selectedCategory.value.slug, data as UpdateCategoryRequest)
        }
        isCategoryModalOpen.value = false
        onSuccess?.()
    }

    const handleDeleteCategory = async (category: Category, onSuccess?: () => void) => {
        const confirmed = await confirm({
            title: 'Delete Category',
            message: `Are you sure you want to delete "${category.label}"? This will also affect its subcategories.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger',
        })

        if (confirmed) {
            await categoryStore.deleteCategory(category.uuid)
            onSuccess?.()
        }
    }

    const handleUpdateCategoryStatus = async (category: Category, newStatus: Category['status'], onSuccess?: () => void) => {
        try {
            await categoryStore.updateCategory(category.slug, { status: newStatus } as any)
            onSuccess?.()
        } catch (error) {
            console.error(`Failed to update status for ${category.label}:`, error)
        }
    }

    // Subcategory handlers
    const handleCreateSubcategory = () => {
        subcategoryModalMode.value = 'create'
        selectedSubcategory.value = null
        isSubcategoryModalOpen.value = true
    }

    const handleEditSubcategory = (subcategory: Subcategory) => {
        subcategoryModalMode.value = 'edit'
        selectedSubcategory.value = subcategory
        isSubcategoryModalOpen.value = true
    }

    const handleSubcategoryModalSubmit = async (data: CreateSubcategoryRequest | UpdateSubcategoryRequest, currentParentId: number | undefined, onSuccess?: () => void) => {
        if (subcategoryModalMode.value === 'create') {
            const createData = { ...data, parent_id: currentParentId } as CreateSubcategoryRequest
            await subcategoryStore.createSubcategory(createData)
        } else if (selectedSubcategory.value) {
            await subcategoryStore.updateSubcategory(selectedSubcategory.value.id, data as UpdateSubcategoryRequest)
        }
        isSubcategoryModalOpen.value = false
        onSuccess?.()
    }

    const handleDeleteSubcategory = async (subcategory: Subcategory, onSuccess?: () => void) => {
        const confirmed = await confirm({
            title: 'Delete Subcategory',
            message: `Are you sure you want to delete "${subcategory.label}"? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger',
        })

        if (confirmed) {
            await subcategoryStore.deleteSubcategory(subcategory.id)
            onSuccess?.()
        }
    }

    const handleUpdateSubcategoryStatus = async (subcategory: Subcategory, newStatus: Subcategory['status'], onSuccess?: () => void) => {
        try {
            await subcategoryStore.updateSubcategory(subcategory.id, { status: newStatus } as any)
            onSuccess?.()
        } catch (error) {
            console.error(`Failed to update status for ${subcategory.label}:`, error)
        }
    }

    return {
        isCategoryModalOpen,
        isSubcategoryModalOpen,
        categoryModalMode,
        subcategoryModalMode,
        selectedCategory,
        selectedSubcategory,
        handleCreateCategory,
        handleEditCategory,
        handleCategoryModalSubmit,
        handleDeleteCategory,
        handleUpdateCategoryStatus,
        handleCreateSubcategory,
        handleEditSubcategory,
        handleSubcategoryModalSubmit,
        handleDeleteSubcategory,
        handleUpdateSubcategoryStatus,
    }
}
