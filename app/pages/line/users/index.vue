<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: "custom" })
import formatDate from '~/utils/formatDate'

const authStore = useAuthStore()
const prefixStore = usePrefix()
const lineStore = useLine()
const { connect, on } = useCodehuntSocket()
const currentPage = ref<number>(1)
const limit = ref<number>(25)
const modalAddWeb = ref<boolean>(false)
const selectPrefix = ref<boolean>(false)
const modalAddLineConfig = ref<boolean>(false)
const modalSendFlex = ref<boolean>(false)
const modalEditUser = ref<boolean>(false)
const selectedEditUser = ref<any>(null)
const selectedUser = ref<any>(null)
const search = ref<string>("")
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

const initialLineConfig = {
  prefixId: "",
  lineName: "",
  lineId: "",
  lineToken: "",
  channelId: 0,
  channelSecret: "",
  isActive: true
}

const lineConfigForm = reactive({ ...initialLineConfig })

const initialEditForm = {
  details: {
    accountGame: "",
    firstName: "",
    lastName: "",
    bankAccount: "",
    bankName: "",
    phone: ""
  }
}

const editForm = reactive({ ...initialEditForm })


onMounted(async () => {
  await Promise.all([prefixStore.getPrefix(), lineStore.getUsers(currentPage.value, limit.value, "")])
  connect("/ws/line", authStore.localToken)

  on('new_user_line', (newUser: any) => {
    lineStore.dataUsers.unshift(newUser)
    lineStore.totalItems++
  })
})

const submitPrefix = async () => {
  await prefixStore.createPrefix(dataForm.domain, dataForm.shortCode)
  clearForm()
  await prefixStore.getPrefix()
}

const clearLineConfigForm = () => {
  Object.assign(lineConfigForm, initialLineConfig)
}

const submitLineConfig = async () => {
  await lineStore.createLineConfig(lineConfigForm)
  clearLineConfigForm()
  modalAddLineConfig.value = false
}

const openSendFlex = (user: any) => {
  selectedUser.value = user
  modalSendFlex.value = true
}

const confirmSendFlex = async () => {
  if (!selectedUser.value) return
  await lineStore.sendFlexMessage({
    userId: selectedUser.value._id,
    channelId: selectedUser.value.lineInfo?.channelId
  })
  modalSendFlex.value = false
  selectedUser.value = null
}

const openEditUser = (user: any) => {
  selectedEditUser.value = user
  editForm.details.accountGame = user.details?.accountGame || ""
  editForm.details.firstName = user.details?.firstName || ""
  editForm.details.lastName = user.details?.lastName || ""
  editForm.details.bankAccount = user.details?.bankAccount || ""
  editForm.details.bankName = user.details?.bankName || ""
  editForm.details.phone = user.details?.phone || ""
  modalEditUser.value = true
}

const confirmEditUser = async () => {
  if (!selectedEditUser.value) return
  await lineStore.updateUser({ id: selectedEditUser.value._id, ...editForm })
  await lineStore.getUsers(currentPage.value, limit.value)
  modalEditUser.value = false
  selectedEditUser.value = null
}

const clearForm = () => {
  Object.assign(dataForm, initialForm)
}

const onSearch = async () => {
  currentPage.value = 1
  await lineStore.getUsers(currentPage.value, limit.value, search.value)
}


const goToPage = async (page: number) => {
  currentPage.value = page
  await lineStore.getUsers(page, limit.value, search.value)
}
</script>
<template>
  <div class="flex gap-2 mb-2">
    <button type="button" @click="modalAddWeb = true"
      class="p-2 text-sm text-gray-600 border border-gray-200 rounded-sm hover:bg-violet-700 hover:text-white cursor-pointer">เพิ่มเว็บ</button>
    <button type="button" @click="modalAddLineConfig = true"
      class="p-2 text-sm text-gray-600 border border-gray-200 rounded-sm hover:bg-violet-700 hover:text-white cursor-pointer">
      เพิ่ม LINE Config
    </button>
    <button type="button" @click="lineStore.exportUsers()"
      class="p-2 text-sm text-gray-600 border border-gray-200 rounded-sm hover:bg-green-600 hover:text-white cursor-pointer">
      Export Excel
    </button>
    <!-- ช่องค้นหา -->
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
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr class="hover:bg-gray-50 transition-colors whitespace-nowrap" v-for="(item, index) in lineStore.dataUsers">
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
            <td class="px-6 py-4 text-sm">
              <div class="flex gap-2">
                <button @click="openSendFlex(item)" :disabled="!item.lineInfo?.channelId"
                  class="px-3 py-1 text-xs rounded-sm border transition-colors" :class="item.lineInfo?.channelId
                    ? 'border-green-400 text-green-600 hover:bg-green-600 hover:text-white'
                    : 'border-gray-200 text-gray-300 cursor-not-allowed'">
                  ส่ง Flex
                </button>
                <button @click="openEditUser(item)"
                  class="px-3 py-1 text-xs rounded-sm border border-violet-400 text-violet-600 hover:bg-violet-600 hover:text-white transition-colors">
                  แก้ไข
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="lineStore.dataUsers.length === 0">
            <td colspan="6" class="py-16 text-center">
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

  <div v-if="modalAddLineConfig" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-[450px] rounded-xl p-6">
      <h2 class="text-sm font-medium text-gray-700 mb-4">เพิ่ม LINE Config</h2>
      <form class="flex flex-col gap-4" @submit.prevent="submitLineConfig">

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">เว็บไซต์ (Prefix)</label>
          <button type="button" @click.stop="selectPrefix = !selectPrefix"
            class="border border-gray-300 flex items-start rounded-md p-2 h-[40px] text-sm text-gray-600 relative">
            <ul v-if="selectPrefix"
              class="w-full bg-white border border-gray-300 absolute left-0 top-12 right-0 flex flex-col gap-2 rounded-md z-50">
              <li v-for="item in prefixStore.dataPrefix"
                @click.stop="() => { lineConfigForm.prefixId = item._id; dataForm.shortCode = item.shortCode; selectPrefix = false }"
                class="p-2 w-full text-left hover:bg-gray-50">
                {{ item.shortCode }}
              </li>
            </ul>
            {{ dataForm.shortCode || 'เลือกเว็บไซต์' }}
          </button>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">ชื่อ LINE OA</label>
          <input type="text" v-model="lineConfigForm.lineName"
            class="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">LINE ID (@xxxx)</label>
          <input type="text" v-model="lineConfigForm.lineId"
            class="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">LINE Token</label>
          <input type="text" v-model="lineConfigForm.lineToken"
            class="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">Channel ID</label>
          <input type="number" v-model="lineConfigForm.channelId"
            class="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">Channel Secret</label>
          <input type="text" v-model="lineConfigForm.channelSecret"
            class="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
        </div>

        <div class="flex justify-end gap-2 mt-2">
          <button type="button" @click="modalAddLineConfig = false; clearLineConfigForm()"
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

  <!-- ก่อนปิด </template> -->
  <Teleport to="body">
    <div v-if="modalSendFlex" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-sm shadow-lg w-80 p-6 flex flex-col gap-4">
        <h3 class="text-sm font-medium text-gray-700">ยืนยันการส่ง Flex Message</h3>
        <p class="text-sm text-gray-500">
          ส่งแบบประเมินความพึงพอใจให้
          <span class="font-medium text-gray-700">{{ selectedUser?.displayName || selectedUser?.userID }}</span> ?
        </p>
        <div class="flex gap-2 justify-end">
          <button @click="modalSendFlex = false"
            class="px-4 py-2 text-sm border border-gray-200 text-gray-600 rounded-sm hover:bg-gray-50">
            ยกเลิก
          </button>
          <button @click="confirmSendFlex"
            class="px-4 py-2 text-sm bg-green-600 text-white rounded-sm hover:bg-green-700">
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <Teleport to="body">
    <div v-if="modalEditUser" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-sm shadow-lg w-[450px] p-6 flex flex-col gap-4">
        <h3 class="text-sm font-medium text-gray-700">แก้ไขข้อมูลผู้ใช้</h3>
        <form class="flex flex-col gap-3" @submit.prevent="confirmEditUser">

          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-gray-400">ชื่อที่แสดง (LINE)</label>
            <input type="text" :value="selectedEditUser?.displayName || '-'" disabled
              class="border border-gray-200 rounded-md p-2 text-sm text-gray-400 bg-gray-50 cursor-not-allowed" />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-gray-400">User ID</label>
            <input type="text" :value="selectedEditUser?.userID || '-'" disabled
              class="border border-gray-200 rounded-md p-2 text-sm text-gray-400 bg-gray-50 cursor-not-allowed" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1">
              <label class="text-xs font-medium text-gray-600">ชื่อจริง</label>
              <input type="text" v-model="editForm.details.firstName"
                class="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-medium text-gray-600">นามสกุล</label>
              <input type="text" v-model="editForm.details.lastName"
                class="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-gray-600">ยูสเซอร์เกม</label>
            <input type="text" v-model="editForm.details.accountGame"
              class="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1">
              <label class="text-xs font-medium text-gray-600">ธนาคาร</label>
              <input type="text" v-model="editForm.details.bankName"
                class="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-medium text-gray-600">เลขบัญชี</label>
              <input type="text" v-model="editForm.details.bankAccount"
                class="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-gray-600">เบอร์โทร</label>
            <input type="text" v-model="editForm.details.phone"
              class="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>

          <div class="flex gap-2 justify-end mt-2">
            <button type="button" @click="modalEditUser = false"
              class="px-4 py-2 text-sm border border-gray-200 text-gray-600 rounded-sm hover:bg-gray-50">
              ยกเลิก
            </button>
            <button type="submit" class="px-4 py-2 text-sm bg-violet-600 text-white rounded-sm hover:bg-violet-700">
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>