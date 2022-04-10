<template>
  <div class="register">
    <div class="register-box">
      <div class="title">label-helper账号注册</div>
      <a-form
        ref="registerRef"
        :model="registerForm"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item has-feedback label="邮箱" name="email">
          <a-input v-model:value="registerForm.email" />
        </a-form-item>
        <a-form-item has-feedback label="用户名" name="username">
          <a-input v-model:value="registerForm.username" />
        </a-form-item>
        <a-form-item has-feedback label="密码" name="password">
          <a-input-password
            v-model:value="registerForm.password"
            type="password"
          />
        </a-form-item>
        <a-form-item has-feedback label="确认密码" name="checkpass">
          <a-input-password v-model:value="registerForm.checkpass" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 6, offset: 11 }">
          <a-button @click="onRegister">注册</a-button>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 10, offset: 12 }">
          <div class="to-login">
            已有账号？点击
            <router-link to="./login">登录</router-link>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRaw, getCurrentInstance } from "vue";
import { message } from "ant-design-vue";
export default defineComponent({
  methods: {
    onRegister() {
      this.registerRef
        .validate()
        .then(() => {
          this.proxy.$axios
            .post("/api/users/register", toRaw(this.registerForm))
            .then((res) => {
              if (res.data.state === false) {
                message.error(res.data.message);
              } else {
                message.success("注册成功");
                this.$router.push("/login");
              }
            })
            .catch(() => {
              console.log("注册失败");
            });
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
  setup() {
    let { proxy } = getCurrentInstance();
    const registerRef = ref(null);
    const registerForm = reactive({
      email: "",
      username: "",
      password: "",
      checkpass: "",
    });

    let checkEmailUnique = async (rule, value) => {
      //检查email是否唯一
      return Promise.resolve();
    };

    let checkUsernameUnique = async (rule, value) => {
      //检查username是否唯一
      return Promise.resolve();
    };

    let validatePass = async (rule, value) => {
      if (value.length < 6) return Promise.reject("密码至少要6位");
      else if (registerForm.checkpass !== "") {
        registerRef.value.validateFields("checkpass");
      }
      return Promise.resolve();
    };

    let validatePass2 = async (rule, value) => {
      if (value === "") return Promise.reject("请确认一遍密码");
      else if (registerForm.password !== value)
        return Promise.reject("两次密码不一致");
      return Promise.resolve();
    };

    const rules = {
      email: [
        {
          required: true,
          type: "email",
          message: "邮箱格式不正确",
          trigger: "blur",
        },
        {
          validator: checkEmailUnique,
          trigger: "blur",
        },
      ],
      username: [
        {
          required: true,
          type: "string",
          min: 6,
          max: 20,
          message: "用户名长度应为6~20个字符",
          trigger: "blur",
        },
        {
          validator: checkUsernameUnique,
          trigger: "blur",
        },
      ],
      password: [
        {
          required: true,
          validator: validatePass,
          trigger: "change",
        },
      ],
      checkpass: [
        {
          validator: validatePass2,
          trigger: ["blur", "change"],
        },
      ],
    };

    // const onRegister = ()=>{
    //     registerRef.value.validate().then(()=>{
    //         console.log('values',toRaw(registerForm))
    //         this.$router.push("/")
    //     }).catch(error=>{
    //         console.log('error',error)
    //     })
    // }

    return {
      proxy,
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 13,
        offset: 1,
      },
      registerForm,
      registerRef,
      rules,
      // onRegister
    };
  },
});
</script>

<style scoped>
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.register-box {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 400px;
  width: 400px;
  border: 1px black solid;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  color: #fff;
}

.register:deep(label) {
  color: #fff;
}
.to-login {
  text-align: center;
  color: #fff;
}

.title {
  width: 250px;
  margin: 30px auto;
  font-size: 20px;
  text-align: right;
}
</style>