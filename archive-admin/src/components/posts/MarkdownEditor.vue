<script setup lang="ts">
import { ref, watch } from 'vue'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Bold, Italic, Code, Link, List, ListOrdered, Quote, Image, FileText } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const content = ref(props.modelValue || '')

watch(() => props.modelValue, (newValue) => {
  content.value = newValue || ''
})

const updateContent = (value: string) => {
  content.value = value
  emit('update:modelValue', value)
}

const insertMarkdown = (before: string, after: string = '') => {
  const textarea = textareaRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = content.value.substring(start, end)
  const newText = content.value.substring(0, start) + before + selectedText + after + content.value.substring(end)
  
  updateContent(newText)
  
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
  }, 0)
}

const insertAtCursor = (text: string) => {
  const textarea = textareaRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const newText = content.value.substring(0, start) + text + content.value.substring(start)
  
  updateContent(newText)
  
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + text.length, start + text.length)
  }, 0)
}

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const text = e.target?.result as string
    updateContent(text)
  }
  reader.readAsText(file)
}

const textareaRef = ref<HTMLTextAreaElement>()

</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between mb-2">
      <div class="text-sm text-muted-foreground">
        Markdown Editor
      </div>
      
      <div class="flex items-center gap-1">
        <input
          type="file"
          accept=".md,.markdown,.txt"
          @change="handleFileUpload"
          class="hidden"
          id="md-file-upload"
        />
        <label for="md-file-upload">
          <Button variant="outline" size="sm" as="span" class="cursor-pointer">
            <FileText class="h-4 w-4 mr-2" />
            Import .md
          </Button>
        </label>
      </div>
    </div>

    <div class="flex flex-wrap gap-1 p-2 border rounded-t-lg bg-muted/50">
      <Button
        variant="ghost"
        size="sm"
        @click="insertMarkdown('**', '**')"
        title="Bold"
      >
        <Bold class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        @click="insertMarkdown('*', '*')"
        title="Italic"
      >
        <Italic class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        @click="insertMarkdown('`', '`')"
        title="Code"
      >
        <Code class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        @click="insertMarkdown('[', '](url)')"
        title="Link"
      >
        <Link class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        @click="insertAtCursor('\n- ')"
        title="Bullet List"
      >
        <List class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        @click="insertAtCursor('\n1. ')"
        title="Numbered List"
      >
        <ListOrdered class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        @click="insertAtCursor('\n> ')"
        title="Quote"
      >
        <Quote class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        @click="insertMarkdown('![alt](', ')')"
        title="Image"
      >
        <Image class="h-4 w-4" />
      </Button>
    </div>
    
    <textarea
      ref="textareaRef"
      :value="content"
      @input="updateContent(($event.target as HTMLTextAreaElement).value)"
      rows="20"
      class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono rounded-t-none"
      placeholder="Write your markdown content here or import a .md file...

# Heading 1
## Heading 2

**Bold text** and *italic text*

- Bullet list
- Another item

1. Numbered list
2. Another item

[Link text](https://example.com)

`inline code`

> Blockquote"
    />
    
    <div class="text-xs text-muted-foreground">
      Supports standard Markdown syntax. Click toolbar buttons or use keyboard shortcuts.
    </div>
  </div>
</template>
