<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { CheckCircle, XCircle, AlertTriangle, Trash2, Search, User, Mail, MessageSquare } from 'lucide-vue-next'
import { useCommentStore } from '@/stores/comment'

const commentStore = useCommentStore()
const statusFilter = ref('pending')
const searchQuery = ref('')

const filteredComments = computed(() => {
  let comments = commentStore.comments
  
  if (searchQuery.value) {
    comments = comments.filter(c => 
      c.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.author_name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  return comments
})

const statusCounts = computed(() => ({
  pending: commentStore.comments.filter(c => c.status === 'pending').length,
  approved: commentStore.comments.filter(c => c.status === 'approved').length,
  rejected: commentStore.comments.filter(c => c.status === 'rejected').length,
  spam: commentStore.comments.filter(c => c.status === 'spam').length,
}))

const getStatusBadge = (status: string) => {
  const badges = {
    pending: { class: 'bg-yellow-100 text-yellow-700 border-yellow-200', text: 'Pending' },
    approved: { class: 'bg-green-100 text-green-700 border-green-200', text: 'Approved' },
    rejected: { class: 'bg-red-100 text-red-700 border-red-200', text: 'Rejected' },
    spam: { class: 'bg-orange-100 text-orange-700 border-orange-200', text: 'Spam' },
  }
  return badges[status as keyof typeof badges] || badges.pending
}

const handleApprove = async (id: number) => {
  await commentStore.approveComment(id)
}

const handleReject = async (id: number) => {
  await commentStore.rejectComment(id)
}

const handleSpam = async (id: number) => {
  await commentStore.markAsSpam(id)
}

const handleDelete = async (id: number) => {
  await commentStore.deleteComment(id)
}

onMounted(() => {
  commentStore.fetchComments({ status: statusFilter.value })
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Comment Moderation</h1>
      <p class="text-muted-foreground mt-1">Review and moderate user comments</p>
    </div>

    <!-- Stats -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card 
        class="cursor-pointer transition-all hover:shadow-md"
        :class="statusFilter === 'pending' ? 'ring-2 ring-yellow-500' : ''"
        @click="statusFilter = 'pending'; commentStore.fetchComments({ status: 'pending' })"
      >
        <CardContent class="pt-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Pending</p>
              <p class="text-2xl font-bold mt-1">{{ statusCounts.pending }}</p>
            </div>
            <div class="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <MessageSquare class="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        class="cursor-pointer transition-all hover:shadow-md"
        :class="statusFilter === 'approved' ? 'ring-2 ring-green-500' : ''"
        @click="statusFilter = 'approved'; commentStore.fetchComments({ status: 'approved' })"
      >
        <CardContent class="pt-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Approved</p>
              <p class="text-2xl font-bold mt-1">{{ statusCounts.approved }}</p>
            </div>
            <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        class="cursor-pointer transition-all hover:shadow-md"
        :class="statusFilter === 'rejected' ? 'ring-2 ring-red-500' : ''"
        @click="statusFilter = 'rejected'; commentStore.fetchComments({ status: 'rejected' })"
      >
        <CardContent class="pt-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Rejected</p>
              <p class="text-2xl font-bold mt-1">{{ statusCounts.rejected }}</p>
            </div>
            <div class="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle class="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        class="cursor-pointer transition-all hover:shadow-md"
        :class="statusFilter === 'spam' ? 'ring-2 ring-orange-500' : ''"
        @click="statusFilter = 'spam'; commentStore.fetchComments({ status: 'spam' })"
      >
        <CardContent class="pt-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Spam</p>
              <p class="text-2xl font-bold mt-1">{{ statusCounts.spam }}</p>
            </div>
            <div class="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertTriangle class="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Search -->
    <Card>
      <CardContent class="pt-6">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            v-model="searchQuery"
            placeholder="Search comments by content or author..." 
            class="pl-10"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Comments List -->
    <Card>
      <CardHeader>
        <CardTitle class="text-xl">
          {{ filteredComments.length }} {{ filteredComments.length === 1 ? 'Comment' : 'Comments' }}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div 
            v-for="comment in filteredComments" 
            :key="comment.id"
            class="p-6 rounded-lg border hover:border-primary/50 transition-all"
          >
            <!-- Author Info -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User class="h-5 w-5 text-white" />
                </div>
                <div>
                  <p class="font-semibold text-sm">{{ comment.author_name }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <Mail class="h-3 w-3 text-muted-foreground" />
                    <p class="text-xs text-muted-foreground">{{ comment.author_email }}</p>
                  </div>
                </div>
              </div>
              <Badge :class="getStatusBadge(comment.status).class" class="border">
                {{ getStatusBadge(comment.status).text }}
              </Badge>
            </div>

            <!-- Comment Content -->
            <div class="mb-4 pl-13">
              <p class="text-sm leading-relaxed">{{ comment.content }}</p>
            </div>

            <!-- Meta Info -->
            <div class="flex items-center justify-between pl-13">
              <p class="text-xs text-muted-foreground">
                {{ new Date(comment.created_at).toLocaleString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                }) }}
              </p>

              <!-- Actions -->
              <div class="flex gap-2">
                <Button 
                  v-if="comment.status === 'pending'"
                  size="sm" 
                  variant="outline" 
                  class="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                  @click="handleApprove(comment.id)"
                >
                  <CheckCircle class="h-4 w-4" />
                  Approve
                </Button>
                <Button 
                  v-if="comment.status === 'pending'"
                  size="sm" 
                  variant="outline" 
                  class="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  @click="handleReject(comment.id)"
                >
                  <XCircle class="h-4 w-4" />
                  Reject
                </Button>
                <Button 
                  v-if="comment.status === 'pending'"
                  size="sm" 
                  variant="outline" 
                  class="gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                  @click="handleSpam(comment.id)"
                >
                  <AlertTriangle class="h-4 w-4" />
                  Spam
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  class="gap-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                  @click="handleDelete(comment.id)"
                >
                  <Trash2 class="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredComments.length === 0" class="text-center py-12">
          <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <MessageSquare class="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 class="text-lg font-semibold mb-2">No comments found</h3>
          <p class="text-sm text-muted-foreground">
            {{ searchQuery ? 'Try adjusting your search' : 'No comments to moderate at the moment' }}
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
