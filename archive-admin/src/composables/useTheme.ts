import { ref, watch, onMounted } from 'vue'

type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'archive-admin-theme'
const theme = ref<Theme>('system')
const resolvedTheme = ref<'light' | 'dark'>('light')

function getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function updateDOM(isDark: boolean) {
    if (typeof document === 'undefined') return

    if (isDark) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}

function resolveTheme(themeValue: Theme): 'light' | 'dark' {
    if (themeValue === 'system') {
        return getSystemTheme()
    }
    return themeValue
}

export function useTheme() {
    const setTheme = (newTheme: Theme) => {
        theme.value = newTheme
        localStorage.setItem(STORAGE_KEY, newTheme)

        const resolved = resolveTheme(newTheme)
        resolvedTheme.value = resolved
        updateDOM(resolved === 'dark')
    }

    const initTheme = () => {
        // Load from localStorage or default to system
        const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
        const initialTheme = stored || 'system'

        theme.value = initialTheme
        const resolved = resolveTheme(initialTheme)
        resolvedTheme.value = resolved
        updateDOM(resolved === 'dark')
    }

    // Watch for system theme changes
    onMounted(() => {
        initTheme()

        if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            const handleChange = () => {
                if (theme.value === 'system') {
                    const resolved = getSystemTheme()
                    resolvedTheme.value = resolved
                    updateDOM(resolved === 'dark')
                }
            }

            mediaQuery.addEventListener('change', handleChange)

            return () => {
                mediaQuery.removeEventListener('change', handleChange)
            }
        }
    })

    return {
        theme,
        resolvedTheme,
        setTheme,
    }
}
