import { createRouter,createWebHistory } from "vue-router";
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import Task from '../views/Task.vue'
import TaskDetail from "../views/TaskDetail.vue"
import Label from "../views/Label.vue"


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
    name:'tasks',
    component:Task,
    props:true,
},{
    path:'/detail/:id',
    component:TaskDetail,
    props:true//将参数作为props传给组件
},{
    path:'/label',
    component:Label
}]

// router.beforeEach((to,from,next)=>{
//     if(to.name === from.name && to.params !== from.params){
//         console.log("强制刷新")
//         next({name:'empty',query:{toPath:to.fullPath}})
//     }
//     else{
//         next()
//     }
// })

const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router