<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: "custom" })

interface TelegramButton {
    text: string
    url?: string
}

interface CreateGroupPayload {
    uid_group: string
    title: string
}
type ButtonAction = 'add-to-row' | 'add-new-row'

const toast = useToastStore()
const telegramStore = useTelegram()
const messageText = ref<string>('')
const selectedGroupIds = ref<Set<string>>(new Set())
const selectedBotIds = ref<Set<string>>(new Set())
const isAddBotModalOpen = ref<boolean>(false)
const isAddGroupModalOpen = ref<boolean>(false)
const isAddNameModalOpen = ref<boolean>(false)
const botTokenInput = ref<string>('')
const buttonTelegram = ref<TelegramButton[][]>([])
const MAX_BUTTONS_PER_ROW = 3
const pendingAction = ref<ButtonAction | null>(null)
const dataButtonTelegram = reactive<TelegramButton>({
    text: '',
    url: ''
})
const groupInput = reactive<CreateGroupPayload>({
    uid_group: '',
    title: ''
})

onMounted(async () => {
    await telegramStore.getBots()
    await telegramStore.getGroups()
})

const selectedBot = computed(() => telegramStore.bots.filter(d => selectedBotIds.value.has(d._id)))
const botId = computed(() => selectedBot.value.length > 0 ? selectedBot.value.map(v => v.bot_id).join() : '')

const selectedGroups = computed(() => telegramStore.groups.filter(d => selectedGroupIds.value.has(d._id)))
const chatIdGroup = computed(() => selectedGroups.value.length > 0 ? selectedGroups.value.map(v => v.uid_group).join() : '')
const nameGroup = computed(() => selectedGroups.value.length > 0 ? selectedGroups.value.map(v => v.title).join() : 'ยังไม่ได้เลือกกลุ่ม')


const toggleGroup = (id: string) => {
    if (selectedGroupIds.value.has(id)) {
        selectedGroupIds.value.delete(id)
    } else {
        selectedGroupIds.value.add(id)
    }
}
const toggleBot = (id: string) => {
    if (selectedBotIds.value.has(id)) {
        selectedBotIds.value.delete(id)
    } else {
        selectedBotIds.value.add(id)
    }

}
const handleSendMessage = async () => {
    if (selectedBot.value.length === 0) {
        toast.error('กรุณาเลือกบอท')
        return
    }

    if (selectedGroups.value.length === 0) {
        toast.error('กรุณาเลือกกลุ่ม')
        return
    }
    if (!messageText.value.trim()) {
        toast.error('กรุณาพิมพ์ข้อความ')
        return
    }
    await telegramStore.sendMessageT({ botId: botId.value, groupId: chatIdGroup.value, message: messageText.value, buttons: buttonTelegram.value })

    buttonTelegram.value = []
}

const handleAddBot = async () => {
    if (!botTokenInput.value.trim()) {
        toast.error('กรุณากรอก Bot Token')
        return
    }
    const res = await telegramStore.createBots({ bot_token: botTokenInput.value })

    if (res?.success) {
        toast.success('เพิ่มบอทสำเร็จ')
        isAddBotModalOpen.value = false
        botTokenInput.value = ''
        await telegramStore.getBots()
    }
}

const openAddButtonModal = (action: ButtonAction) => {
    pendingAction.value = action
    dataButtonTelegram.text = ''
    dataButtonTelegram.url = ''
    isAddNameModalOpen.value = true
}

const confirmAddButton = () => {
    if (!dataButtonTelegram.text || !dataButtonTelegram.url) return

    const newBtn = { text: dataButtonTelegram.text, url: dataButtonTelegram.url }

    if (pendingAction.value === 'add-to-row') {
        const lastRow = buttonTelegram.value.at(-1)

        if (!lastRow || lastRow?.length >= MAX_BUTTONS_PER_ROW) {
            buttonTelegram.value.push([newBtn])
        } else {
            lastRow.push(newBtn)
        }

    } else {
        buttonTelegram.value.push([newBtn])
    }

    isAddNameModalOpen.value = false
    pendingAction.value = null
}

const handleRemoveButton = (rowIdx: number, btnIdx: number) => {
    const row = buttonTelegram.value[rowIdx]

    if (!row) return

    row.splice(btnIdx, 1)
    // ถ้าแถวว่าง ลบแถวทิ้ง
    if (row.length === 0) {
        buttonTelegram.value.splice(rowIdx, 1)
    }
}


const handleAddGroup = async () => {
    if (!groupInput.uid_group.trim() || !groupInput.title.trim()) {
        toast.error('กรุณากรอกข้อมูลให้ครบ')
        return
    }

    const res = await telegramStore.createGroups({ uid_group: groupInput.uid_group, title: groupInput.title })

    if (res?.success) {
        toast.success('เพิ่มกลุ่มสำเร็จ')
        isAddGroupModalOpen.value = false
        groupInput.uid_group = ''
        groupInput.title = ''
        await telegramStore.getGroups()
    }
}


</script>
<template>
    <div class="w-full flex gap-4">
        <div class="w-[50%] flex flex-col gap-4">
            <div class="flex items-center gap-3">
                <h2 class="text-gray-700 font-medium text-sm whitespace-nowrap">เลือกบอท</h2>
                <div class="flex-1 h-px bg-gray-200"></div>
                <button type="button" class="text-sm  border border-gray-200 p-2 rounded-md"
                    @click="isAddBotModalOpen = true">เพิ่มบอท</button>
            </div>
            <div class="flex flex-col gap-4">
                <div class="grid grid-cols-3 gap-2">
                    <div class=" flex items-center gap-2 text-sm text-gray-700 p-2 border border-gray-300 rounded-lg cursor-pointer"
                        v-for="item in telegramStore.bots" @click="toggleBot(item._id)" :class="selectedBotIds.has(item._id) ? 'border-violet-500 bg-violet-50 text-violet-700'
                            : 'border-gray-200 text-gray-600 hover:border-violet-300 hover:bg-violet-50/50'">
                        <div class="w-12 h-12 border border-gray-300 rounded-full"></div>
                        <div>
                            <h4 class="text-gray-600 text-sm">{{ item.title }}</h4>
                            <p class="text-gray-600 text-xs">{{ item.username }}</p>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <h2 class="text-gray-700 font-medium text-sm whitespace-nowrap">เลือกกลุ่ม</h2>
                    <div class="flex-1 h-px bg-gray-200"></div>
                    <button class="text-sm  border border-gray-200 p-2 rounded-md"
                        @click="isAddGroupModalOpen = true">เพิ่มกลุ่ม</button>
                </div>
                <div class="grid grid-cols-3 gap-2">
                    <div class=" flex items-center gap-2 text-sm text-gray-700 p-2 border border-gray-300 rounded-lg cursor-pointer"
                        v-for="item in telegramStore.groups" @click="toggleGroup(item._id)" :class="selectedGroupIds.has(item._id) ? 'border-violet-500 bg-violet-50 text-violet-700'
                            : 'border-gray-200 text-gray-600 hover:border-violet-300 hover:bg-violet-50/50'">
                        <div class="w-12 h-12 border border-gray-300 rounded-full"></div>
                        <div>
                            <h4 class="text-gray-600 text-sm">{{ item.title }}</h4>
                            <p class="text-gray-600 text-xs"> ID: {{ item.uid_group }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <textarea rows="7" maxlength="4000" v-model="messageText"
                    class="w-full  border border-gray-200 rounded-lg p-2 text-sm text-gray-700  outline-none resize-none"
                    placeholder="พิมพ์ข้อความที่ต้องการส่ง...&#10;&#10;รองรับ Markdown: **ตัวหนา**, _ตัวเอียง_, `code`"></textarea>

                <button type="button" @click="handleSendMessage"
                    class="p-2 text-sm text-gray-600 border border-gray-200 rounded-sm hover:bg-violet-700 hover:text-white cursor-pointer">
                    ส่งข้อความ
                </button>
            </div>
        </div>
        <div class="w-[50%] flex flex-col gap-4">
            <div class="h-[500px] flex flex-col border border-gray-300 rounded-lg">
                <div class="flex items-center gap-2 border-b border-gray-300 p-2">
                    <div class="w-12 h-12 border border-gray-300 rounded-full"></div>
                    <div>
                        <h2 class="text-gray-700 font-medium text-sm">{{ nameGroup }}</h2>
                    </div>
                </div>
                <div class="flex-1 bg-gray-100 p-2 overflow-y-auto">
                    <template v-if="messageText">
                        <div class="w-[300px] flex flex-col ">
                            <div class="bg-white p-3 gap-2 border-none rounded-lg">
                                <p class=" text-sm font-bold text-blue-500">{{ nameGroup }}</p>
                                <p class="text-[13px] text-gray-600 font-medium whitespace-pre-wrap break-all"
                                    v-html="messageText">

                                </p>
                                <p class="text-[12px] text-gray-500 font-medium text-right">11:20</p>
                            </div>
                            <div v-if="buttonTelegram.length > 0" class="border-t border-gray-200">

                                <div v-for="(row, rowIdx) in buttonTelegram" :key="rowIdx"
                                    class="flex border-b border-gray-200 last:border-b-0">
                                    <div class="relative group flex-1 border-r border-gray-200 last:border-r-0"
                                        v-for="(btn, btnIdx) in row" :key="btnIdx">
                                        <div class="px-3 py-2.5 text-[13px] text-blue-500 font-medium 
                hover:bg-gray-50 transition-colors text-center">
                                            <span>{{ btn.text }}</span>
                                            <span v-if="btn.url" class="ml-1 text-[10px] opacity-60">↗</span>
                                        </div>
                                        <button @click="handleRemoveButton(rowIdx, btnIdx)" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white 
                   rounded-full opacity-0 group-hover:opacity-100 text-xs
                   flex items-center justify-center leading-none">
                                            ×
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex gap-2 mt-3">
                            <button @click="openAddButtonModal('add-to-row')"
                                class="px-3 py-1.5 text-xs rounded-md bg-violet-600 text-white hover:bg-violet-700">
                                + ปุ่มในแถวเดิม
                            </button>
                            <button @click="openAddButtonModal('add-new-row')"
                                class="px-3 py-1.5 text-xs rounded-md bg-violet-100 text-violet-700 hover:bg-violet-200">
                                + แถวใหม่
                            </button>
                        </div>

                    </template>
                    <template v-else>
                        <div class="h-full flex flex-col items-center justify-center">ตัวอย่างข้อความแสดงที่นี่
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
    <div v-if="isAddBotModalOpen" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white w-full max-w-[450px] rounded-xl p-6">
            <h2 class="text-sm font-medium text-gray-700 mb-4">เพิ่มบอท Telegram</h2>
            <form class="flex flex-col gap-4" @submit.prevent="handleAddBot">
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-600">Token Bot</label>
                    <input type="text" v-model="botTokenInput"
                        class="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
                </div>

                <div class="flex justify-end gap-2 mt-2">
                    <button type="button" @click="isAddBotModalOpen = false"
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

    <div v-if="isAddGroupModalOpen" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white w-full max-w-[450px] rounded-xl p-6">
            <h2 class="text-sm font-medium text-gray-700 mb-4">เพิ่มกลุ่ม Telegram</h2>
            <form class="flex flex-col gap-4" @submit.prevent="handleAddGroup">
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-600">ชื่อกลุ่ม</label>
                    <input type="text" v-model="groupInput.title" class="border border-gray-300 rounded-md p-2 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-gray-300" />
                </div>
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-600">Group ID (uid_group)</label>
                    <input type="text" v-model="groupInput.uid_group" placeholder="-1001234567890" class="border border-gray-300 rounded-md p-2 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-gray-300" />
                    <span class="text-xs text-gray-500">
                        ส่งคำสั่ง /id ในกลุ่มเพื่อดู Group ID
                    </span>
                </div>

                <div class="flex justify-end gap-2 mt-2">
                    <button type="button" @click="isAddGroupModalOpen = false"
                        class="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50">
                        ยกเลิก
                    </button>
                    <button type="submit"
                        class="px-4 py-2 text-sm rounded-md bg-violet-600 text-white hover:bg-violet-700">
                        บันทึก
                    </button>
                </div>
            </form>
        </div>
    </div>

    <div v-if="isAddNameModalOpen" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white w-full max-w-[450px] rounded-xl p-6">
            <h2 class="text-sm font-medium text-gray-700 mb-4">เพิ่ม Bot Telgram</h2>
            <form class="flex flex-col gap-4" @submit.prevent="confirmAddButton">
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-600">ชื่อปุ่ม</label>
                    <input type="text" v-model="dataButtonTelegram.text"
                        class="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
                </div>
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-600">ลิ้ง</label>
                    <input type="text" v-model="dataButtonTelegram.url"
                        class="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
                </div>

                <div class="flex justify-end gap-2 mt-2">
                    <button type="button" @click="isAddNameModalOpen = false"
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
</template>