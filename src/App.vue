

<template>
  <div class="menu-wrapper">
    <a-menu mode="horizontal" v-model:selectedKeys="current" class="header" theme="dark">
    <a-menu-item key="home" width="280px" class="home" >  
      label-helper图像标注平台
    </a-menu-item>
    <a-sub-menu width="80px">
      <template #title>数据集</template>
      <a-menu-item key="unverified" class="inner-menu">待复核</a-menu-item>
      <a-menu-item key="verified" class="inner-menu">已复核</a-menu-item>
    </a-sub-menu>
    <a-sub-menu width="80px">
      <template #title>标注任务（需登录）</template>
      <a-menu-item key="publish" class="inner-menu">发布任务</a-menu-item>
      <a-menu-item key="receive" class="inner-menu">领取任务</a-menu-item>
      <a-menu-item key="verify" class="inner-menu">复核</a-menu-item>
    </a-sub-menu>
    <a-menu-item key="about" width="80px">
      关于
    </a-menu-item>
    <a-menu-item class="personal" width="180px" key="personal">
      <div  class="login-status" width="180px">个人中心</div>
    </a-menu-item>
  </a-menu>
  </div>
  <router-view></router-view>
</template>

<script >
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { defineComponent,ref, watch } from "vue";
import { useRouter } from "vue-router";
const jumpTo = (router,value)=>{
//将导航栏的功能和路由对应起来
  switch(value){
    case "unverified":
      {
        console.log("待复核，没做好呢");
      }
      break;
    case "verified":
      {
        console.log("已复核，没做好呢");
      }
      break;
    case "publish":
      {
        router.push({
          name:'tasks',
          params:{
            p_func_num:1
          }
        })
      }
      break;
    case "receive":
      {
        router.push({
          name:'tasks',
          params:{
            p_func_num:2
          }
        })
      }
      break;
    case "verify":
      {
        console.log("去复核，还没做好呢")
      }
      break;
    case "about":
      {
        console.log("关于界面，没做好")
      }
      break;
    case "personal":
      {
        router.push(`/login`)
        console.log("个人界面，没做好呢");
      }
      break;
  }
}
export default defineComponent({
  setup(){
    const router = useRouter();
    const current =ref()
    watch(current,(newValue,oldValue)=>{
      jumpTo(router,newValue[0]);
    })
    return {current}
  }
})
</script>

<style>
*{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

::-webkit-scrollbar{
  width: 0;
}

/* .mask::-webkit-scrollbar{
width:0;

} */

#app {
  position:fixed;
  top: 0;
  left: 0;
  width:calc(100%);
  height:100%;
  min-width: 1000px;
  zoom: 1;
  background-color: #fff;
  background: url("./assets/4.jpg") no-repeat;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
  overflow-y:auto;
}

.menu-wrapper{
  position: fixed;
  width: 100%;
  height: 45px;
  z-index: 2000;
}





.header{
  /* background: rgba(100,100,100,1)!important; */
  border: 0px!important;
}

.inner-menu{
  /* background: rgba(130,130,130,1)!important; */
  margin: 0 !important;;
}

.header .home{
  margin-right: auto;
}
.a-menu{
  display: flex;
}


.ant-menu-submenu::after,.ant-menu-item::after{
  border:0px!important;
}

/* .header .personal{
  margin-left: auto;
} */

.viewer-zoom-in::before, .viewer-zoom-out::before, .viewer-one-to-one::before, .viewer-reset::before, .viewer-prev::before, .viewer-play::before, .viewer-next::before, .viewer-rotate-left::before, .viewer-rotate-right::before, .viewer-flip-horizontal::before, .viewer-flip-vertical::before, .viewer-fullscreen::before, .viewer-fullscreen-exit::before, .viewer-close::before{
  background-image: url(data:image/png;base64,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)!important;
}

</style>
