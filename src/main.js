import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import router from './router/index.js'
import axios from './http.js'

const app = createApp(App);
app.config.productionTp = false
app.use(Antd)
app.use(router)
app.config.globalProperties.$axios = axios;
// app.use(axios)
app.mount("#app")
