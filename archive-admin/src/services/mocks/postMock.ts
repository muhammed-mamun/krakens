import type { ApiResponse, Post, CreatePostRequest, UpdatePostRequest } from '@/types/api'

// Mock data
let mockPosts: Post[] = [
    {
        id: 1,
        uuid: '019c249f-ea82-7e54-8195-00c4742a6f30',
        title: 'Getting Started with Vue 3',
        slug: 'getting-started-vue-3',
        content: 'Vue 3 is the latest version of Vue.js with many improvements...',
        summary: 'Learn the basics of Vue 3 and its new features',
        excerpt: 'Learn the basics of Vue 3 and its new features',
        category_id: 1,
        created_by: 1,
        status: 'published',
        is_public: true,
        is_featured: false,
        is_pinned: false,
        view_count: 0,
        version: 1,
        published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 2,
        uuid: '019c249f-ea82-7e54-8195-00c4742a6f31',
        title: 'Understanding TypeScript Generics',
        slug: 'understanding-typescript-generics',
        content: 'TypeScript generics provide a way to create reusable components...',
        summary: 'Deep dive into TypeScript generics',
        excerpt: 'Deep dive into TypeScript generics',
        category_id: 1,
        created_by: 1,
        status: 'pending',
        is_public: true,
        is_featured: false,
        is_pinned: false,
        view_count: 0,
        version: 1,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 3,
        uuid: '019c249f-ea82-7e54-8195-00c4742a6f32',
        title: 'Building REST APIs with Go',
        slug: 'building-rest-apis-go',
        content: 'Go is an excellent language for building high-performance APIs...',
        summary: 'Learn how to build REST APIs using Go',
        excerpt: 'Learn how to build REST APIs using Go',
        category_id: 2,
        created_by: 1,
        status: 'published',
        is_public: true,
        is_featured: true,
        is_pinned: false,
        view_count: 0,
        version: 1,
        published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 4,
        uuid: '019c249f-ea82-7e54-8195-00c4742a6f33',
        title: 'Introduction to Docker',
        slug: 'introduction-docker',
        content: 'Docker is a platform for developing, shipping, and running applications...',
        summary: 'Get started with Docker containerization',
        excerpt: 'Get started with Docker containerization',
        category_id: 2,
        created_by: 1,
        status: 'draft',
        is_public: false,
        is_featured: false,
        is_pinned: false,
        view_count: 0,
        version: 1,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 5,
        uuid: '019c249f-ea82-7e54-8195-00c4742a6f34',
        title: 'CSS Grid Layout Guide',
        slug: 'css-grid-layout-guide',
        content: 'CSS Grid is a powerful layout system available in CSS...',
        summary: 'Master CSS Grid for modern layouts',
        excerpt: 'Master CSS Grid for modern layouts',
        category_id: 3,
        created_by: 1,
        status: 'pending',
        is_public: true,
        is_featured: false,
        is_pinned: false,
        view_count: 0,
        version: 1,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const postMockService = {
    async getPosts(params?: { status?: string; category_id?: number; limit?: number; offset?: number }): Promise<ApiResponse<Post[]>> {
        await delay(500)

        let filtered = [...mockPosts]

        if (params?.status) {
            filtered = filtered.filter(p => p.status === params.status)
        }

        if (params?.category_id) {
            filtered = filtered.filter(p => p.category_id === params.category_id)
        }

        if (params?.limit) {
            filtered = filtered.slice(params.offset || 0, (params.offset || 0) + params.limit)
        }

        return {
            status: true,
            message: 'Posts retrieved successfully',
            data: filtered,
        }
    },

    async getPostById(id: number): Promise<ApiResponse<Post>> {
        await delay(300)

        const post = mockPosts.find(p => p.id === id)

        if (!post) {
            throw new Error('Post not found')
        }

        return {
            status: true,
            message: 'Post retrieved successfully',
            data: post,
        }
    },

    async createPost(data: CreatePostRequest): Promise<ApiResponse<Post>> {
        await delay(500)

        const newPost: Post = {
            id: Date.now(),
            uuid: `019c249f-ea82-7e54-8195-${Date.now()}`,
            title: data.title,
            slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
            content: data.content,
            summary: data.summary,
            excerpt: data.excerpt,
            thumbnail: data.thumbnail,
            category_id: data.category_id,
            sub_category_id: data.sub_category_id,
            meta_title: data.meta_title,
            meta_description: data.meta_description,
            keywords: data.keywords,
            og_image: data.og_image,
            created_by: 1,
            status: 'draft',
            is_public: data.is_public ?? false,
            is_featured: data.is_featured ?? false,
            is_pinned: data.is_pinned ?? false,
            view_count: 0,
            version: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        mockPosts.unshift(newPost)

        return {
            status: true,
            message: 'Post created successfully',
            data: newPost,
        }
    },

    async updatePost(id: number, data: UpdatePostRequest): Promise<ApiResponse<Post>> {
        await delay(500)

        const index = mockPosts.findIndex(p => p.id === id)

        if (index === -1) {
            throw new Error('Post not found')
        }

        mockPosts[index] = {
            ...mockPosts[index],
            ...data,
            updated_at: new Date().toISOString(),
        }

        return {
            status: true,
            message: 'Post updated successfully',
            data: mockPosts[index],
        }
    },

    async deletePost(id: number): Promise<ApiResponse<null>> {
        await delay(500)

        mockPosts = mockPosts.filter(p => p.id !== id)

        return {
            status: true,
            message: 'Post deleted successfully',
            data: null,
        }
    },

    async publishPost(id: number): Promise<ApiResponse<Post>> {
        await delay(500)

        const index = mockPosts.findIndex(p => p.id === id)

        if (index === -1) {
            throw new Error('Post not found')
        }

        mockPosts[index].status = 'published'
        mockPosts[index].published_at = new Date().toISOString()
        mockPosts[index].updated_at = new Date().toISOString()

        return {
            status: true,
            message: 'Post published successfully',
            data: mockPosts[index],
        }
    },

    async rejectPost(id: number, reason?: string): Promise<ApiResponse<Post>> {
        await delay(500)

        const index = mockPosts.findIndex(p => p.id === id)

        if (index === -1) {
            throw new Error('Post not found')
        }

        mockPosts[index].status = 'archived'
        mockPosts[index].updated_at = new Date().toISOString()

        return {
            status: true,
            message: 'Post rejected successfully',
            data: mockPosts[index],
        }
    },
}
