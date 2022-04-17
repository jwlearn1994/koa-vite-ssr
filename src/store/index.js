import { createPinia } from 'pinia'

const modules = import.meta.glob('./modules/**/*.js')

export const createStore = () => {
  const pinia = createPinia()

  // https://pinia.vuejs.org/ssr/#using-the-store-outside-of-setup
  Object.keys(modules).forEach((name) => {
    const useModule = modules[name]
    useModule(pinia)
  })

  return pinia
}
