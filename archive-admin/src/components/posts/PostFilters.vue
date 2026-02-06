<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-vue-next'

interface Props {
  searchQuery: string
  statusFilter: string
  statusCounts: {
    all: number
    published: number
    pending: number
    draft: number
  }
}

defineProps<Props>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:statusFilter': [value: string]
}>()
</script>

<template>
  <Card>
    <CardContent class="pt-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1 relative">
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            :model-value="searchQuery"
            @update:model-value="(value) => emit('update:searchQuery', String(value))"
            placeholder="Search posts by title or slug..." 
            class="pl-10"
          />
        </div>
        
        <!-- Status Filters -->
        <div class="flex gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm"
            :class="statusFilter === 'all' ? 'bg-primary text-primary-foreground' : ''"
            @click="emit('update:statusFilter', 'all')"
          >
            All
            <Badge variant="secondary" class="ml-2">{{ statusCounts.all }}</Badge>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            :class="statusFilter === 'published' ? 'bg-green-600 text-white hover:bg-green-700' : ''"
            @click="emit('update:statusFilter', 'published')"
          >
            Published
            <Badge variant="secondary" class="ml-2">{{ statusCounts.published }}</Badge>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            :class="statusFilter === 'pending' ? 'bg-yellow-600 text-white hover:bg-yellow-700' : ''"
            @click="emit('update:statusFilter', 'pending')"
          >
            Pending
            <Badge variant="secondary" class="ml-2">{{ statusCounts.pending }}</Badge>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            :class="statusFilter === 'draft' ? 'bg-gray-600 text-white hover:bg-gray-700' : ''"
            @click="emit('update:statusFilter', 'draft')"
          >
            Draft
            <Badge variant="secondary" class="ml-2">{{ statusCounts.draft }}</Badge>
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
