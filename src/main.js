import { createSSRApp } from 'vue'
import { createRouter } from './router'
import { createStore } from './store'
import App from './App.vue'

export const createApp = () => {
  const app = createSSRApp(App)
  const router = createRouter()
  const pinia = createStore()
  const initialState = {}
  app.use(router).use(pinia)

  // https://pinia.vuejs.org/ssr/#state-hydration
  if (import.meta.env.SSR) {
    initialState.pinia = pinia.state.value
  } else {
    pinia.state.value = window.__INITIAL_STATE__
  }

  return {
    app,
    router,
    pinia,
    initialState
  }
}
