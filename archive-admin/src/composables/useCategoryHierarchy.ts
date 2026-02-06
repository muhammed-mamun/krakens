import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoryStore } from '@/stores/category'
import { useSubcategoryStore } from '@/stores/subcategory'
import type { Category, Subcategory } from '@/types/api'

export function useCategoryHierarchy() {
    const route = useRoute()
    const router = useRouter()
    const categoryStore = useCategoryStore()
    const subcategoryStore = useSubcategoryStore()

    const currentParentId = ref<number | undefined>(undefined)
    const breadcrumbs = ref<Array<{ id: number; label: string }>>([])

    // Get current view items (either top-level categories or subcategories of current parent)
    const currentItems = computed(() => {
        if (!currentParentId.value) {
            return categoryStore.categories.filter(cat => !cat.parent_id)
        } else {
            return subcategoryStore.subcategories.filter(sub => sub.parent_id === currentParentId.value)
        }
    })

    const isViewingCategories = computed(() => !currentParentId.value)

    const findItemById = (id: number): Category | Subcategory | undefined => {
        return categoryStore.categories.find(c => c.id === id) ||
            subcategoryStore.subcategories.find(s => s.id === id)
    }

    const buildBreadcrumbs = () => {
        breadcrumbs.value = []
        if (!currentParentId.value) return

        let parentId: number | undefined = currentParentId.value
        const trail: Array<{ id: number; label: string }> = []

        while (parentId) {
            const item = findItemById(parentId)
            if (item) {
                trail.unshift({ id: item.id, label: item.label })
                parentId = item.parent_id
            } else {
                break
            }
        }

        breadcrumbs.value = trail
    }

    const navigateToParent = (parentId?: number) => {
        if (parentId) {
            router.push({ query: { parent: parentId.toString() } })
        } else {
            router.push({ query: {} })
        }
    }

    const navigateInto = (item: Category | Subcategory) => {
        router.push({ query: { parent: item.id.toString() } })
    }

    const hasChildren = (item: Category | Subcategory): boolean => {
        return subcategoryStore.subcategories.some(sub => sub.parent_id === item.id)
    }

    const loadData = async () => {
        await categoryStore.fetchCategories()
        await subcategoryStore.fetchSubcategories()
        buildBreadcrumbs()
    }

    const initializeFromRoute = () => {
        const parent = route.query.parent
        if (parent) {
            currentParentId.value = parseInt(parent as string)
            buildBreadcrumbs()
        } else {
            currentParentId.value = undefined
            breadcrumbs.value = []
        }
    }

    return {
        currentParentId,
        breadcrumbs,
        currentItems,
        isViewingCategories,
        navigateToParent,
        navigateInto,
        hasChildren,
        loadData,
        initializeFromRoute,
        categoryStore,
        subcategoryStore,
    }
}
