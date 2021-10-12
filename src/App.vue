

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
    <a-menu-item class="personal" width="180px">
      <div key="personal" class="login-status" width="180px">个人中心</div>
    </a-menu-item>
  </a-menu>
  </div>
  <router-view></router-view>
</template>

<script >
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { defineComponent,ref, watch } from "vue";
export default defineComponent({
  setup(){
    const current =ref()
    watch(current,(newValue,oldValue)=>{
      console.log(newValue);
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

</style>
