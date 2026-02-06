<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import MarkdownEditor from '@/components/posts/MarkdownEditor.vue'
import { usePostStore } from '@/stores/post'
import { useCategoryStore } from '@/stores/category'
import { useSubcategoryStore } from '@/stores/subcategory'
import type { CreatePostRequest } from '@/types/api'
import { ArrowLeft, Save, Eye } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const categoryStore = useCategoryStore()
const subcategoryStore = useSubcategoryStore()

const isEdit = ref(!!route.params.id)
const saving = ref(false)

const form = ref<CreatePostRequest>({
  title: '',
  slug: '',
  content: '',
  summary: '',
  thumbnail: '',
  category_id: 0,
  sub_category_id: undefined,
  meta_title: '',
  meta_description: '',
  keywords: '',
  og_image: '',
  is_public: true,
  is_featured: false,
  is_pinned: false,
})

const generateSlug = () => {
  if (!form.value.slug && form.value.title) {
    form.value.slug = form.value.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

const filteredSubcategories = computed(() => {
  if (!form.value.category_id) return []
  return subcategoryStore.subcategories.filter(
    sub => sub.parent_id === form.value.category_id && sub.status === 'approved'
  )
})

const handleSubmit = async () => {
  saving.value = true
  try {
    console.log('Form data before submit:', JSON.stringify(form.value, null, 2))
    if (isEdit.value) {
      await postStore.updatePost(Number(route.params.id), form.value)
    } else {
      await postStore.createPost(form.value)
    }
    router.push('/posts')
  } catch (error) {
    console.error('Failed to save post:', error)
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    categoryStore.fetchCategories(),
    subcategoryStore.fetchSubcategories()
  ])
  
  if (isEdit.value) {
    const post = await postStore.fetchPostById(Number(route.params.id))
    if (post) {
      form.value = {
        title: post.title,
        slug: post.slug,
        content: post.content,
        summary: post.summary || '',
        thumbnail: post.thumbnail || '',
        category_id: post.category_id,
        sub_category_id: post.sub_category_id,
        meta_title: post.meta_title || '',
        meta_description: post.meta_description || '',
        keywords: post.keywords || '',
        og_image: post.og_image || '',
        is_public: post.is_public,
        is_featured: post.is_featured,
        is_pinned: post.is_pinned,
      }
    }
  }
})
</script>

<template>
  <div class="space-y-6 pb-16">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" @click="router.push('/posts')">
          <ArrowLeft class="h-5 w-5" />
        </Button>
        <div>
          <h1 class="text-3xl font-bold tracking-tight">
            {{ isEdit ? 'Edit Post' : 'Create New Post' }}
          </h1>
          <p class="text-muted-foreground mt-1">
            {{ isEdit ? 'Update your post content' : 'Write and publish content' }}
          </p>
        </div>
      </div>
      <Button @click="handleSubmit" :disabled="saving">
        <Eye class="h-4 w-4 mr-2" />
        {{ isEdit ? 'Update' : 'Publish' }}
      </Button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input v-model="form.title" @blur="generateSlug" required />
            </div>
            <div>
              <Label>Slug *</Label>
              <Input v-model="form.slug" required />
            </div>
            <div>
              <Label>Summary</Label>
              <Textarea v-model="form.summary" rows="3" />
            </div>
            <div>
              <Label>Content *</Label>
              <MarkdownEditor v-model="form.content" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <Label>Meta Title</Label>
              <Input v-model="form.meta_title" />
            </div>
            <div>
              <Label>Meta Description</Label>
              <Textarea v-model="form.meta_description" rows="2" />
            </div>
            <div>
              <Label>Keywords</Label>
              <Input v-model="form.keywords" />
            </div>
            <div>
              <Label>OG Image URL</Label>
              <Input v-model="form.og_image" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Classification</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <Label>Category *</Label>
              <select v-model="form.category_id" class="w-full p-2 border rounded" required>
                <option :value="0">Select category</option>
                <option
                  v-for="cat in categoryStore.categories.filter(c => c.status === 'approved')"
                  :key="cat.id"
                  :value="cat.id"
                >
                  {{ cat.label }}
                </option>
              </select>
            </div>
            <div v-if="filteredSubcategories.length > 0">
              <Label>Subcategory</Label>
              <select v-model="form.sub_category_id" class="w-full p-2 border rounded">
                <option :value="undefined">None</option>
                <option v-for="sub in filteredSubcategories" :key="sub.id" :value="sub.id">
                  {{ sub.label }}
                </option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Featured Image</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Image URL</Label>
            <Input v-model="form.thumbnail" />
            <div v-if="form.thumbnail" class="mt-4">
              <img :src="form.thumbnail" alt="Thumbnail" class="w-full rounded-lg border" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visibility</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between">
              <Label>Public</Label>
              <Switch v-model:checked="form.is_public" />
            </div>
            <div class="flex items-center justify-between">
              <Label>Featured</Label>
              <Switch v-model:checked="form.is_featured" />
            </div>
            <div class="flex items-center justify-between">
              <Label>Pinned</Label>
              <Switch v-model:checked="form.is_pinned" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
