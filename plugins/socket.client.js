import io from 'socket.io-client'

export default defineNuxtPlugin(() => {
    const nuxtConfig = useRuntimeConfig()
    const socket = io(nuxtConfig.public.APP_URL)

    return {
        provide: {
            socket: socket
        }
    }
})
