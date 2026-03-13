import axios from "axios";

interface DataReward {
    _id: string
    account: string
    prefix: string
    prefixName: string
    rewardName: string
    rewardValue: number
    createdAt: string
    updatedAt: string
}

interface DCustomReward {
    _id: string
    rewardNameEN: string
    rewardNameTH: string
    createdAt: string
    updatedAt: string
}

interface RCustomReward {
    status: number
    data: DCustomReward[]
    message: string
}

interface ApiResponse {
    status: number
    data: DataReward[]
    message: string
    currentPage: number
    total: number
    totalPage: number

}

interface CReward {
    account: string
    prefix: string
    rewardName: string
    rewardValue: number
}

interface EReward {
    _id: string
    account: string
    prefix: string
    rewardName: string
    rewardValue: number
}

export const useReward = defineStore("reward", () => {
    const dataReward = ref<DataReward[]>([])
    const dataCustomReward = ref<DCustomReward[]>([])
    const totalItems = ref<number>(0)
    const toastStore = useToastStore()

    const getReward = async (page: number, limit: number) => {
        try {
            const response = await axios.get<ApiResponse>(`/api/reward?page=${page}&limit=${limit}`, {
                withCredentials: true
            })
            const result = response.data
            dataReward.value = result.data
            totalItems.value = result.total
        } catch (error: any) {
            console.log(error)
            toastStore.add(error.response?.data?.message, "error")
        }
    }

    const createReward = async (data: CReward) => {
        try {
            const response = await axios.post("/api/reward", data, {
                withCredentials: true
            })
            const result = response.data
            // console.log(result)
        } catch (error: any) {
            console.log(error.response?.data?.message)
            toastStore.add(error.response?.data?.message, "error")
        }

    }

    const editReward = async (data: EReward) => {
        try {
            const response = await axios.put(`/api/reward/${data._id}`, data, {
                withCredentials: true
            })
            const result = response.data
            toastStore.add(result.message, "success")
            // console.log(result)
        } catch (error: any) {
            console.log(error)
            toastStore.add(error.response?.data?.message, "error")
        }

    }

    const deleteReward = async (id: string) => {
        try {
            const response = await axios.delete(`/api/reward/${id}`, {
                withCredentials: true
            })
            const result = response.data
            toastStore.add(result.message, "success")
        } catch (error: any) {
            console.log(error)
            toastStore.add(error.response?.data?.message, "error")
        }

    }

    const createCustomReward = async (rewardNameEN: string, rewardNameTH: string) => {
        try {
            const response = await axios.post("/api/custom-reward", { rewardNameEN, rewardNameTH }, {
                withCredentials: true
            })
            const result = response.data
            // console.log(result)
        } catch (error: any) {
            console.log(error)
            toastStore.add(error.response?.data?.message, "error")
        }

    }

    const getCustomReward = async () => {
        try {
            const response = await axios.get<RCustomReward>("/api/custom-reward", {
                withCredentials: true
            })
            const result = response.data
            dataCustomReward.value = result.data
        } catch (error: any) {
            console.log(error)
            toastStore.add(error.response?.data?.message, "error")
        }

    }

    return { dataReward, dataCustomReward, totalItems, getReward, createReward, editReward, deleteReward, createCustomReward, getCustomReward }
})