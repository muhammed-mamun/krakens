<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useSupportStore } from '@/stores/support'

const router = useRouter()
const supportStore = useSupportStore()

const getPriorityBadge = (priority: string) => {
  const badges = {
    low: { class: 'bg-blue-500 text-white', text: 'Low' },
    medium: { class: 'bg-yellow-500 text-black', text: 'Medium' },
    high: { class: 'bg-orange-500 text-white', text: 'High' },
    urgent: { class: 'bg-red-500 text-white', text: 'Urgent' },
  }
  return badges[priority as keyof typeof badges] || badges.low
}

const getStatusBadge = (status: string) => {
  const badges = {
    open: { class: 'bg-green-500 text-white', text: 'Open' },
    in_progress: { class: 'bg-blue-500 text-white', text: 'In Progress' },
    resolved: { class: 'bg-gray-500 text-white', text: 'Resolved' },
    closed: { class: 'bg-gray-700 text-white', text: 'Closed' },
  }
  return badges[status as keyof typeof badges] || badges.open
}

onMounted(() => {
  supportStore.fetchTickets()
})
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold">Support Tickets</h1>
    
    <Card>
      <CardHeader>
        <CardTitle>All Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow 
              v-for="ticket in supportStore.tickets" 
              :key="ticket.id"
              class="cursor-pointer hover:bg-muted"
              @click="router.push(`/support/${ticket.id}`)"
            >
              <TableCell class="font-medium">{{ ticket.subject }}</TableCell>
              <TableCell>{{ ticket.user_name }}</TableCell>
              <TableCell>
                <Badge :class="getPriorityBadge(ticket.priority).class">
                  {{ getPriorityBadge(ticket.priority).text }}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge :class="getStatusBadge(ticket.status).class">
                  {{ getStatusBadge(ticket.status).text }}
                </Badge>
              </TableCell>
              <TableCell>{{ new Date(ticket.created_at).toLocaleDateString() }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
