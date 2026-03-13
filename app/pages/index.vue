<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: "custom" })
import iconDelete from '../assets/img/delete00_GRAD0_opsz48.png'
import formatDate from '~/utils/formatDate'

const authStore = useAuthStore()
const code = useCodeHunt()
const { connect, on } = useCodehuntSocket()
const currentPage = ref<number>(1)
const limit = ref<number>(25)
const modalConfirmDelete = ref<boolean>(false)
const deleteTargetId = ref<string>("")

onMounted(async () => {
  await Promise.all([code.getUserCredit(currentPage.value, limit.value)])
  connect("/ws/codehunt", authStore.localToken)
  subscribeSocketEvents()
})

const subscribeSocketEvents = () => {
  on('userCredit', (data: any) => {
    const exiting = code.dataCode.some(item => item._id === data._id)
    if (!exiting) {
      code.dataCode.unshift(data)
      code.totalItems++
      code.totalPages = Math.ceil(code.totalItems / limit.value)
    }
  })

  on('userCreditUpdate', (data: any) => {
    const findItem = code.dataCode.find(item => item._id === data._id)
    if (!findItem) return
    findItem.status = data.status
  })

  on('userCreditDelete', (data: any) => {
    const index = code.dataCode.findIndex(i => i._id === data._id)
    if (index === -1) return
    code.dataCode.splice(index, 1)
    code.totalItems--
    code.totalPages = Math.ceil(code.totalItems / limit.value)

    if (code.dataCode.length === 0 && currentPage.value > 1) {
      goToPage(currentPage.value - 1)
    }
  })
}

const Btndelete = (id: string) => {
  deleteTargetId.value = id
  modalConfirmDelete.value = true
}

const confirmDelete = async () => {
  await code.deleteUserCredit(deleteTargetId.value)
  modalConfirmDelete.value = false
  deleteTargetId.value = ""
}

const goToPage = (page: number) => {
  currentPage.value = page
  code.getUserCredit(page, limit.value)
}
</script>
<template>
  <div class="flex flex-col border border-gray-200 rounded-sm overflow-hidden">
    <div class="overflow-x-auto overflow-y-auto max-h-[calc(100vh-160px)] overscroll-none">
      <table class="w-full border-collapse">
        <thead class="bg-gray-50 border-b-2 border-gray-200 sticky top-0 z-10">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">ลำดับ</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">รหัสกิจกรรม</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">เวลากิจกรรม</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">ยูสเซอร์</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">โค้ดที่ใช้</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">รางวัล</th>
            <th class="px-6 py-3 text-center text-sm font-medium text-gray-700">เติมโดย</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr class="hover:bg-gray-50 transition-colors whitespace-nowrap" v-for="(item, index) in code.dataCode">
            <td class="px-6 py-4 text-sm text-gray-900 text-center">{{ (currentPage - 1) * limit + index + 1 }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ item._id }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(item.createdAt) }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.account }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.codes }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.reward }} บาท</td>
            <td class="px-6 py-4 text-sm text-gray-600 text-center">{{ item.topupByName || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">
              <button type="button" @click="Btndelete(item._id)">
                <img :src="iconDelete" class="w-[25px] h-[25px] object-contain">
              </button>
            </td>
          </tr>

          <tr v-if="code.dataCode.length === 0">
            <td colspan="7" class="py-16 text-center">
              <div class="flex flex-col items-center gap-3">
                <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-gray-400" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <div class="flex flex-col gap-1">
                  <p class="text-sm font-medium text-gray-500">ไม่มีข้อมูล</p>
                  <p class="text-xs text-gray-400">ยังไม่มีรายการกิจกรรมในขณะนี้</p>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex p-2 justify-end border-t border-t-gray-200">
      <Pagination :current-page="currentPage" :total-items="code.totalItems" :items-per-page="limit" :max-visible="5"
        @update:current-page="goToPage" />
    </div>
  </div>

  <div v-if="modalConfirmDelete" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-[380px] rounded-2xl overflow-hidden shadow-xl">

      <!-- Icon Zone -->
      <div class="flex flex-col items-center gap-3 bg-red-50 py-8">
        <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <div class="flex flex-col items-center gap-1">
          <h3 class="text-base font-semibold text-gray-800">ยืนยันการลบ</h3>
          <p class="text-sm text-gray-400 text-center px-6">
            คุณต้องการลบรายการนี้ใช่หรือไม่?<br>การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex border-t border-gray-100">
        <button type="button" @click="modalConfirmDelete = false"
          class="flex-1 py-3 text-sm text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer border-r border-gray-100">
          ยกเลิก
        </button>
        <button type="button" @click="confirmDelete"
          class="flex-1 py-3 text-sm text-red-500 font-semibold hover:bg-red-50 transition-colors cursor-pointer">
          ลบรายการ
        </button>
      </div>

    </div>
  </div>

  
</template>