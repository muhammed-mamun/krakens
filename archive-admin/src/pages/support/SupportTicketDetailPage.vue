<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSupportStore } from '@/stores/support'

const route = useRoute()
const supportStore = useSupportStore()
const replyMessage = ref('')

const handleSendReply = async () => {
  if (!replyMessage.value.trim()) return
  await supportStore.createReply({
    ticket_id: Number(route.params.id),
    message: replyMessage.value,
  })
  replyMessage.value = ''
}

const handleClose = async () => {
  await supportStore.closeTicket(Number(route.params.id))
}

onMounted(async () => {
  await supportStore.fetchTicketById(Number(route.params.id))
  await supportStore.fetchReplies(Number(route.params.id))
})
</script>

<template>
  <div class="space-y-6" v-if="supportStore.currentTicket">
    <div>
      <h1 class="text-3xl font-bold">{{ supportStore.currentTicket.subject }}</h1>
      <div class="flex gap-2 mt-2">
        <Badge>{{ supportStore.currentTicket.priority }}</Badge>
        <Badge>{{ supportStore.currentTicket.status }}</Badge>
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Ticket Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div>
            <p class="text-sm text-muted-foreground">From</p>
            <p>{{ supportStore.currentTicket.user_name }} ({{ supportStore.currentTicket.user_email }})</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Message</p>
            <p>{{ supportStore.currentTicket.message }}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Replies</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div v-for="reply in supportStore.replies" :key="reply.id" class="p-4 border rounded">
            <p class="text-sm font-medium">{{ reply.is_staff ? 'Staff' : 'User' }}</p>
            <p>{{ reply.message }}</p>
            <p class="text-xs text-muted-foreground mt-2">{{ new Date(reply.created_at).toLocaleString() }}</p>
          </div>
        </div>

        <div class="mt-4 space-y-2">
          <textarea 
            v-model="replyMessage" 
            class="w-full p-2 border rounded min-h-[100px]"
            placeholder="Type your reply..."
          />
          <div class="flex gap-2">
            <Button @click="handleSendReply">Send Reply</Button>
            <Button variant="outline" @click="handleClose">Close Ticket</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
