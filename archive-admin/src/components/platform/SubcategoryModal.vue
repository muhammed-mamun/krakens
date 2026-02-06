<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-vue-next'
import type { Subcategory, CreateSubcategoryRequest, UpdateSubcategoryRequest, Category } from '@/types/api'

interface Props {
  open: boolean
  subcategory?: Subcategory | null
  mode: 'create' | 'edit'
  categories: Category[]
  preselectedParentId?: number
  hideParentSelector?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', data: CreateSubcategoryRequest | UpdateSubcategoryRequest): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref({
  slug: '',
  label: '',
  description: '',
  parent_id: 0,
})

watch(() => [props.open, props.subcategory, props.preselectedParentId], () => {
  if (props.open && props.subcategory && props.mode === 'edit') {
    formData.value = {
      slug: props.subcategory.slug,
      label: props.subcategory.label,
      description: props.subcategory.description || '',
      parent_id: props.subcategory.parent_id,
    }
  } else if (props.open && props.mode === 'create') {
    formData.value = {
      slug: '',
      label: '',
      description: '',
      parent_id: props.preselectedParentId || props.categories[0]?.id || 0,
    }
  }
}, { immediate: true })

const handleClose = () => {
  emit('update:open', false)
}

const handleSubmit = () => {
  if (props.mode === 'create') {
    emit('submit', formData.value as CreateSubcategoryRequest)
  } else {
    const { slug, ...updateData } = formData.value
    emit('submit', updateData as UpdateSubcategoryRequest)
  }
  handleClose()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="handleClose"
        ></div>
        
        <div class="relative bg-background rounded-lg shadow-lg w-full max-w-md mx-4 p-6 z-10">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">
              {{ mode === 'create' ? 'Create Subcategory' : 'Edit Subcategory' }}
            </h2>
            <Button variant="ghost" size="icon" @click="handleClose">
              <X class="h-4 w-4" />
            </Button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div v-if="!hideParentSelector" class="space-y-2">
              <Label for="parent">Parent Category</Label>
              <select
                v-model="formData.parent_id"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                <option value="0" disabled>Select parent category</option>
                <option 
                  v-for="category in categories" 
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.label }}
                </option>
              </select>
            </div>

            <div class="space-y-2">
              <Label for="slug">Slug</Label>
              <Input
                id="slug"
                v-model="formData.slug"
                placeholder="subcategory-slug"
                :disabled="mode === 'edit'"
                required
              />
              <p v-if="mode === 'edit'" class="text-xs text-muted-foreground">
                Slug cannot be changed after creation
              </p>
            </div>

            <div class="space-y-2">
              <Label for="label">Label</Label>
              <Input
                id="label"
                v-model="formData.label"
                placeholder="Subcategory Name"
                required
              />
            </div>

            <div class="space-y-2">
              <Label for="description">Description</Label>
              <textarea
                id="description"
                v-model="formData.description"
                placeholder="Subcategory description..."
                class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div class="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" @click="handleClose">
                Cancel
              </Button>
              <Button type="submit">
                {{ mode === 'create' ? 'Create' : 'Update' }}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
