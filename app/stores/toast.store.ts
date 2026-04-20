import { defineStore } from "pinia";

interface Toast {
    id: number
    message: string
    type: 'error' | 'success' | 'info'
    createdAt: Date
}

export const useToastStore = defineStore('toast', () => {
    const toasts = ref<Toast[]>([])

    const add = (message: string, type: Toast['type'] = 'info') => {
        const id = Date.now()
        toasts.value.push({ id, message, type, createdAt: new Date() })

        // ปิดอัตโนมัติ 5 วินาที
        setTimeout(() => remove(id), 5000)
    }

    const remove = (id: number) => {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    return {
        toasts,
        add,
        remove,
        success: (msg: string) => add(msg, 'success'),
        error: (msg: string) => add(msg, 'error'),
        info: (msg: string) => add(msg, 'info'),
    }
})