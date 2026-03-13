<template>
    <div class="fixed top-4 right-4 z-50 w-full max-w-[300px] flex flex-col gap-2">
        <Toast
            v-for="toast in toastStore.toasts"
            :key="toast.id"
            :message="toast.message"
            :type="toast.type"
            :createdAt="toast.createdAt"
            @close="toastStore.remove(toast.id)"
        />
    </div>
</template>

<script setup lang="ts">
const toastStore = useToastStore()
</script>