<script setup>
const auth = useAuthStore()

const handleLogout = async () => {
  await auth.logout()
  await navigateTo('/login')
}
</script>

<template>
  <div class="flex flex-col h-full justify-between p-2">

    <!-- Menu -->
    <ul class="flex flex-col gap-2">
      <nuxt-link to="/"
        class="flex items-center gap-2 p-2 text-sm font-normal text-gray-700 hover:bg-violet-500 hover:text-white rounded-md cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M5 12H4v8a2 2 0 0 0 2 2h5V12zm13 0h-5v10h5a2 2 0 0 0 2-2v-8zm.791-5A5 5 0 0 0 19 5.5C19 3.57 17.43 2 15.5 2c-1.622 0-2.705 1.482-3.404 3.085C11.407 3.57 10.269 2 8.5 2C6.57 2 5 3.57 5 5.5c0 .596.079 1.089.209 1.5H2v4h9V9h2v2h9V7zM7 5.5C7 4.673 7.673 4 8.5 4c.888 0 1.714 1.525 2.198 3H8c-.374 0-1 0-1-1.5M15.5 4c.827 0 1.5.673 1.5 1.5C17 7 16.374 7 16 7h-2.477c.51-1.576 1.251-3 1.977-3"
            stroke-width="0.5" stroke="currentColor" />
        </svg>
        กิจกรรมโค้ดปศินา
      </nuxt-link>

      <nuxt-link to="/"
        class="flex items-center gap-2 p-2 text-sm font-normal text-gray-700 hover:bg-violet-500 hover:text-white rounded-md cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M5 12H4v8a2 2 0 0 0 2 2h5V12zm13 0h-5v10h5a2 2 0 0 0 2-2v-8zm.791-5A5 5 0 0 0 19 5.5C19 3.57 17.43 2 15.5 2c-1.622 0-2.705 1.482-3.404 3.085C11.407 3.57 10.269 2 8.5 2C6.57 2 5 3.57 5 5.5c0 .596.079 1.089.209 1.5H2v4h9V9h2v2h9V7zM7 5.5C7 4.673 7.673 4 8.5 4c.888 0 1.714 1.525 2.198 3H8c-.374 0-1 0-1-1.5M15.5 4c.827 0 1.5.673 1.5 1.5C17 7 16.374 7 16 7h-2.477c.51-1.576 1.251-3 1.977-3"
            stroke-width="0.5" stroke="currentColor" />
        </svg>
        โค้ดปศินา
      </nuxt-link>

      <nuxt-link to="/reward"
        class="flex items-center gap-2 p-2 text-sm font-normal text-gray-700 hover:bg-violet-500 hover:text-white rounded-md cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M21 4h-3V3c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1v1H3c-.55 0-1 .45-1 1v3c0 4.29 1.79 6.88 4.81 6.99A6 6 0 0 0 11 17.91V20H8v2h8v-2h-3v-2.09a5.98 5.98 0 0 0 4.19-2.92C20.2 14.88 22 12.29 22 8V5c0-.55-.45-1-1-1M4 8V6h2v6c0 .28.03.56.06.83C4.22 12.12 4 9.31 4 8m9.85 3.62L12 10.65l-1.85.97l.35-2.06L9 8.1l2.07-.3l.93-1.88l.93 1.88l2.07.3l-1.5 1.46zM20 8c0 1.31-.22 4.12-2.06 4.83c.04-.27.06-.55.06-.83V6h2z"
            stroke-width="0.5" stroke="currentColor" />
        </svg>
        ประกาศรางวัล
      </nuxt-link>

      <li
        class="flex items-center gap-2 p-2 text-sm font-normal text-gray-700 hover:bg-violet-500 hover:text-white rounded-md cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M5 8.999a6.99 6.99 0 0 0 2.879 5.646l.001.001a7 7 0 0 0 1.881.979l.051.019a7 7 0 0 0 1.163.271a7 7 0 0 0 1.024.085H12c.35 0 .69-.034 1.027-.084l.182-.028q.505-.088.981-.243l.042-.016C17 14.693 19 12.078 19 8.999C19 5.14 15.86 2 12 2S5 5.14 5 8.999M12 4c2.756 0 5 2.242 5 4.999h-2A3.003 3.003 0 0 0 12 6zM7.521 16.795V22L12 20.5l4.479 1.5l.001-5.205a8.93 8.93 0 0 1-8.959 0"
            stroke-width="0.5" stroke="currentColor" />
        </svg>
        แจกรางวัล
      </li>

      <nuxt-link to="/line/users"
        class="flex items-center gap-2 p-2 text-sm font-normal text-gray-700 hover:bg-violet-500 hover:text-white rounded-md cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M21 4h-3V3c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1v1H3c-.55 0-1 .45-1 1v3c0 4.29 1.79 6.88 4.81 6.99A6 6 0 0 0 11 17.91V20H8v2h8v-2h-3v-2.09a5.98 5.98 0 0 0 4.19-2.92C20.2 14.88 22 12.29 22 8V5c0-.55-.45-1-1-1M4 8V6h2v6c0 .28.03.56.06.83C4.22 12.12 4 9.31 4 8m9.85 3.62L12 10.65l-1.85.97l.35-2.06L9 8.1l2.07-.3l.93-1.88l.93 1.88l2.07.3l-1.5 1.46zM20 8c0 1.31-.22 4.12-2.06 4.83c.04-.27.06-.55.06-.83V6h2z"
            stroke-width="0.5" stroke="currentColor" />
        </svg>
        ผู้ใช้ไลน์
      </nuxt-link>
      <nuxt-link to="/line/ratings"
        class="flex items-center gap-2 p-2 text-sm font-normal text-gray-700 hover:bg-violet-500 hover:text-white rounded-md cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M21 4h-3V3c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1v1H3c-.55 0-1 .45-1 1v3c0 4.29 1.79 6.88 4.81 6.99A6 6 0 0 0 11 17.91V20H8v2h8v-2h-3v-2.09a5.98 5.98 0 0 0 4.19-2.92C20.2 14.88 22 12.29 22 8V5c0-.55-.45-1-1-1M4 8V6h2v6c0 .28.03.56.06.83C4.22 12.12 4 9.31 4 8m9.85 3.62L12 10.65l-1.85.97l.35-2.06L9 8.1l2.07-.3l.93-1.88l.93 1.88l2.07.3l-1.5 1.46zM20 8c0 1.31-.22 4.12-2.06 4.83c.04-.27.06-.55.06-.83V6h2z"
            stroke-width="0.5" stroke="currentColor" />
        </svg>
        ประเมินพนักงาน
      </nuxt-link>
    </ul>

    <!-- Logout -->
    <div class="border-t border-gray-100 pt-2">
      <button type="button" @click="handleLogout"
        class="w-full flex items-center gap-2 p-2 text-sm font-normal text-red-400 hover:bg-red-50 hover:text-red-500 rounded-md cursor-pointer transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v1" />
        </svg>
        ออกจากระบบ
      </button>
    </div>

  </div>
</template>