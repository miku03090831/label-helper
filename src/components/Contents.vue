!<template>
    <div class="content">
        <div class="left">
          <a-button class="button" id="b1">发布任务</a-button>
          <a-button class="button" id="b2">领取任务</a-button>
          <a-button class="button" id="b3">查看数据集</a-button>
          <a-button class="button" id="b4">复核</a-button>
        </div>
        <div class="right">
          <div class="description">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cpit, quis
            aliquid sunt at labore praesentium magni quidem repellat nam?
            Impedit, obcaecati reiciendis.
          </div>
          <div class="picture">
            <a-carousel>
              <div class="carousel-pic">
                <img src="../views/testimg/1.jpg" alt="" />
              </div>
              <div class="carousel-pic">
                <img src="../views/testimg/2.jpg" alt="" />
              </div>
              <div class="carousel-pic">
                <img src="../views/testimg/3.jpg" alt="" />
              </div>
              <!-- <div class="carousel-pic"><img src="../assets/4.jpg" alt=""></div>
                        <div class="carousel-pic"><img src="../assets/5.jpg" alt=""></div> -->
            </a-carousel>
          </div>
        </div>
    </div>
</template>

<script>
    export default {
        
    }
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

.ant-carousel :deep(.slick-slide) {
  height: 358px;
  overflow: hidden;
}
</style>