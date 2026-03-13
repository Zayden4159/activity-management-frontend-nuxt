<script setup lang="ts">
import { error } from '#build/ui';

const props = defineProps<{
    message: string
    createdAt: Date
    type?: 'error' | 'success' | 'info'
}>()
defineEmits(['close'])

const now = ref(new Date())
const startTime = props.createdAt ?? new Date()
let timer: ReturnType<typeof setInterval>

onMounted(() => {
    timer = setInterval(() => {
        now.value = new Date()
    }, 1000)
})

onUnmounted(() => {
    clearInterval(timer)
})

const timeAgo = computed(() => {
    const diff = Math.floor((now.value.getTime() - startTime.getTime()) / 1000)

    if (diff < 60) return `${diff} วินาทีที่แล้ว`
    if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`
    if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`
    return `${Math.floor(diff / 86400)} วันที่แล้ว`
})

const dotColor = computed(() => ({
    'bg-red-500': props.type === 'error',
    'bg-green-500': props.type === 'success',
    'bg-blue-500': !props.type || props.type === 'info'
}))

const title = computed(() => ({
    error: 'เกิดข้อผิดพลาด',
    success: 'สำเร็จ',
    info: "แจ้งเตือน"
}[props.type ?? 'info']))
</script>

<template>
    <div
        class="bg-white w-full shadow-lg border border-gray-100 rounded-lg overflow-hidden">

        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" :class="dotColor"></div>
                <span class="text-sm font-semibold text-gray-700">{{ title }}</span>
            </div>
            <div class="flex items-center gap-3">
                <span class="text-xs text-gray-400">{{ timeAgo }}</span>
                <!-- ปุ่มปิด -->
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>  
        </div>

        <!-- Body -->
        <div class="px-4 py-3 text-sm text-gray-600 leading-relaxed">
           {{ message }}
        </div>

    </div>
</template>