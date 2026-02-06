<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Archive, Plus, Clock } from 'lucide-vue-next'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import CategoryModal from '@/components/platform/CategoryModal.vue'
import SubcategoryModal from '@/components/platform/SubcategoryModal.vue'
import CategoryBreadcrumb from '@/components/archive/CategoryBreadcrumb.vue'
import CategoryTableRow from '@/components/archive/CategoryTableRow.vue'
import { useCategoryHierarchy } from '@/composables/useCategoryHierarchy'
import { useCategoryActions } from '@/composables/useCategoryActions'
import type { Category, Subcategory } from '@/types/api'

const route = useRoute()

const {
  currentParentId,
  breadcrumbs,
  currentItems,
  isViewingCategories,
  navigateToParent,
  navigateInto,
  hasChildren,
  loadData,
  initializeFromRoute,
  categoryStore,
  subcategoryStore,
} = useCategoryHierarchy()

const {
  isCategoryModalOpen,
  isSubcategoryModalOpen,
  categoryModalMode,
  subcategoryModalMode,
  selectedCategory,
  selectedSubcategory,
  handleCreateCategory,
  handleEditCategory,
  handleCategoryModalSubmit,
  handleDeleteCategory,
  handleUpdateCategoryStatus,
  handleCreateSubcategory,
  handleEditSubcategory,
  handleSubcategoryModalSubmit,
  handleDeleteSubcategory,
  handleUpdateSubcategoryStatus,
} = useCategoryActions()

// Watch route changes
watch(() => route.query.parent, () => {
  initializeFromRoute()
}, { immediate: true })

// Event handlers
const onCategoryModalSubmit = (data: any) => {
  handleCategoryModalSubmit(data, loadData)
}

const onSubcategoryModalSubmit = (data: any) => {
  handleSubcategoryModalSubmit(data, currentParentId.value, loadData)
}

const onEdit = (item: Category | Subcategory) => {
  if (isViewingCategories.value) {
    handleEditCategory(item as Category)
  } else {
    handleEditSubcategory(item as Subcategory)
  }
}

const onDelete = (item: Category | Subcategory) => {
  if (isViewingCategories.value) {
    handleDeleteCategory(item as Category, loadData)
  } else {
    handleDeleteSubcategory(item as Subcategory, loadData)
  }
}

const onApprove = (item: Category | Subcategory) => {
  if (isViewingCategories.value) {
    handleUpdateCategoryStatus(item as Category, 'approved', loadData)
  } else {
    handleUpdateSubcategoryStatus(item as Subcategory, 'approved', loadData)
  }
}

const onReject = (item: Category | Subcategory) => {
  if (isViewingCategories.value) {
    handleUpdateCategoryStatus(item as Category, 'rejected', loadData)
  } else {
    handleUpdateSubcategoryStatus(item as Subcategory, 'rejected', loadData)
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <Card class="bg-gradient-card border-0 shadow-md">
    <CardHeader>
      <div class="space-y-3">
        <!-- Breadcrumbs -->
        <CategoryBreadcrumb 
          :breadcrumbs="breadcrumbs" 
          @navigate="navigateToParent"
        />

        <!-- Title and Actions -->
        <CardTitle class="flex items-center justify-between">
          <span class="flex items-center gap-2">
            <Archive class="h-5 w-5 text-primary" />
            {{ isViewingCategories ? 'Categories' : breadcrumbs[breadcrumbs.length - 1]?.label || 'Subcategories' }}
          </span>
          <Button 
            variant="default" 
            size="sm" 
            @click="isViewingCategories ? handleCreateCategory() : handleCreateSubcategory()"
          >
            <Plus class="h-4 w-4 mr-2" />
            {{ isViewingCategories ? 'Create Category' : 'Create Subcategory' }}
          </Button>
        </CardTitle>
      </div>
    </CardHeader>

    <CardContent>
      <!-- Loading State -->
      <div v-if="categoryStore.loading || subcategoryStore.loading" class="p-8 text-center text-muted-foreground flex justify-center items-center gap-2">
        <Clock class="animate-spin h-5 w-5" />
        <span>Loading...</span>
      </div>
      
      <!-- Error State -->
      <div v-else-if="categoryStore.error || subcategoryStore.error" class="p-8 text-center text-red-500 bg-red-50 border border-red-200 rounded-lg">
        Error: {{ categoryStore.error || subcategoryStore.error }}
        <Button variant="link" class="mt-2" @click="loadData">Retry</Button>
      </div>

      <!-- Empty State -->
      <div v-else-if="currentItems.length === 0" class="p-8 text-center text-muted-foreground">
        {{ isViewingCategories ? 'No categories found. Click "Create Category" to add one.' : 'No subcategories found. Click "Create Subcategory" to add one.' }}
      </div>
      
      <!-- Table -->
      <Table v-else>
        <TableHeader>
          <TableRow>
            <TableHead>Name / Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <CategoryTableRow
            v-for="item in currentItems"
            :key="item.id"
            :item="item"
            :has-children="hasChildren(item)"
            :is-category="isViewingCategories"
            @navigate="navigateInto"
            @edit="onEdit"
            @delete="onDelete"
            @approve="onApprove"
            @reject="onReject"
          />
        </TableBody>
      </Table>
    </CardContent>
  </Card>

  <!-- Category Modal -->
  <CategoryModal
    v-model:open="isCategoryModalOpen"
    :mode="categoryModalMode"
    :category="selectedCategory"
    @submit="onCategoryModalSubmit"
  />

  <!-- Subcategory Modal -->
  <SubcategoryModal
    v-model:open="isSubcategoryModalOpen"
    :mode="subcategoryModalMode"
    :subcategory="selectedSubcategory"
    :categories="categoryStore.categories"
    :preselected-parent-id="currentParentId"
    :hide-parent-selector="true"
    @submit="onSubcategoryModalSubmit"
  />
</template>
