<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Archive, Edit, Trash2, CheckCircle, XCircle, MoreHorizontal, ChevronRight, Clock } from 'lucide-vue-next'
import type { Category, Subcategory } from '@/types/api'

interface Props {
  item: Category | Subcategory
  hasChildren: boolean
  isCategory: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  navigate: [item: Category | Subcategory]
  edit: [item: Category | Subcategory]
  delete: [item: Category | Subcategory]
  approve: [item: Category | Subcategory]
  reject: [item: Category | Subcategory]
}>()

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return { icon: CheckCircle, text: 'Approved', class: 'bg-green-500 hover:bg-green-600 text-white' }
    case 'pending':
      return { icon: Clock, text: 'Pending', class: 'bg-yellow-500 hover:bg-yellow-600 text-black' }
    case 'rejected':
      return { icon: XCircle, text: 'Rejected', class: 'bg-red-500 hover:bg-red-600 text-white' }
    case 'deleted':
      return { icon: Trash2, text: 'Deleted', class: 'bg-gray-500 hover:bg-gray-600 text-white' }
    default:
      return { icon: Clock, text: status, class: 'bg-gray-200 text-gray-700' }
  }
}
</script>

<template>
  <TableRow class="hover:bg-muted/50">
    <TableCell class="font-medium">
      <div class="flex items-center gap-2">
        <Archive class="h-4 w-4 text-primary" />
        <div>
          <p class="text-foreground flex items-center gap-2">
            {{ item.label }}
            <ChevronRight v-if="hasChildren" class="h-4 w-4 text-muted-foreground" />
          </p>
          <p class="text-sm text-muted-foreground">/{{ item.slug }}</p>
        </div>
      </div>
    </TableCell>
    <TableCell class="text-muted-foreground max-w-xs truncate">
      {{ item.description || 'No description' }}
    </TableCell>
    <TableCell class="text-muted-foreground">
      {{ new Date(item.created_at).toLocaleDateString() }}
    </TableCell>
    <TableCell>
      <Badge 
        :class="getStatusBadge(item.status).class"
        class="capitalize flex items-center gap-1 w-fit"
      >
        <component :is="getStatusBadge(item.status).icon" class="h-3 w-3" />
        {{ getStatusBadge(item.status).text }}
      </Badge>
    </TableCell>
    <TableCell class="text-right">
      <div class="flex items-center justify-end gap-2">
        <!-- Always show View button for categories, only for subcategories with children -->
        <Button 
          v-if="isCategory || hasChildren"
          variant="outline" 
          size="sm"
          @click="emit('navigate', item)"
        >
          <ChevronRight class="h-3 w-3 mr-1" />
          View
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon">
              <MoreHorizontal class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="emit('edit', item)">
              <Edit class="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            
            <DropdownMenuItem v-if="item.status !== 'approved'" @click="emit('approve', item)">
              <CheckCircle class="mr-2 h-4 w-4 text-green-600" />
              Approve
            </DropdownMenuItem>
            
            <DropdownMenuItem v-if="item.status !== 'rejected'" @click="emit('reject', item)">
              <XCircle class="mr-2 h-4 w-4 text-red-600" />
              Reject
            </DropdownMenuItem>

            <DropdownMenuItem 
              @click="emit('delete', item)" 
              class="text-red-600 focus:text-red-700"
            >
              <Trash2 class="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TableCell>
  </TableRow>
</template>
