<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, Mail, Shield, Calendar, Save, Key } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import { ROLE_CONFIG } from '@/constants/status'
import type { UpdateUserRequest, ChangePasswordRequest } from '@/types/api'

const userStore = useUserStore()
const authStore = useAuthStore()

const profileForm = ref({
    username: '',
    email: '',
    full_name: '',
})

const passwordForm = ref({
    old_password: '',
    new_password: '',
    confirm_password: '',
})

const showPasswordForm = ref(false)
const passwordError = ref('')

const loadProfile = () => {
    if (authStore.user) {
        profileForm.value = {
            username: authStore.user.username,
            email: authStore.user.email,
            full_name: authStore.user.full_name || '',
        }
    }
}

const handleUpdateProfile = async () => {
    try {
        const data: UpdateUserRequest = {
            username: profileForm.value.username,
            email: profileForm.value.email,
            full_name: profileForm.value.full_name,
        }
        await userStore.updateProfile(data)
        
        // Update auth store user
        if (authStore.user) {
            authStore.user.username = data.username!
            authStore.user.email = data.email!
            authStore.user.full_name = data.full_name
            localStorage.setItem('user', JSON.stringify(authStore.user))
        }
    } catch (error) {
        console.error('Failed to update profile:', error)
    }
}

const handleChangePassword = async () => {
    passwordError.value = ''
    
    if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
        passwordError.value = 'New passwords do not match'
        return
    }

    if (passwordForm.value.new_password.length < 6) {
        passwordError.value = 'Password must be at least 6 characters'
        return
    }

    try {
        const data: ChangePasswordRequest = {
            old_password: passwordForm.value.old_password,
            new_password: passwordForm.value.new_password,
        }
        await userStore.changePassword(data)
        
        // Reset form
        passwordForm.value = {
            old_password: '',
            new_password: '',
            confirm_password: '',
        }
        showPasswordForm.value = false
    } catch (error) {
        console.error('Failed to change password:', error)
    }
}

const getRoleConfig = (role: string) => {
    return ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] || {
        label: role,
        color: 'gray',
    }
}

onMounted(() => {
    loadProfile()
})
</script>

<template>
    <div class="space-y-6">
        <!-- Profile Information Card -->
        <Card>
            <CardHeader>
                <CardTitle class="flex items-center gap-2">
                    <User class="h-5 w-5 text-primary" />
                    Profile Information
                </CardTitle>
                <CardDescription>
                    Update your account information and preferences
                </CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
                <!-- User Info Display -->
                <div class="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div class="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <User class="h-8 w-8 text-primary" />
                    </div>
                    <div class="flex-1">
                        <h3 class="font-semibold text-lg">{{ authStore.user?.full_name || authStore.user?.username }}</h3>
                        <p class="text-sm text-muted-foreground flex items-center gap-2">
                            <Mail class="h-3 w-3" />
                            {{ authStore.user?.email }}
                        </p>
                        <div class="flex items-center gap-2 mt-2">
                            <Badge :class="`bg-${getRoleConfig(authStore.user?.role || '').color}-500`">
                                <Shield class="h-3 w-3 mr-1" />
                                {{ getRoleConfig(authStore.user?.role || '').label }}
                            </Badge>
                            <Badge variant="outline" class="text-xs">
                                <Calendar class="h-3 w-3 mr-1" />
                                Joined {{ new Date(authStore.user?.created_at || '').toLocaleDateString() }}
                            </Badge>
                        </div>
                    </div>
                </div>

                <Separator />

                <!-- Edit Profile Form -->
                <form @submit.prevent="handleUpdateProfile" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="username">Username</Label>
                            <Input
                                id="username"
                                v-model="profileForm.username"
                                placeholder="Enter username"
                                required
                            />
                        </div>

                        <div class="space-y-2">
                            <Label for="email">Email</Label>
                            <Input
                                id="email"
                                v-model="profileForm.email"
                                type="email"
                                placeholder="Enter email"
                                required
                            />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <Label for="full_name">Full Name</Label>
                        <Input
                            id="full_name"
                            v-model="profileForm.full_name"
                            placeholder="Enter full name"
                        />
                    </div>

                    <div class="flex justify-end">
                        <Button type="submit" :disabled="userStore.loading">
                            <Save class="h-4 w-4 mr-2" />
                            {{ userStore.loading ? 'Saving...' : 'Save Changes' }}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>

        <!-- Change Password Card -->
        <Card>
            <CardHeader>
                <CardTitle class="flex items-center gap-2">
                    <Key class="h-5 w-5 text-primary" />
                    Change Password
                </CardTitle>
                <CardDescription>
                    Update your password to keep your account secure
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div v-if="!showPasswordForm">
                    <Button @click="showPasswordForm = true" variant="outline">
                        <Key class="h-4 w-4 mr-2" />
                        Change Password
                    </Button>
                </div>

                <form v-else @submit.prevent="handleChangePassword" class="space-y-4">
                    <div class="space-y-2">
                        <Label for="old_password">Current Password</Label>
                        <Input
                            id="old_password"
                            v-model="passwordForm.old_password"
                            type="password"
                            placeholder="Enter current password"
                            required
                        />
                    </div>

                    <div class="space-y-2">
                        <Label for="new_password">New Password</Label>
                        <Input
                            id="new_password"
                            v-model="passwordForm.new_password"
                            type="password"
                            placeholder="Enter new password"
                            required
                        />
                    </div>

                    <div class="space-y-2">
                        <Label for="confirm_password">Confirm New Password</Label>
                        <Input
                            id="confirm_password"
                            v-model="passwordForm.confirm_password"
                            type="password"
                            placeholder="Confirm new password"
                            required
                        />
                    </div>

                    <p v-if="passwordError" class="text-sm text-red-600">
                        {{ passwordError }}
                    </p>

                    <div class="flex justify-end gap-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            @click="showPasswordForm = false"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" :disabled="userStore.loading">
                            {{ userStore.loading ? 'Changing...' : 'Change Password' }}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
</template>
