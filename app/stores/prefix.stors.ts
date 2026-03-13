import axios from "axios";

interface DataPrefix {
    _id: string
    domain: string
    shortCode: string
    tenantId: string
    createdAt: string
    updatedAt: string
}


interface ApiResponse {
    status: number
    data: DataPrefix[]
    message: string
}

export const usePrefix = defineStore("prefix", () => {
    const dataPrefix = ref<DataPrefix[]>([])
    const toastStore = useToastStore()


    const createPrefix = async (domain: string, shortCode: string) => {
        try {
            const response = await axios.post(`/api/prefix`, { domain, shortCode }, {
                withCredentials: true
            })
            const result = response.data
        } catch (error: any) {
            // console.log(error)
            toastStore.add(error.response?.data?.message, "error")

        }
    }

    const getPrefix = async () => {
        try {
            const response = await axios.get<ApiResponse>(`/api/prefix`, {
                withCredentials: true
            })
            const result = response.data
            dataPrefix.value = result.data
        } catch (error: any) {
            // console.log(error)
            toastStore.add(error.response?.data?.message, "error")

        }
    }

    return { dataPrefix, createPrefix, getPrefix, }
})