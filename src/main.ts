// main.ts
import 'uno.css'
import { createApp } from 'vue'
import './style/reset.css'
import App from './App.vue'
import { setupRouter } from './router'
import { setupStore } from './store'

const app = createApp(App)

async function setupApp() {
  setupStore(app)

  await setupRouter(app)
  app.mount('#app')
}

setupApp()
