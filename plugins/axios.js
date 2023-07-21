import axios from "axios";
export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    let apiAxios = axios.create({
        baseUrl: config.public.apiUrl,
        headers: {
            common: {},
        },
    });
    return {
        provide: {
            axios: apiAxios,
        },
    };
});
