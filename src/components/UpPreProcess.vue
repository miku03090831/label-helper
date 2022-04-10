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
        <canvas width="160" height="160"></canvas>
      </div>
    </div>
    <div class="mid-player">
      <video
        :src="videoSrc"
        width="600"
        height="600"
        controls
        ref="video"
      ></video>
    </div>
    <div class="right-operate">
      <div class="screenshot-button" @click="screenshot">
        点击截图
      </div>
      <div class="show-pic">
        <div class="pic-title">左键单击任意图片可以查看大图。右键单击任意图片，或者在查看大图时点击正下方删除按钮，都可以删除当前截图</div>
        <div class="pic-list" ref="preview">
          <div
            class="pic"
            v-for="(src, index) in picList"
            :key="src"
            @contextmenu.prevent="deletePic(index)"
          >
            <div class="pic-wrapper">
              <img :src="src" class="preview-screenshot" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  ref,
  onUnmounted,
  onMounted,
  nextTick,
  toRaw,
} from "vue";
import { message } from "ant-design-vue";
import "viewerjs/dist/viewer.css";
import Viewer from "viewerjs";
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
      trueHeight = 160;
      trueWidth = (160 * rawWidth) / rawHeight;
      trueX = 80 - trueWidth / 2;
      trueY = 0;
    } else {
      //扁平
      trueHeight = (160 * rawHeight) / rawWidth;
      trueWidth = 160;
      trueX = 0;
      trueY = 80 - trueHeight / 2;
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
    let playing = videos.value[index]
    let nodes=playing.parentNode.querySelectorAll(".list-item");
    // console.log(nodes)
    for(let node of nodes){
      node.style.background='white'
    }
    playing.style.background='orange'
  };
  return {
    videos,
    videoSrc,
    getVideo,
    chooseVideo,
  };
};

const aboutPic = (context) => {
  const video = ref(null); //这个是为了能够获取当正在播放的视频的当前帧
  const picList = ref([]); //这个是为了存储图片，截图之后把图片添加到这个数组里面
  const preview = ref(null); //这个是为了能够拿到同名ref下的所有img标签
  let gallery;

  const deleteFullScreen = () => {
    // console.log("前", toRaw(picList.value));
    picList.value.splice(gallery.index, 1);
    nextTick(() => {
      gallery.update();
    });
    // console.log("后", toRaw(picList.value));
  };

  const screenshot = () => {
    message.success("截图成功");

    let pic_height = video.value.videoHeight;
    let pic_width = video.value.videoWidth;

    let capture_canvas = document.createElement("canvas");
    capture_canvas.width = pic_width;
    capture_canvas.height = pic_height;
    let capture_ctx = capture_canvas.getContext("2d");
    capture_ctx.drawImage(video.value, 0, 0, pic_width, pic_height);
    let imgSrc = capture_canvas.toDataURL("image/png");
    picList.value.push(imgSrc);
    if (picList.value.length === 1) {
      gallery = new Viewer(preview.value, {
        toolbar: {
          play: {
            click: deleteFullScreen,
          },
        },
      });
    }

    nextTick(() => {
      //需要用nextTick来保证gallery拿到的是v-for渲染完毕的数据。
      //很奇怪，明明preview里面都已经能看到v-for新渲染出来的img标签，但是不在nextTick里面写update的话就是拿不到
      gallery.update();
    });
  };

  const addScreenShot = () => {
    context.emit("selectOver",toRaw(picList.value));
  };

  const deletePic = (index) => {
    picList.value.splice(index, 1);
    nextTick(() => {
      gallery.update();
    });
    if (picList.value.length === 0) {
      gallery.destroy();
    }
  };

  return {
    addScreenShot,
    deletePic,
    preview,
    video,
    picList,
    screenshot,
    gallery,
  };
};

export default defineComponent({
  props: ["videoList"],
  emits: ["testEmit"],
  setup(props, context) {
    const { videos, videoSrc, getVideo, chooseVideo } = aboutVideo(props);
    const {
      addScreenShot,
      video,
      picList,
      screenshot,
      gallery,
      preview,
      deletePic,
    } = aboutPic(context);

    onMounted(() => {
      // console.log("video",videos)
      // console.log("video.value",videos.value)
      // console.log("toRaw",toRaw(videos.value))
      for (let i = 0; i < videos.value.length; i++) {
        getCoverPage(i, videos.value);
      }
      chooseVideo(0);
    });
    // onUnmounted(() => {
    //   console.log("销毁");
    // });

    return {
      //以下与截图相关
      addScreenShot,
      deletePic,
      preview,
      video,
      gallery,
      picList,
      screenshot,
      //以下与左侧列表的视频封面，和正在播放的视频相关
      getVideo,
      videos,
      chooseVideo,
      videoSrc,
    };
  },
});
</script>

<style  scoped>
.ant-modal-content{
  background-color: #000!important;
}

.process {
  width: 1000px;
  height: 560px;
  background-color: #000;
  display: flex;
  flex-direction: row;
}

.left-list {
  width: 20%;
  height: 100%;
  background-color: rgb(178,200,187);
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
  background-color: rgb(178,200,187);
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
  background-color: white;
  padding: 10px;
}

video {
  width: 100%;
  height: 100%;
}

.screenshot-button {
  width: 100%;
  height: 20%;
  font-size: 40px;
  line-height: 120px;
  text-align: center;
  background-color: rgb(173,190,177);
}

.show-pic {
  width: 100%;
  height: 80%;
}

.pic-title {
  width: 100%;
  height: 20%;
  background-color: rgb(200,200,200);
  padding: 5px;
}

.pic-list {
  height: 80%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;
  overflow: scroll;
}

.pic-list::after {
  /* 为了让最后一行也能刚好对齐 */
  content: "";
  flex: auto;
}

.pic {
  width: 33.333%;
  height: 50px;
  margin-top: 5px;
}
.pic-wrapper {
  position: relative;
  left: 5%;
  width: 90%;
  height: 50px;
  background-color: #fff;
  display: flex;
  justify-content: center;
}

.preview-screenshot {
  max-width: 100%;
  max-height: 50px;
}
</style>