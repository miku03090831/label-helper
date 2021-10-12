<template>
  <div class="process">
    <div class="left-list">
      <div class="list-title">视频列表</div>
      <div
        class="list-item"
        v-for="(item, index) in videoList"
        :key="item"
        @click="chooseVideo(index)"
        :ref="(el) => (videos[index] = el)"
      >
        <video
          :src="getVideo(index)"
          autoplay
          style="display: none"
          muted
        ></video>
        <canvas width="180" height="180"></canvas>
      </div>
    </div>
    <div class="mid-player">
      <video
        :src="videoSrc"
        width="200px"
        height="200px"
        controls
        ref="video"
      ></video>
    </div>
    <div class="right-operate">
      <div class="pause-switch">
        截图时暂停（用于查看截图）
        <a-switch v-model:checked="checked"></a-switch>
        <div @click="screenshot">截图</div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onUnmounted, onMounted } from "vue";
import { message } from "ant-design-vue";
//获取封面的函数
const getCoverPage = (index, videos) => {
  let itemParent = videos[index];
  //   console.log(itemParent.childNodes);
  let videoItem = itemParent.firstChild;
  let canvas = itemParent.lastChild;

  let ctx = canvas.getContext("2d");

  const setCover = () => {
    //当canplay后触发的函数，保证video加载完毕才能读取宽高
    let rawHeight = videoItem.videoHeight;
    let rawWidth = videoItem.videoWidth;
    let col_direction = rawHeight > rawWidth;
    let trueHeight, trueWidth, trueX, trueY;

    if (col_direction) {
      //细长
      trueHeight = 180;
      trueWidth = (180 * rawWidth) / rawHeight;
      trueX = 90 - trueWidth / 2;
      trueY = 0;
    } else {
      //扁平
      trueHeight = (180 * rawHeight) / rawWidth;
      trueWidth = 180;
      trueX = 0;
      trueY = 90 - trueHeight / 2;
    }
    //要按照原视频比例，调整封面在canvas的宽高
    ctx.drawImage(videoItem, trueX, trueY, trueWidth, trueHeight);
    videoItem.removeEventListener("canplay", setCover); //只触发一次，并且在下面移除dom
    itemParent.removeChild(videoItem);
  };
  videoItem.addEventListener("canplay", setCover);
};

const aboutVideo = (props) => {
  const videos = ref([]);
  const videoSrc = ref("");
  const getVideo = (index) => props.videoList[index];
  const chooseVideo = (index) => {
    videoSrc.value = props.videoList[index];
  };
  return {
    videos,
    videoSrc,
    getVideo,
    chooseVideo,
  };
};

export default defineComponent({
  props: ["videoList"],
  setup(props) {
    const checked = ref(false);
    const video = ref();
    const { videos, videoSrc, getVideo, chooseVideo } = aboutVideo(props);


    const screenshot = () => {
      if (!checked.value) {
        message.success("截图成功");
      } else {
        video.value.pause();
        //然后这里应该弹出一个modal之类的，来预览截图
        message.success("截图成功，点击任意处继续");
      }
    };

    // const getVideo = (index) => props.videoList[index];//先要获取列表中的所有视频，才能获取每个视频的封面
    // const chooseVideo = (index) => {//点击了哪个视频
    //   videoSrc.value = props.videoList[index];
    // };

    onMounted(() => {
      for (let i = 0; i < videos.value.length; i++) {
        getCoverPage(i, videos.value);
      }
      chooseVideo(0);
    });
    // onUnmounted(() => {
    //   console.log("销毁");
    // });

    return {
      video,
      screenshot,
      checked,
      getVideo,
      chooseVideo,
      videoSrc,
      videos,
    };
  },
});
</script>

<style  scoped>
.process {
  width: 1000px;
  height: 600px;
  background-color: #000;
  display: flex;
  flex-direction: row;
}

.left-list {
  width: 20%;
  height: 100%;
  background-color: pink;
  overflow: scroll;
}

.mid-player {
  width: 60%;
  height: 100%;
  background-color: #fff;
}

.right-operate {
  width: 20%;
  height: 100%;
  background-color: red;
}
.list-title {
  height: 30px;
  width: 180px;
  font-size: 18px;
  text-align: center;
}

.list-item {
  width: 180px;
  height: 180px;
  margin: 10px;
  background-color: green;
}

video {
  width: 100%;
  height: 100%;
}
</style>