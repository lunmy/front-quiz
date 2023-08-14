import {setStorage, getStorage} from "@/composables/storage";
export default defineNuxtRouteMiddleware(async (to, from) => {
    const token = getStorage('token')
    const router = useRouter();
    if (!token || token === '' || token === null || token === undefined) {
        return router.push('/admin/login')
    }
})
