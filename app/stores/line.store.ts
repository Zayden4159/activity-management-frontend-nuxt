import axios from "axios";

interface DataUsers {
    _id: string
    userID: string | null
    displayName: string | null
    picturUrl: string | null
    details: {
        accountGame: string | null,
        firstName: string | null,
        lastName: string | null,
        bankAccount: string | null,
        bankName: string | null,
        phone: string | null
    }
    prefix: {
        shortCode: string | null,
        tenantId: string | null,
        domain: string | null
    },
    lineInfo: {
        lineId: string | null,
        lineName: string | null,
        channelId: string | null
    }
    createdAt: string
    updatedAt: string
}
interface DataRatings {
    _id: string
    userID: string | null
    displayName: string | null
    score: number | null
    details: {
        accountGame: string | null,
        firstName: string | null,
        lastName: string | null,
        bankAccount: string | null,
        bankName: string | null,
        phone: string | null
    }
    prefix: {
        shortCode: string | null,
        tenantId: string | null,
        domain: string | null
    },
    lineInfo: {
        lineId: string | null,
        lineName: string | null,
        channelId: string | null
    },
    createdAt: string
    updatedAt: string
}


interface ApiResponseUsers {
    status: number
    data: DataUsers[]
    message: string
    currentPage: number
    total: number
    totalPage: number
}

interface ApiResponseRatings {
    status: number
    data: DataRatings[]
    message: string
    currentPage: number
    total: number
    totalPage: number
}

interface ILineConfig {
    prefixId: string
    lineName: string
    lineId: string
    lineToken: string
    channelId: number
    channelSecret: string
    isActive: boolean
}

interface IFlexMessage {
    userId: string
    channelId: number
}

export const useLine = defineStore("line", () => {
    const dataUsers = ref<DataUsers[]>([])
    const dataRatings = ref<DataRatings[]>([])
    const totalItems = ref<number>(0)
    const toastStore = useToastStore()

    const createLineConfig = async (data: ILineConfig) => {
        try {
            const response = await axios.post("/api/line/config", data, {
                withCredentials: true
            })

            const result = response.data
            return result
        } catch (error: any) {
            toastStore.add(error.response?.data?.error?.message, "error")

        }
    }

    const sendFlexMessage = async (data: IFlexMessage) => {
        try {
            const response = await axios.post("/api/line/send/flex-message", data, {
                withCredentials: true
            })

            const result = response.data
            return result
        } catch (error: any) {
            toastStore.add(error.response?.data?.error?.message, "error")

        }
    }

    const updateUser = async (data: any) => {
        try {
            const response = await axios.post("/api/line/user/update", data, {
                withCredentials: true
            })

            const result = response.data
            return result
        } catch (error: any) {
            toastStore.add(error.response?.data?.error?.message, "error")

        }
    }

    const getUsers = async (page: Number, limit: Number, search?: string) => {
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(search ? { search } : {})
            })
            const response = await axios.get<ApiResponseUsers>(`/api/line/users?${query}`, {
                withCredentials: true
            })
            const result = response.data
            dataUsers.value = result.data
            totalItems.value = result.total
        } catch (error: any) {
            toastStore.add(error.response?.data?.error?.message, "error")

        }
    }

    const getRatings = async (page: Number, limit: Number, search?: string) => {
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(search ? { search } : {})
            })
            const response = await axios.get<ApiResponseRatings>(`/api/line/ratings?${query}`, {
                withCredentials: true
            })
            const result = response.data
            dataRatings.value = result.data
            totalItems.value = result.total
        } catch (error: any) {
            // console.log(error)
            toastStore.add(error.response?.data?.error?.message, "error")

        }
    }

    const exportUsers = async () => {
        try {
            const batchSize = 500
            let page = 1
            let allRows: Record<string, string>[] = []
            let hasMore = true

            while (hasMore) {
                const response = await axios.get<ApiResponseUsers>(
                    `/api/line/users?page=${page}&limit=${batchSize}`,
                    { withCredentials: true }
                )
                const { data, totalPage } = response.data

                const rows: Record<string, string>[] = data.map(u => {
                    const { date, time } = formatExportDate(u.createdAt)
                    return {
                        date,
                        time,
                        userID: u.userID || "",
                        displayName: u.displayName || "",
                        firstName: u.details?.firstName || "",
                        lastName: u.details?.lastName || "",
                        accountGame: u.details?.accountGame || "",
                        bankName: u.details?.bankName || "",
                        bankAccount: u.details?.bankAccount || "",
                        phone: u.details?.phone || "",
                        lineId: u.lineInfo?.lineId || "",
                        lineName: u.lineInfo?.lineName || "",
                        shortCode: u.prefix?.shortCode || "",
                    }
                })

                allRows = [...allRows, ...rows]
                hasMore = page < totalPage
                page++
            }

            if (allRows.length === 0) {
                toastStore.add("ไม่มีข้อมูล", "error")
                return
            }

            const headers = Object.keys(allRows[0]!).join(",")
            const csv = [headers, ...allRows.map(r => Object.values(r).join(","))].join("\n")

            const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `${crypto.randomUUID()}.csv`
            a.click()
            URL.revokeObjectURL(url)

        } catch (error: any) {
            toastStore.add(error.response?.data?.error?.message, "error")
        }
    }

    const exportRatings = async () => {
        try {
            const batchSize = 500
            let page = 1
            let allRows: Record<string, string>[] = []
            let hasMore = true

            while (hasMore) {
                const response = await axios.get<ApiResponseRatings>(
                    `/api/line/ratings?page=${page}&limit=${batchSize}`,
                    { withCredentials: true }
                )
                const { data, totalPage } = response.data

                const rows: Record<string, string>[] = data.map(u => {
                    const { date, time } = formatExportDate(u.createdAt)
                    return {
                        date,
                        time,
                        userID: u.userID || "",
                        displayName: u.displayName || "",
                        score: u.score?.toString() || "",
                        lineId: u.lineInfo?.lineId || "",
                        lineName: u.lineInfo?.lineName || "",
                        shortCode: u.prefix?.shortCode || "",
                    }
                })

                allRows = [...allRows, ...rows]
                hasMore = page < totalPage
                page++
            }

            if (allRows.length === 0) {
                toastStore.add("ไม่มีข้อมูล", "error")
                return
            }

            const headers = Object.keys(allRows[0]!).join(",")
            const csv = [headers, ...allRows.map(r => Object.values(r).join(","))].join("\n")

            const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `${crypto.randomUUID()}.csv`
            a.click()
            URL.revokeObjectURL(url)

        } catch (error: any) {
            toastStore.add(error.response?.data?.error?.message, "error")
        }
    }

    const formatExportDate = (dateStr: string) => {
        const d = new Date(dateStr)
        const date = d.toLocaleDateString('th-TH')
        const time = d.toLocaleTimeString('th-TH')
        return { date, time }
    }

    return { dataUsers, dataRatings, totalItems, createLineConfig, sendFlexMessage, updateUser, getUsers, getRatings, exportUsers, exportRatings }
})