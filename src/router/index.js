import { createRouter,createWebHistory } from "vue-router";
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import Task from '../views/Task.vue'
import TaskDetail from "../views/TaskDetail.vue"


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
},{
    path:'/detail/:id',
    component:TaskDetail,
    props:true//将参数作为props传给组件
}]

const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router