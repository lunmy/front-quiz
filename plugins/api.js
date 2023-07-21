import quizApi from '@/plugins/apis/quiz'
import axios from "axios";
export default defineNuxtPlugin((NuxtApp) =>{
    const config = useRuntimeConfig()
    let apiAxios = axios.create({
        baseUrl: config.public.apiUrl,
        headers: {
            common: {},
        },
    });
    return {
        provide: {
            quizApi: quizApi({axios: apiAxios, baseUrl: config.public.apiUrl}),
        }
    }
})
