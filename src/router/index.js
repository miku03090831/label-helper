import { createRouter,createWebHistory } from "vue-router";
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import Task from '../views/Task.vue'


const routes = [{
    path:'/login',
    component:Login
},{
    path:'/register',
    component:Register
},{
    path:'/',
    component:Home
},{
    path:'/tasks',
    component:Task
}]

const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router