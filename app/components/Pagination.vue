<!-- components/Pagination.vue -->
<script setup lang="ts">
interface Props {
  currentPage: number
  totalItems: number
  itemsPerPage?: number
  maxVisible?: number
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerPage: 10,
  maxVisible: 3
})

const emit = defineEmits<{ 'update:currentPage': [page: number] }>()

const currentPageRef = toRef(props, 'currentPage')
const totalItemsRef = toRef(props, 'totalItems')

const { totalPages, visiblePages } = usePagination(
  currentPageRef, 
  totalItemsRef, 
  props.itemsPerPage, 
  props.maxVisible
)

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  emit('update:currentPage', page)
}

const btnClass = 'p-1 px-3 text-sm border rounded-md transition-colors'
const btnDefault = 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
const btnActive = 'bg-gray-900 text-white border-gray-900'
const btnDisabled = 'disabled:opacity-50 disabled:cursor-not-allowed'
</script>

<template>
  <div class="flex justify-center items-center gap-2">
    <button 
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      :class="[btnClass, btnDefault, btnDisabled]"
    >
      ก่อนหน้า
    </button>

    <template v-for="(page, index) in visiblePages" :key="index">
      <span v-if="page === '...'" class="px-2 text-gray-500 select-none">...</span>
      <button
        v-else
        @click="goToPage(page as number)"
        :class="[btnClass, 'min-w-[30px]', currentPage === page ? btnActive : btnDefault]"
      >
        {{ page }}
      </button>
    </template>

    <button 
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      :class="[btnClass, btnDefault, btnDisabled]"
    >
      ถัดไป
    </button>
  </div>
</template>