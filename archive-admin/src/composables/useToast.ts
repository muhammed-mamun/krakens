import { toast } from 'vue-sonner'

export function useToast() {
    const success = (title: string, description?: string | null) => {
        toast.success(title, { description: description ?? undefined })
    }

    const error = (title: string, description?: string | null) => {
        toast.error(title, { description: description ?? undefined })
    }

    const info = (title: string, description?: string | null) => {
        toast.info(title, { description: description ?? undefined })
    }

    const warning = (title: string, description?: string | null) => {
        toast.warning(title, { description: description ?? undefined })
    }

    return {
        success,
        error,
        info,
        warning
    }
}
