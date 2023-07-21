import resolveConfig  from 'tailwindcss/resolveConfig'
import  tailwindConfig  from '../tailwind.config.js'


export default defineNuxtPlugin(nuxtApp => {
  const fullConfig = resolveConfig(tailwindConfig)
  return {
    provide: {
      tailwindCSS : fullConfig.theme,
    }
  }
})
