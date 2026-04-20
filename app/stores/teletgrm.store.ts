import axios from 'axios'
import type { ApiResponse } from '~/types/api'
import { getErrorMessage } from '~/utils/error'

interface IGroup {
    _id: string
    uid_group: number
    title: string
    username: string
    invite_link: string
    createdAt: string
    updatedAt: string
}

interface IBot {
    _id: string
    bot_id: number
    title: string
    username: string
    bot_token: string
    createdAt: string
    updatedAt: string
}

interface SendMessagePayload {
    botId: string
    groupId: string
    message: string
    buttons: {
        text: string
        url?: string
    }[][]
}

interface CreateBotPayload {
    bot_token: string
}

interface CreateGroupPayload {
    uid_group: string
    title: string
}

const BASE_URL = 'http://localhost:8086/api'

export const useTelegram = defineStore('telegram', () => {
    const totalPages = ref<number>(0)
    const groups = ref<IGroup[]>([])
    const bots = ref<IBot[]>([])
    const toastStore = useToastStore()

    const getBots = async () => {
        try {
            const { data } = await axios.get<ApiResponse<IBot[]>>(`/api/telegram/bot`)

            if (data.success) {
                bots.value = data.data || []
                totalPages.value = data.totalPages || 0
            }
            return data
        } catch (err) {
            toastStore.error(getErrorMessage(err))
            console.error(err)
        }
    }

    const createBots = async (payload: CreateBotPayload) => {
        try {
            const { data } = await axios.post<ApiResponse<IBot>>(`/api/telegram/bot`, payload)
            return data
        } catch (err) {
            toastStore.error(getErrorMessage(err))
            // console.error(err)
        }
    }

    const getGroups = async () => {
        try {
            const { data } = await axios.get<ApiResponse<IGroup[]>>(`/api/telegram/group`)

            if (data.success) {
                groups.value = data.data || []
                totalPages.value = data.totalPages || 0
            }
            return data
        } catch (err) {
            toastStore.error(getErrorMessage(err))
            console.error(err)
        }
    }

    const createGroups = async (payload: CreateGroupPayload) => {
        try {
            const { data } = await axios.post<ApiResponse<IGroup>>(`/api/telegram/group`, payload)
            return data
        } catch (err) {
            toastStore.error(getErrorMessage(err))
            console.error(err)
        }
    }

    const sendMessageT = async (payload: SendMessagePayload) => {
        try {
            const { data } = await axios.post<ApiResponse<null>>(`/api/telegram/send-message`, payload)
            return data
        } catch (err) {
            toastStore.error(getErrorMessage(err))
            console.error(err)
        }
    }

    return { bots, groups, totalPages, createBots, createGroups, getGroups, getBots, sendMessageT }
})