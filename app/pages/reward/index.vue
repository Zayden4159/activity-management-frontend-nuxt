<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: "custom" })
import iconEdit from '~/assets/img/edit_icon.png'
import iconDelete from '~/assets/img/delete00_GRAD0_opsz48.png'
import formatDate from '~/utils/formatDate'

const rewardStore = useReward()
const prefixStore = usePrefix()
const currentPage = ref<number>(1)
const limit = ref<number>(25)
const modalRewardCategory = ref<boolean>(false)
const modalAddWeb = ref<boolean>(false)
const modalAddReward = ref<boolean>(false)
const modalEditReward = ref<boolean>(false)
const selectPrefix = ref<boolean>(false)
const selectPrefixEdit = ref<boolean>(false)
const selectRewardCategory = ref<boolean>(false)
const selectRewardCategoryEdit = ref<boolean>(false)
const modalConfirmDelete = ref<boolean>(false)
const deleteTargetId = ref<string>("")
const initialForm = {
  _id: "",
  account: "",
  rewardName: "",
  rewardValue: 0,
  prefix: "",
  rewardNameEN: "",
  rewardNameTH: "",
  domain: "",
  shortCode: ""
}

const dataForm = reactive({
  ...initialForm
})

interface dataPrefix {
  _id: string
  domain: string
  shortCode: string
  tenantId: string
  createdAt: string
  updatedAt: string
}

onMounted(async () => {
  await Promise.all([rewardStore.getReward(currentPage.value, limit.value), rewardStore.getCustomReward(), prefixStore.getPrefix()])
  document.addEventListener("click", () => {
    selectPrefix.value = false
    selectPrefixEdit.value = false
    selectRewardCategory.value = false
    selectRewardCategoryEdit.value = false
  })
})

const submitRewardCategory = async () => {
  await rewardStore.createCustomReward(dataForm.rewardNameEN, dataForm.rewardNameTH)
  clearForm()
  await rewardStore.getCustomReward()
}

const submitPrefix = async () => {
  await prefixStore.createPrefix(dataForm.domain, dataForm.shortCode)
  clearForm()
  await prefixStore.getPrefix()
}

const submitReward = async () => {
  await rewardStore.createReward(dataForm)
  clearForm()
  await rewardStore.getReward(currentPage.value, limit.value)
}

const submitEditReward = async () => {
  await rewardStore.editReward(dataForm)
  await rewardStore.getReward(currentPage.value, limit.value)
}

const clearForm = () => {
  Object.assign(dataForm, initialForm)
}

const togglePrefix = (data: dataPrefix) => {
  dataForm.shortCode = data.shortCode
  dataForm.prefix = data._id
  selectPrefix.value = false
}

const btnEditReward = async (data: any) => {
  modalEditReward.value = true
  dataForm._id = data._id
  dataForm.account = data.account
  dataForm.prefix = data.prefix
  dataForm.shortCode = data.prefixName
  dataForm.rewardValue = data.rewardValue
  dataForm.rewardNameTH = data.rewardName
  dataForm.rewardName = data.rewardName
}

const toggleRewardCategory = (name: string) => {
  dataForm.rewardNameTH = name
  dataForm.rewardName = name
  selectRewardCategory.value = false
}

const Btndelete = (id: string) => {
  deleteTargetId.value = id
  modalConfirmDelete.value = true
}

const confirmDelete = async () => {
  const isLastItem = rewardStore.dataReward.length === 1
  await rewardStore.deleteReward(deleteTargetId.value)
  if (isLastItem && currentPage.value > 1) currentPage.value--
  await rewardStore.getReward(currentPage.value, limit.value)
  modalConfirmDelete.value = false
  deleteTargetId.value = ""
}

const goToPage = async (page: number) => {
  currentPage.value = page
  await rewardStore.getReward(page, limit.value)
}
</script>
<template>
  <div class="flex gap-2 mb-2">
    <button type="button" @click="modalRewardCategory = true"
      class="p-2 text-sm text-gray-600 border border-gray-200 rounded-sm hover:bg-violet-700 hover:text-white cursor-pointer">เพิ่มหมวดหมู่รางวัล</button>
    <button type="button" @click="modalAddWeb = true"
      class="p-2 text-sm text-gray-600 border border-gray-200 rounded-sm hover:bg-violet-700 hover:text-white cursor-pointer">เพิ่มเว็บ</button>
    <button type="button" @click="modalAddReward = true"
      class="p-2 text-sm text-gray-600 border border-gray-200 rounded-sm  hover:bg-violet-700 hover:text-white cursor-pointer">เพิ่มรางวัล</button>
  </div>
  <div class="flex flex-col border border-gray-200 rounded-sm overflow-hidden">
    <div class="overflow-x-auto overflow-y-auto max-h-[calc(100vh-160px)] overscroll-none">
      <table class="w-full border-collapse">
        <thead class="bg-gray-50 border-b-2 border-gray-200 sticky top-0 z-10">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">ลำดับ</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">วันที่แก้ไข</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">รหัสกิจกรรม</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">เว็บไซต์</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">ยูสเซอร์</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">รายการ</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">รางวัล</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr class="hover:bg-gray-50 transition-colors whitespace-nowrap"
            v-for="(item, index) in rewardStore.dataReward">
            <td class="px-6 py-4 text-sm text-gray-900 text-center">{{ (currentPage - 1) * limit + index + 1 }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ formatDate(item.createdAt) }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item._id }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.prefixName }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.account }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.rewardName }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.rewardValue }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">
              <button type="button" @click="btnEditReward(item)">
                <img :src="iconEdit" class="w-[25px] h-[25px] object-contain">
              </button>
              <button type="button" @click="Btndelete(item._id)">
                <img :src="iconDelete" class="w-[25px] h-[25px] object-contain">
              </button>
            </td>
          </tr>

          <tr v-if="rewardStore.dataReward.length === 0">
            <td colspan="8" class="py-16 text-center">
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
      <Pagination :current-page="currentPage" :total-items="rewardStore.totalItems" :items-per-page="limit"
        :max-visible="5" @update:current-page="goToPage" />
    </div>
  </div>

  <div v-if="modalRewardCategory" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class=" bg-white w-full max-w-[450px] rounded-xl p-6">

      <form class="flex flex-col gap-4" @submit.prevent="submitRewardCategory">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">ชื่อรางวัลภาษาอังกฤษ</label>
          <input type="text" v-model="dataForm.rewardNameEN"
            class="border border-gray-300 rounded-md p-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent">
        </div>
        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-600">ชื่อรางวัลภาษาไทย</label>
          <input type="text" v-model="dataForm.rewardNameTH"
            class="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent">
        </div>
        <div class="flex justify-end gap-2 mt-2">
          <button type="button" @click="modalRewardCategory = false"
            class="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50 cursor-pointer">
            ยกเลิก
          </button>
          <button type="submit"
            class="px-4 py-2 text-sm rounded-md bg-violet-600 text-white hover:bg-violet-700 cursor-pointer">
            บันทึก
          </button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="modalAddWeb" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class=" bg-white w-full max-w-[450px] rounded-xl p-6">

      <form class="flex flex-col gap-4" @submit.prevent="submitPrefix">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">ชื่อย่อ</label>
          <input type="text" v-model="dataForm.shortCode"
            class="border border-gray-300 rounded-md p-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent">
        </div>
        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-600">เว็บไซต์</label>
          <input type="text" v-model="dataForm.domain"
            class="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent">
        </div>
        <div class="flex justify-end gap-2 mt-2">
          <button type="button" @click="modalAddWeb = false"
            class="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50 cursor-pointer">
            ยกเลิก
          </button>
          <button type="submit"
            class="px-4 py-2 text-sm rounded-md bg-violet-600 text-white hover:bg-violet-700 cursor-pointer">
            บันทึก
          </button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="modalAddReward" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class=" bg-white w-full max-w-[450px] rounded-xl p-6">

      <form class="flex flex-col gap-4" @submit.prevent="submitReward">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">เว็บไซต์</label>
          <button type="button" @click.stop="selectPrefix = !selectPrefix"
            class="border border-gray-300 flex flex-col items-start rounded-md p-2 h-[40px] text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent relative">
            <ul v-if="selectPrefix"
              class="w-full bg-white border border-gray-300 absolute left-0 top-12 right-0 flex flex-col items-start gap-2 rounded-md z-50">
              <li v-for="item in prefixStore.dataPrefix" @click.stop="togglePrefix(item)" class="p-2 w-full text-left">
                {{ item.shortCode }}
              </li>
            </ul>
            {{ dataForm.shortCode }}
          </button>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">ยูสเซอร์</label>
          <input type="text" v-model="dataForm.account"
            class="border border-gray-300 rounded-md p-2 h-[40px] text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent">
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">รายการ</label>
          <button type="button" @click.stop="selectRewardCategory = !selectRewardCategory"
            class="border border-gray-300 flex flex-col items-start rounded-md p-2 h-[40px] text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent relative">
            <ul v-if="selectRewardCategory"
              class="w-full bg-white border border-gray-300 absolute left-0 top-12 right-0 flex flex-col items-start gap-2 rounded-md z-50">
              <li v-for="item in rewardStore.dataCustomReward" @click.stop="toggleRewardCategory(item.rewardNameTH)"
                class="p-2 w-full text-left">
                {{ item.rewardNameTH }}
              </li>
            </ul>
            {{ dataForm.rewardNameTH }}
          </button>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">รางวัล</label>
          <input type="text" v-model="dataForm.rewardValue"
            class="border border-gray-300 rounded-md p-2 h-[40px] text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent">
        </div>
        <div class="flex justify-end gap-2 mt-2">
          <button type="button" @click="modalAddReward = false"
            class="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50 cursor-pointer">
            ยกเลิก
          </button>
          <button type="submit"
            class="px-4 py-2 text-sm rounded-md bg-violet-600 text-white hover:bg-violet-700 cursor-pointer">
            บันทึก
          </button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="modalEditReward" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class=" bg-white w-full max-w-[450px] rounded-xl p-6">

      <form class="flex flex-col gap-4" @submit.prevent="submitEditReward">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">เว็บไซต์</label>
          <button type="button" @click.stop="selectPrefixEdit = !selectPrefixEdit"
            class="border border-gray-300 flex flex-col items-start rounded-md p-2 h-[40px] text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent relative">
            <ul v-if="selectPrefixEdit"
              class="w-full bg-white border border-gray-300 absolute left-0 top-12 right-0 flex flex-col items-start gap-2 rounded-md z-50">
              <li v-for="item in prefixStore.dataPrefix" @click.stop="togglePrefix(item)" class="p-2 w-full text-left">
                {{ item.shortCode }}
              </li>
            </ul>
            {{ dataForm.shortCode }}
          </button>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">ยูสเซอร์</label>
          <input type="text" v-model="dataForm.account"
            class="border border-gray-300 rounded-md p-2 h-[40px] text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent">
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">รายการ</label>
          <button type="button" @click.stop="selectRewardCategoryEdit = !selectRewardCategoryEdit"
            class="border border-gray-300 flex flex-col items-start rounded-md p-2 h-[40px] text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent relative">
            <ul v-if="selectRewardCategoryEdit"
              class="w-full bg-white border border-gray-300 absolute left-0 top-12 right-0 flex flex-col items-start gap-2 rounded-md z-50">
              <li v-for="item in rewardStore.dataCustomReward" @click.stop="toggleRewardCategory(item.rewardNameTH)"
                class="p-2 w-full text-left">
                {{ item.rewardNameTH }}
              </li>
            </ul>
            {{ dataForm.rewardNameTH }}
          </button>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">รางวัล</label>
          <input type="text" v-model="dataForm.rewardValue"
            class="border border-gray-300 rounded-md p-2 h-[40px] text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent">
        </div>
        <div class="flex justify-end gap-2 mt-2">
          <button type="button" @click="modalEditReward = false"
            class="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50 cursor-pointer">
            ยกเลิก
          </button>
          <button type="submit"
            class="px-4 py-2 text-sm rounded-md bg-violet-600 text-white hover:bg-violet-700 cursor-pointer">
            บันทึก
          </button>
        </div>
      </form>
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