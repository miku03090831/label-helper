<template>
  <div class="detail">
    <div class="detail-card">
      <div class="detail-title">{{ title }}</div>
      <div class="detail-tags-container">
        <div class="tag-title">预设标签:</div>
        <div class="detail-tags">
          <template v-for="tag in tags" :key="tag">
            <a-tag>{{ tag }}</a-tag>
          </template>
        </div>
      </div>
      
      <div class="pic-wrapper">
        <div class="back-to-now" @click="backToNow">
            回到当前
          </div>
        <div class="to-left" @click="toLeft">
          <img src="" alt="">
        </div>
        
        <div class="pic-container custom-scroll-bar" ref="scrollBar">
          <div
            class="pic"
            v-for="(item, index) in imgs"
            :key="item"
            @click="getBigPic(index)"
          >
            <img :src="item" alt="" style="width: 90%; height: 90%" />
          </div>
        </div>
        <div class="to-right" @click="toRight">
          <img src="" alt="">
        </div>
      </div>
      <div class="big-pic-container" ref="bigPic">
        <img :src="imgSrc" alt="" />
      </div>
      <div class="detail-button">
        <a-button @click="closePage">关闭</a-button>
        <a-button @click="receiveTask">领取</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  onMounted,
  computed,
} from "vue";
import { message } from "ant-design-vue";
const aboutButton = ()=>{
  const closePage = ()=>{
    window.close()
  }
  const receiveTask = ()=>{
    message.success("领取成功")
  }
  return{
    closePage,
    receiveTask
  }
}
const aboutScroll = (scrollBar, task) => {
  const imgIndex = ref(0);
  const getBigPic = (index) => {
    imgIndex.value = index;
    // console.log(imgIndex.value);
    let nodes = scrollBar.value.querySelectorAll(".pic");
    for(let node of nodes){
      node.style.background="rgb(200,200,200)"
    }
    nodes[index].style.background="orange"
  };
  const toLeft = () => {
    if (Math.abs(scrollBar.value.scrollLeft-0) < 5 || Math.abs(scrollBar.value.offsetWidth/5 - scrollBar.value.scrollLeft % (scrollBar.value.offsetWidth / 5)) < 5) {
      scrollBar.value.scrollLeft -= scrollBar.value.offsetWidth / 5;
      if (imgIndex.value >= 1) {
        // imgIndex.value -= 1;
        getBigPic(imgIndex.value-1);
      }
    } else {
      // console.log("没对齐，偏差了",Math.abs(scrollBar.value.offsetWidth/5 - scrollBar.value.scrollLeft % (scrollBar.value.offsetWidth / 5)))
      scrollBar.value.scrollLeft -=
        scrollBar.value.scrollLeft % (scrollBar.value.offsetWidth / 5);
    }
  };
  const toRight = () => {
    if (Math.abs(scrollBar.value.scrollLeft-0) < 5 || Math.abs(scrollBar.value.offsetWidth/5 - scrollBar.value.scrollLeft % (scrollBar.value.offsetWidth / 5)) < 5) {
      scrollBar.value.scrollLeft += scrollBar.value.offsetWidth / 5;
      if (imgIndex.value < task.imgs.length - 1) {
        // imgIndex.value += 1;
        getBigPic(imgIndex.value+1)
      }
    } else {
      // console.log("没对齐，偏差了",Math.abs(scrollBar.value.offsetWidth/5 - scrollBar.value.scrollLeft % (scrollBar.value.offsetWidth / 5)))
      scrollBar.value.scrollLeft +=
        (scrollBar.value.offsetWidth / 5) - scrollBar.value.scrollLeft % (scrollBar.value.offsetWidth / 5);
    }
  };
  const backToNow = ()=>{

    scrollBar.value.scrollLeft = imgIndex.value * scrollBar.value.offsetWidth/5
  }
  return {
    getBigPic,
    imgIndex,
    toLeft,
    toRight,
    backToNow
  };
};

export default defineComponent({
  props: ["id"],
  setup(props) {
    const scrollBar = ref(null);
    const task = reactive({
      id: "1",
      title: "test1",
      tags: ["花", "小鸟", "金枪鱼", "昆虫", "狗尾巴草", "灌木","花", "小鸟", "金枪鱼", "昆虫", "狗尾巴草", "灌木","花", "小鸟", "金枪鱼", "昆虫", "狗尾巴草", "灌木","花", "小鸟", "金枪鱼", "昆虫", "狗尾巴草", "灌木","花", "小鸟", "金枪鱼", "昆虫", "狗尾巴草", "灌木","花", "小鸟", "金枪鱼", "昆虫", "狗尾巴草", "灌木","花", "小鸟", "金枪鱼", "昆虫", "狗尾巴草", "灌木","花", "小鸟", "金枪鱼", "昆虫", "狗尾巴草", "灌木","花", "小鸟", "金枪鱼", "昆虫", "狗尾巴草", "灌木","花", "小鸟", "金枪鱼", "昆虫", "狗尾巴草", "灌木",],
      uploader: "user1",
      imgs: [
        "https://img7.51tietu.net/pic/2019-082412/ykbpo4rebqfykbpo4rebqf.jpg",
        "http://qqpublic.qpic.cn/qq_public/0/0-3973878894-A12F35B7356F47ABF34D1BB9543B6C92/0?fmt=jpg&size=45&h=675&w=900&ppv=1.jpg",
        "http://www.005.tv/uploads/allimg/180714/1QJK101-0.jpg",
        "http://qqpublic.qpic.cn/qq_public/0/0-3973878894-A12F35B7356F47ABF34D1BB9543B6C92/0?fmt=jpg&size=45&h=675&w=900&ppv=1.jpg",
        "http://www.005.tv/uploads/allimg/180714/1QJK101-0.jpg",
        "http://qqpublic.qpic.cn/qq_public/0/0-3973878894-A12F35B7356F47ABF34D1BB9543B6C92/0?fmt=jpg&size=45&h=675&w=900&ppv=1.jpg",
        "http://www.005.tv/uploads/allimg/180714/1QJK101-0.jpg",
        "https://img7.51tietu.net/pic/2019-082412/ykbpo4rebqfykbpo4rebqf.jpg",
        "http://qqpublic.qpic.cn/qq_public/0/0-3973878894-A12F35B7356F47ABF34D1BB9543B6C92/0?fmt=jpg&size=45&h=675&w=900&ppv=1.jpg",
        "http://www.005.tv/uploads/allimg/180714/1QJK101-0.jpg",
        "https://img7.51tietu.net/pic/2019-082412/ykbpo4rebqfykbpo4rebqf.jpg",
        "http://qqpublic.qpic.cn/qq_public/0/0-3973878894-A12F35B7356F47ABF34D1BB9543B6C92/0?fmt=jpg&size=45&h=675&w=900&ppv=1.jpg",
        "http://www.005.tv/uploads/allimg/180714/1QJK101-0.jpg",
      ],
    });
    const { getBigPic, imgIndex,toLeft,toRight,backToNow } = aboutScroll(scrollBar, task);
    const {closePage,receiveTask} = aboutButton()

    onMounted(()=>{
      getBigPic(0);
    })
    const imgSrc = computed(() => {
      return task.imgs[imgIndex.value];
    });


    return {
      closePage,
      receiveTask,
      backToNow,
      imgIndex,
      getBigPic,
      imgSrc,
      toLeft,
      toRight,
      scrollBar,
      ...toRefs(task),
    };
  },
});
</script>

<style scoped>
.detail {
  width: 100vw;
  height: calc(100% - 46px);
  margin-top: 46px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.detail-card {
  width: 60vw;
  min-width: 500px;
  height: 100%;
  min-height: 500px;
  background-color: rgb(196,226,216);
  margin: 0 auto;
}

.detail-title {
  width: 100%;
  text-align: center;
  height: 10%;
  font-size: 32px;
}
.detail-tags-container {
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  background-color: rgb(178, 200, 178);
}
.tag-title {
  height: 100%;
  width: 10%;
  font-size: 1vw;
  padding: 0 0.5vw;
}

.tag-title::before {
  display: inline-block;
  content: "";
  height: 100%;
  vertical-align: middle;
}
.detail-tags {
  height: 100%;
  width: 90%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  overflow-y: scroll;

}
.ant-tag {
  margin: 3px !important;
}
.pic-wrapper {
  position: relative;
  padding-top: 20px;
  height: 20%;
  width: 100%;
}
.pic-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
}
.pic {
  height: 100%;
  width: 20%;
  background-color: rgb(200, 200, 200);
  border: 1px solid black;
  flex: none;
}

.pic img {
  object-fit: contain;
  position: relative;
  top: 5%;
  left: 5%;
}

.custom-scroll-bar::-webkit-scrollbar {
  background: -webkit-linear-gradient(
    left,
    rgba(202, 202, 202, 0.07) 0%,
    rgba(229, 229, 229, 0.07) 100%
  );
  height: 20px;
  -webkit-box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.15) inset, 0 1px 0 0 #fff;
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.15) inset, 0 1px 0 0 #fff;
  background-color: #e5e5e5;
}
.custom-scroll-bar::-webkit-scrollbar,
.custom-scroll-bar::-webkit-scrollbar-thumb {
  overflow: visible;
  border-radius: 4px;
  border: solid 1px #fff;
}
.custom-scroll-bar::-webkit-scrollbar-thumb {
  background-color: #a6a6a6;
}
.custom-scroll-bar::-webkit-scrollbar-button {
  display: none;
}
.custom-scroll-bar::-webkit-scrollbar-thumb:hover {
  background-color: rgb(200, 200, 200);
}
.back-to-now{
  position: absolute;
  background-color: rgba(0, 0, 0, 0.4);
  top: 20px;
  left: 30px;
  z-index: 1;
}
.to-left,
.to-right {
  position: absolute;
  height: calc(100% - 40px);
  width: 20px;
  background-color: rgba(0, 0, 0, 0.4);
  flex: none;
  z-index: 1;
  display: flex;
  align-items: center;
}


.to-left {
  top: 20px;
  left: 0%;
}
.to-right {
  top: 20px;
  right: 0%;
}
.to-left img,
.to-right img{
  background-color: #000;
  width: 20px;
  height: 40px;
}

.big-pic-container {
  height: 50%;
  background-color: rgb(178, 200, 178);
}

.big-pic-container img{
  object-fit: contain;
  width: 100%;
  height: 100%;
}
.detail-button{
  height: 10%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.detail-button .ant-btn{
  border-radius: 5px;
  margin-left: 50px;
  margin-right: 50px;
}
</style>