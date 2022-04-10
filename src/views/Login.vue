<template>
  <div class="login">
    <div class="login-box">
      <div class="title">label-helper账号登录</div>
      <a-form
        :model="loginForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="邮箱">
          <a-input v-model:value="loginForm.account"/>        
        </a-form-item>
        <a-form-item label="密码">
          <a-input-password v-model:value="loginForm.password" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 6, offset: 10 }">
          <a-button @click="onSubmit">登录</a-button>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 10, offset: 12 }">
          <div class="to-register">
            没有账号？点击
            <router-link to="./register">注册</router-link>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRaw,getCurrentInstance } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    localStorage.removeItem('labelLogin')
    localStorage.removeItem('jwtoken')
    let {proxy} = getCurrentInstance();
    const router = useRouter();
    const loginForm = reactive({
      account: "",
      password: "",
    });
    const onSubmit = () => {
      proxy.$axios.post("/api/users/login",  toRaw(loginForm))
      .then((res)=>{
        if(res.data.state===false){
          message.error(res.data.message)
        }
        else{
          
          message.success("登录成功")
          localStorage.setItem('labelLogin',JSON.stringify(res.data.username));
          const {token} = res.data
          localStorage.setItem('jwtoken',token)
          router.push("/")
        }
      }).catch((error)=>{
        console.log(error)
      })
    };

    return {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 14,
        offset: 1,
      },
      loginForm,
      onSubmit,
      proxy
    };
  },
});
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  
}
.login-box {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 300px;
  width: 400px;
  border: 1px black solid;
  background-color: rgba(0,0,0,0.5);
  border-radius: 20px;
  color: #fff;
}
.login:deep(label){
    color: #fff;
}
.title {
  width: 250px;
  margin: 30px auto;
  font-size: 20px;
  text-align: right;
}


.to-register {
    text-align: center;
    color: #fff;
    /* background-color: rgba(220,220,220,0.7); */
}
</style>