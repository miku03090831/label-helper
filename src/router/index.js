import { createRouter,createWebHistory } from "vue-router";
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import Task from '../views/Task.vue'
import TaskDetail from "../views/TaskDetail.vue"
import Label from "../views/Label.vue"
import Personal from "../views/Personal.vue"


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
    path:'/label/:id',
    component:Label,
    props:true
},{
    path:'/personal',
    name:'personal',
    component:Personal,
    props:true
}]



const router = createRouter({
    history:createWebHistory(),
    routes
})

router.beforeEach((to,from,next)=>{
    const isLogin = localStorage.getItem('jwtoken')?true:false;
    if(to.path == '/register' || to.path == '/login'){
        next()
    }
    else {
        isLogin ? next():next('/login')
    }

})

export default router