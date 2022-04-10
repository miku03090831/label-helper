import axios from 'axios'
import router from './router'
import { message } from "ant-design-vue";
// 设置统一header
axios.interceptors.request.use(config => {
    if (localStorage.jwtoken)
        config.headers.Authorization = localStorage.jwtoken
    return config
}, error => {
    return Promise.reject(error)
})

// token过期处理
axios.interceptors.response.use(response => {
    return response
}, error => {

    message.error(error.response.data)

    const { status } = error.response
    if (status == 401) {
        message.error('token值无效，请重新登录')
        localStorage.removeItem('jwtoken')

        router.push('/login')
    }

    return Promise.reject(error)
})

export default axios