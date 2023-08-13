import io from 'socket.io-client'

export default defineNuxtPlugin(() => {
    const nuxtConfig = useRuntimeConfig()
    const socket = io()

    return {
        provide: {
            socket: socket
        }
    }
})
