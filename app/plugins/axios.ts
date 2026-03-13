import axios from 'axios'

export default defineNuxtPlugin(() => {
    const auth = useAuthStore()
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBase
    let isRefreshing = false
    let failedQueue: any[] = []

    axios.defaults.baseURL = baseURL

    const processQueue = (error: any) => {
        failedQueue.forEach(({ resolve, reject }) => {
            error ? reject(error) : resolve()
        })
        failedQueue = []
    }

    axios.interceptors.response.use((response) => response, async (error) => {
        const originalRequest = error.config
        const errorCode = error.response?.data?.error?.code


        const RETRYABLE_ERRORS = [1104]
        const LOGOUT_ERRORS = [1105, 1106, 1107, 1100, 1103]

        if (LOGOUT_ERRORS.includes(errorCode)) {
            navigateTo("/login")
            return Promise.reject(error)
        }

        if (RETRYABLE_ERRORS.includes(errorCode) && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then(() => axios(originalRequest)).catch(err => Promise.reject(err))
            }
            originalRequest._retry = true
            isRefreshing = true

            try {
                await auth.refreshToken()
                processQueue(null)
                return axios(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError)
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }
        return Promise.reject(error)
    })
}) 