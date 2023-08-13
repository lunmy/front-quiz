export default defineNuxtConfig({
    ssr: true,
    runtimeConfig: {
        public: {
            apiUrl: process.env.BASE_API_URL,
            appUrl: process.env.APP_URL,
            apiKey: process.env.API_KEY,
        },
    },

    devtools: {enabled: true},
    plugins: [
        //'@sidebase/nuxt-pdf',
    ],
    css: [
        '@mdi/font/css/materialdesignicons.min.css',
        '@/assets/css/main.scss',
    ],
    head: {
      title: 'Quiz App',
    },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    build: {
        transpile: ['vuetify'],
        postcss: {
            postcssOptions: {
                plugins: {
                    tailwindcss: {},
                    autoprefixer: {},
                },
            },
        },
    },
    modules: [
        '@invictus.codes/nuxt-vuetify',
        'nuxt-socket-io',
        '~/modules/socket',
    ],
    vuetify: {
        /* vuetify options */
        vuetifyOptions: {
            // @TODO: list all vuetify options
        },

        moduleOptions: {
            /* nuxt-vuetify module options */
            treeshaking: true | false,
            useIconCDN: true | false,

            /* vite-plugin-vuetify options */
            styles: true | 'none' | 'expose' | 'sass',
            autoImport: true | false,
            useVuetifyLabs: true | false,
        }
    },
    vite: {
        define: {
            'process.env.DEBUG': false,
        },
    },

    io: {
        // module options
        sockets: [{
            name: 'main',
            url: 'http://localhost:3000'
        }]
    }
})
