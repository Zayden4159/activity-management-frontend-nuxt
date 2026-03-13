import axios from "axios";

interface CodeHunt {
    _id: string
    account: string
    codes: string[]
    status: boolean
    reward: number
    rewardType: string
    startTime: string
    brands_id: string
    createdAt: string
    updatedAt: string
    topupByName: string
    topupBy: string
}

export interface ApiResponse {
    success: boolean
    status: number
    message: string
    data: CodeHunt[]
    totalItems: number
    pageLimit: number | null
    currentPage: number | null
    totalPages: number
}
export const useCodeHunt = defineStore('codehunt', () => {
    const dataCode = ref<CodeHunt[]>([])
    const totalItems = ref<number>(0)
    const totalPages = ref<number>(0)
    const toastStore = useToastStore()


    const getUserCredit = async (page: number, limit: number) => {
        try {
            const response = await axios.get<ApiResponse>(`/api/user/credit?page=${page}&limit=${limit}`, {
                withCredentials: true
            })
            const result = response.data
            dataCode.value = result.data
            totalItems.value = result.totalItems
            totalPages.value = result.totalPages

        } catch (error: any) {
            toastStore.add(error.response?.data?.message, "error")

            // console.log(error)

        }
    }

    const deleteUserCredit = async (id: string) => {
        try {
            const response = await axios.post('/api/delete/user', { id }, {
                withCredentials: true
            })
            const result = response.data
            toastStore.add(result.message, "success")

            return true
        } catch (error: any) {
            // console.log(error)
            toastStore.add(error.response?.data?.message, "error")
            return false
        }
    }
    return { dataCode, totalItems, totalPages, getUserCredit, deleteUserCredit }
})