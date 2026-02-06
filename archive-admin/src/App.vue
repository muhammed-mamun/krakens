<script setup lang="ts">
import 'vue-sonner/style.css'
import { RouterView } from 'vue-router';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import { useTheme } from '@/composables/useTheme';
import { computed } from 'vue';

const { resolvedTheme } = useTheme();
const toasterTheme = computed(() => resolvedTheme.value);
</script>

<template>
    <TooltipProvider>
        <Toaster position="top-right" :rich-colors="true" class="z-[9999]" :theme="toasterTheme" />
        <ConfirmDialog />
        <RouterView />
    </TooltipProvider>
</template>