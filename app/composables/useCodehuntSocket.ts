// composables/useCodehuntSocket.ts
import { io, Socket } from 'socket.io-client'

export const useCodehuntSocket = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase
  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)

  const connect = (path: string, tokanAccess: string) => {
    socket.value = io(baseURL, {
      transports: ["websocket", "polling"],
      path: path,
      auth: {
        token: tokanAccess
      }
    })

    socket.value.on('connect', () => {
      console.log('✅ Socket connected')
      isConnected.value = true
    })

    socket.value.on('connect_error', (err) => {
      console.error('❌ Error:', err.message)
      isConnected.value = false
    })

    socket.value.on('disconnect', () => {
      console.log('🔌 Disconnected')
      isConnected.value = false
    })

    return socket.value
  }

  const disconnect = () => {
    socket.value?.disconnect()
    socket.value = null
    isConnected.value = false
  }

  const emit = (event: string, data: any) => {
    if (socket.value?.connected) {
      socket.value.emit(event, data)
    }
  }

  const on = (event: string, callback: Function) => {
    socket.value?.on(event, callback as any)
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    emit,
    on
  }
}