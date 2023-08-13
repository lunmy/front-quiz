import io from 'socket.io-client'

export default defineNuxtPlugin(() => {
    const nuxtConfig = useRuntimeConfig()
    const url = nuxtConfig.public.appUrl + ':' + nuxtConfig.public.socketPort
    const socket = io(url)

    return {
        provide: {
            socket: socket
        }
    }
})
