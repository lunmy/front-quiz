import {setStorage, getStorage} from "@/composables/storage";
export default defineNuxtRouteMiddleware(async (to, from) => {
    const token = getStorage('token')
    const router = useRouter();
    if (!token) {
        return router.push('/admin/login')
    }
    console.log('aaa')
})
