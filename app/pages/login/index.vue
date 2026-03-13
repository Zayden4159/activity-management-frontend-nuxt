<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
import { useAuthStore } from '~/stores/auth.store'

const auth = useAuthStore()

interface LoginForm {
    username: string
    password: string
}

const formData = reactive<LoginForm>({
    username: '',
    password: ''
})

const loading = ref<boolean>(false)

const handleLogin = async () => {
    loading.value = true
    const result = await auth.login(formData.username, formData.password)
    loading.value = false
    if (result.success) {
        await navigateTo('/', { replace: true, redirectCode: 302 })
    }
}
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-50">
        <div class="w-full max-w-[400px] px-4">

            <!-- Card -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                <!-- Header -->
                <div class="bg-violet-600 px-8 py-10 flex flex-col items-center gap-2">
                    <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A9 9 0 1118.88 6.196M15 11l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                    </div>
                    <h2 class="text-white text-lg font-semibold">Activity Manager</h2>
                    <p class="text-violet-200 text-xs">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
                </div>

                <!-- Form -->
                <form class="px-8 py-8 flex flex-col gap-5" @submit.prevent="handleLogin">
                    <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-medium text-gray-600">Username</label>
                        <input
                            type="text"
                            placeholder="กรอกชื่อผู้ใช้"
                            v-model="formData.username"
                            class="text-sm p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition"
                        />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            placeholder="กรอกรหัสผ่าน"
                            v-model="formData.password"
                            autocomplete="on"
                            class="text-sm p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition"
                        />
                    </div>
                    <button
                        type="submit"
                        :disabled="!formData.username || !formData.password || loading"
                        class="mt-1 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <svg v-if="loading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="white" stroke-width="4"/>
                            <path class="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
                    </button>
                </form>

            </div>

        </div>
    </div>
</template>