// main.ts
import 'uno.css'
import { createApp } from 'vue'
import './style/reset.css'
import App from './App.vue'
import { setupStore } from './store'
import { setupRouter } from '@/router'

const app = createApp(App)

async function setupApp() {
  setupStore(app)

  await setupRouter(app)
  app.mount('#app')
}

setupApp()
