export default defineNuxtRouteMiddleware(async (to) => {
    const auth = useAuthStore()
    const isLoginPage = to.path === '/login'

    if (isLoginPage && auth.isAuthenticated) {
        console.log(isLoginPage, auth.isAuthenticated)
        return navigateTo("/")
    }

    if (isLoginPage) {
        return
    }

    if (!auth.isAuthenticated) {
        try {
            console.log('🔍 ไม่มี user, ลองเช็ค session...')
            await auth.getProfile()
            console.log('✅ มี session, โหลด user สำเร็จ')
        } catch (error) {
            console.log(error)
            console.log('⛔ ไม่มี session, redirect ไป /login')
            return navigateTo('/login')
        }
    }
})