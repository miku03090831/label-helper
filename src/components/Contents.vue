<template>
  <div class="content">
    <div class="left">
      <a-button class="button" id="b1" @click="toPub">发布任务</a-button>
      <a-button class="button" id="b2" @click="toRec">领取任务</a-button>
      <a-button class="button" id="b3" @click="toMyPub">我的发布</a-button>
      <a-button class="button" id="b4" @click="toMyRec">我的领取</a-button>
    </div>
    <div class="right">
      <div class="description">
        label-helper是一个在线图像标注平台，用户可以将待标注的图片作为任务发布，其他用户可以领取任务，对图片完成标注。有效提高了用户的时间利用率，让开发者不必亲自标注图像
      </div>
      <div class="picture">
        <a-carousel>
          <div class="carousel-pic">
            <img src="../views/testimg/1.jpg" alt="" style="height:358px; " />
          </div>
          <div class="carousel-pic">
            <img src="../views/testimg/2.jpg" alt="" style="height:358px; "/>
          </div>
          <div class="carousel-pic">
            <img src="../views/testimg/3.jpg" alt="" style="height:358px; "/>
          </div>
          <!-- <div class="carousel-pic"><img src="../assets/4.jpg" alt=""></div>
                        <div class="carousel-pic"><img src="../assets/5.jpg" alt=""></div> -->
        </a-carousel>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const router = useRouter();
    const toPub = () => {
      router.push({
        name: "tasks",
        params: {
          p_func_num: 1,
        },
      });
    };
    const toRec = ()=>{
      router.push({
          name: "tasks",
          params: {
            p_func_num: 2,
          },
        });
    }
    const toMyPub = ()=>{
      router.push({
          name: "personal",
          params: {
            p_func_num: 1,
          },
        });
    }
    const toMyRec = ()=>{
      router.push({
          name: "personal",
          params: {
            p_func_num: 2,
          },
        });
    }
    return {
      toPub,
      toRec,
      toMyPub,
      toMyRec
    }
  },
});
</script>

<style scoped>
.content {
  height: 550px;
  width: 100%;
  background-color: rgba(120, 120, 120, 0.5);
  display: flex;
  justify-content: space-around;
}

.content:before,
.content:after {
  content: "";
  display: block;
}
/* 左侧按钮 */
.left {
  height: 100%;
  width: 280px;
  /* background-color: #000; */
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.button {
  width: 200px;
  height: 100px;
  background-color: blue;
  border-radius: 5px;
  color: #fff;
  font-size: 30px;
  line-height: 100px;
  text-align: center;
  border: 0px;
}

#b1 {
  background-image: linear-gradient(to left, #ff9569 0%, #e92758 100%);
  background-image: linear-gradient(to left, #fbc2eb 0%, #a6c1ee 100%);
}

#b2 {
  background-image: linear-gradient(to right, #fa709a 0%, #fee140 100%);
  background-image: linear-gradient(to right, #9890e3 0%, #b1f4cf 100%);
}

#b3 {
  background-image: linear-gradient(to left, #ebbba7 0%, #cfc7f8 100%);
  background-image: linear-gradient(to left, #9795f0 0%, #fbc8d4 100%);
}

#b4 {
  background-image: linear-gradient(135deg, #f067b4 0%, #81ffef 100%);
}
/* 右侧文字描述和轮播图 */
.right {
  height: 100%;
  width: 600px;
  /* background-color: pink; */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.description {
  height: 25%;
  color: #fff;
  font-size: 20px;
  text-align: left;
  line-height: 40px;
  padding: 15px;
  margin-bottom: 20px;
  /* background-color: rgba(200,200,200,0.6); */
}
.picture {
  height: 65%;
  /* overflow: hidden; */
}
.a-carousel {
  height: 100%;
  overflow: hidden;
}

.content:deep(button) {
  color: antiquewhite !important;
}

.carousel-pic img{
object-fit: contain;
}
.ant-carousel :deep(.slick-slide) {
  height: 358px;
  overflow: hidden;
  
}
</style>