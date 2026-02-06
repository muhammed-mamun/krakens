<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Home, ChevronRight } from 'lucide-vue-next'

interface Breadcrumb {
  id: number
  label: string
}

interface Props {
  breadcrumbs: Breadcrumb[]
}

defineProps<Props>()

const emit = defineEmits<{
  navigate: [parentId?: number]
}>()
</script>

<template>
  <div v-if="breadcrumbs.length > 0" class="flex items-center gap-2 text-sm text-muted-foreground">
    <Button 
      variant="ghost" 
      size="sm" 
      @click="emit('navigate')"
      class="h-8 px-2"
    >
      <Home class="h-4 w-4" />
    </Button>
    <template v-for="(crumb, index) in breadcrumbs" :key="crumb.id">
      <ChevronRight class="h-4 w-4" />
      <Button 
        variant="ghost" 
        size="sm"
        @click="emit('navigate', crumb.id)"
        :class="index === breadcrumbs.length - 1 ? 'font-semibold text-foreground' : ''"
        class="h-8"
      >
        {{ crumb.label }}
      </Button>
    </template>
  </div>
</template>
