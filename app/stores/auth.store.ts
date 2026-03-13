import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore('auth', () => {
    const hasSession = useCookie<Boolean | null>('hasSession', {
        sameSite: 'lax'
    })
    const localToken = useCookie<string>('local_token', {
        sameSite: 'lax'
    })
    const isAuthenticated = computed(() => !!hasSession.value)

    const toastStore = useToastStore()

    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post("/api/auth/login", {
                username,
                password
            }, {
                withCredentials: true
            })

            const result = response.data
            hasSession.value = true
            localToken.value = result.data.access_token

            return result

        } catch (error: any) {
            toastStore.add(error.response?.data?.errors.message, "error")

        }
    }

    const getProfile = async () => {
        try {
            const response = await axios.get("/api/auth/authenticate", { withCredentials: true })
            const result = response.data
            hasSession.value = true
            localToken.value = result.data.access_token

            return result
        } catch (error: any) {
            hasSession.value = null
            toastStore.add(error.response?.data?.errors.message, "error")
            throw error
        }
    }

    const refreshToken = async () => {
        try {
            const response = await axios.post('/api/auth/refresh', {}, {
                withCredentials: true
            });

            const result = response.data
            hasSession.value = true
            localToken.value = result.data.access_token
            return result
        } catch (error: any) {
            hasSession.value = null
            toastStore.add(error.response?.data?.errors.message, "error")
        }
    }

    const logout = async () => {
        try {
            const response = await axios.post('/api/auth/logout', {}, {
                withCredentials: true
            });

            const result = response.data
            console.log(result)
            hasSession.value = null
        } catch (error: any) {
            toastStore.add(error.response?.data?.message, "error")
        }
    }

    return { hasSession, localToken, isAuthenticated, login, getProfile, refreshToken, logout }
})