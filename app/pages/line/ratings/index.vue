<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: "custom" })
import formatDate from '~/utils/formatDate'

const authStore = useAuthStore()
const lineStore = useLine()
const { connect, on } = useCodehuntSocket()
const currentPage = ref<number>(1)
const limit = ref<number>(25)
const search = ref<string>("")

onMounted(async () => {
  await Promise.all([lineStore.getRatings(currentPage.value, limit.value)])
  connect("/ws/line", authStore.localToken)

  on('new_rating_line', (newUser: any) => {
    lineStore.dataRatings.unshift(newUser)
    lineStore.totalItems++
  })
})

const onSearch = async () => {
  currentPage.value = 1
  await lineStore.getRatings(currentPage.value, limit.value, search.value)
}


const goToPage = async (page: number) => {
  currentPage.value = page
  await lineStore.getRatings(page, limit.value)
}
</script>
<template>
  <div class="flex gap-2 mb-2">
    <button type="button" @click="lineStore.exportRatings()"
      class="p-2 text-sm text-gray-600 border border-gray-200 rounded-sm hover:bg-green-600 hover:text-white cursor-pointer">
      Export Excel
    </button>
    <div class="flex gap-2 ml-auto">
      <input type="text" v-model="search" @keyup.enter="onSearch" placeholder="ค้นหา ชื่อ, ยูสเซอร์, เบอร์..."
        class="border border-gray-200 rounded-sm px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-300 w-64" />
      <button @click="onSearch"
        class="px-3 py-1.5 text-sm bg-violet-600 text-white rounded-sm hover:bg-violet-700 cursor-pointer">
        ค้นหา
      </button>
      <button v-if="search" @click="search = ''; onSearch()"
        class="px-3 py-1.5 text-sm border border-gray-200 text-gray-600 rounded-sm hover:bg-gray-50 cursor-pointer">
        ล้าง
      </button>
    </div>
  </div>
  <div class="flex flex-col border border-gray-200 rounded-sm overflow-hidden">
    <div class="overflow-x-auto overflow-y-auto max-h-[calc(100vh-160px)] overscroll-none">
      <table class="w-full border-collapse">
        <thead class="bg-gray-50 border-b-2 border-gray-200 sticky top-0 z-10">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">ลำดับ</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">วันที่แก้ไข</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">เว็บไซต์</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">ยูสเซอร์</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">ชื่อ</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">ยูสเซอร์เกม</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">LINE</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">คะแนน</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr class="hover:bg-gray-50 transition-colors whitespace-nowrap"
            v-for="(item, index) in lineStore.dataRatings">
            <td class="px-6 py-4 text-sm text-gray-900 text-center">{{ (currentPage - 1) * limit + index + 1 }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ formatDate(item.createdAt) }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.prefix.shortCode || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.userID }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.displayName || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.details.accountGame || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">
              <div v-if="item.lineInfo?.lineName" class="flex flex-col gap-0.5">
                <span class="text-gray-800 font-medium">{{ item.lineInfo.lineName }}</span>
                <span class="text-xs text-gray-400">{{ item.lineInfo.lineId }}</span>
              </div>
              <span v-else class="text-gray-300">-</span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.score || '-' }}</td>
          </tr>

          <tr v-if="lineStore.dataRatings.length === 0">
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
                  <p class="text-xs text-gray-400">ยังไม่มีรายการประกาศรางวัลในขณะนี้</p>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex p-2 justify-end border-t border-t-gray-200">
      <Pagination :current-page="currentPage" :total-items="lineStore.totalItems" :items-per-page="limit"
        :max-visible="5" @update:current-page="goToPage" />
    </div>
  </div>


</template>