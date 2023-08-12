import quizApi from '@/plugins/apis/quiz'
import axios from "axios";
import {getStorage} from "@/composables/storage";

export default defineNuxtPlugin((NuxtApp) =>{
    const config = useRuntimeConfig()
    let apiAxios = axios.create({
        baseUrl: config.public.apiUrl,
    });

    apiAxios.interceptors.request.use((config) => {
        const nuxtConfig = useRuntimeConfig()
        const token = getStorage('token');
        if(token === undefined || token === null || token === '') {
            config.headers['X-Api-Key'] = nuxtConfig.public.apiKey
        }
        else{
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    })


    return {
        provide: {
            quizApi: quizApi({axios: apiAxios, baseUrl: config.public.apiUrl}),
        }
    }
})
