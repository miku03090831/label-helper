<template>
  <div class="home">
    <a-back-top />
    <div class="title">label-helper图像标注平台</div>
    <div class="others">
      <!-- <a-back-top>
        <div class="back-top-inner">
          回到顶部
        </div>
      </a-back-top> -->
      
      <Content></Content>
      <Step></Step>
    </div>
  </div>
</template>

<script>
import Content from "../components/Contents.vue"
import Step from "../components/Steps.vue";
export default {
    components:{Content,Step}
};
</script>

<style scoped>



/* .home {

  background-color: rgba(200, 200, 200, 0.5);
} */
/* 整体布局部分 */
.title {
  height: 85px;
  font-size: 40px;
  line-height: 65px;
  text-align: center;
  margin-top: 46px;
  padding-top: 20px;
  margin-bottom: 20px;
  color: #fff;
}
/* 主体布局 */


</style>