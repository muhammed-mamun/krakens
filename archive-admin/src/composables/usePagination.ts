import { ref, computed } from 'vue'

export function usePagination(initialPage = 1, initialLimit = 10) {
    const currentPage = ref(initialPage)
    const limit = ref(initialLimit)
    const total = ref(0)

    const offset = computed(() => (currentPage.value - 1) * limit.value)
    const totalPages = computed(() => Math.ceil(total.value / limit.value))
    const hasNext = computed(() => currentPage.value < totalPages.value)
    const hasPrev = computed(() => currentPage.value > 1)

    const nextPage = () => {
        if (hasNext.value) currentPage.value++
    }

    const prevPage = () => {
        if (hasPrev.value) currentPage.value--
    }

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page
        }
    }

    const setTotal = (newTotal: number) => {
        total.value = newTotal
    }

    const reset = () => {
        currentPage.value = initialPage
        total.value = 0
    }

    return {
        currentPage,
        limit,
        offset,
        total,
        totalPages,
        hasNext,
        hasPrev,
        nextPage,
        prevPage,
        goToPage,
        setTotal,
        reset
    }
}
