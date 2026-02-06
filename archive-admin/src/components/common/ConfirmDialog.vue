<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Info, XCircle, X } from 'lucide-vue-next'
import { useConfirm } from '@/composables/useConfirm'

const { state, handleConfirm, handleCancel } = useConfirm()

const icon = computed(() => {
  switch (state.value.type) {
    case 'danger':
      return XCircle
    case 'warning':
      return AlertTriangle
    case 'info':
      return Info
    default:
      return AlertTriangle
  }
})

const iconColor = computed(() => {
  switch (state.value.type) {
    case 'danger':
      return 'text-red-600'
    case 'warning':
      return 'text-yellow-600'
    case 'info':
      return 'text-blue-600'
    default:
      return 'text-yellow-600'
  }
})

const confirmButtonVariant = computed(() => {
  return state.value.type === 'danger' ? 'destructive' : 'default'
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="state.isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="handleCancel"
      >
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="state.isOpen"
            class="relative bg-background rounded-lg shadow-2xl w-full max-w-md p-6 space-y-4"
            @click.stop
          >
            <!-- Close button -->
            <button
              class="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              @click="handleCancel"
            >
              <X class="h-5 w-5" />
            </button>

            <!-- Icon and Title -->
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                :class="{
                  'bg-red-100': state.type === 'danger',
                  'bg-yellow-100': state.type === 'warning',
                  'bg-blue-100': state.type === 'info',
                }"
              >
                <component :is="icon" :class="['h-6 w-6', iconColor]" />
              </div>

              <div class="flex-1 pt-1">
                <h3 class="text-lg font-semibold text-foreground">
                  {{ state.title }}
                </h3>
              </div>
            </div>

            <!-- Message -->
            <div class="pl-16">
              <p class="text-sm text-muted-foreground leading-relaxed">
                {{ state.message }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                @click="handleCancel"
              >
                {{ state.cancelText }}
              </Button>
              <Button
                :variant="confirmButtonVariant"
                @click="handleConfirm"
              >
                {{ state.confirmText }}
              </Button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
