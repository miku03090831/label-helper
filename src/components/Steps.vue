<template>
  <div class="steps">
    <div class="step publish-step">
      <div class="introduction">
        <div class="title">发布任务</div>
        <hr />
        <div class="word">
          用户发布任务时，需要给任务起一个标题，说明标注的要求，然后可以自行选择是否添加预设的tag，给进行标注的用户作为参考。
          然后用户需要选择一个文件夹，系统会自动识别图片和视频文件。视频需要用户手动选择帧。然后点击发布即可

        </div>
      </div>
      <div class="video">
          <video src="./testvideo/publish.mp4" width="600px" height="550px" autoplay loop muted></video>
      </div>
    </div>
    <div class="step receive-step">
        <div class="video"><video src="./testvideo/receive.mp4" width="600px" height="550px" autoplay loop muted></video></div>
        <div class="introduction">
        <div class="title">领取任务</div>
        <hr />
        <div class="word">
          用户在领取任务界面，可以看到当前未被领取的任务列表。点击即可进入任务详情页，可以方便地查看任务中的每一张图片。之后可以点击领取按钮领取任务
        </div>
      </div>
    </div>
    <div class="step dataset-step">
        <div class="introduction">
        <div class="title">进行标注</div>
        <hr />
        <div class="word">
          用户在“我领取的任务”界面，点击自己领取的任务，即可对其进行标注。点击左侧画矩形，即可标注。标注完毕后，可以在右侧修改标注的tag。在保存之后点击上传结果即可完成标注
        </div>
      </div>
      <div class="video"><video src="./testvideo/label.mp4" width="600px" height="550px" autoplay loop muted></video></div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.step {
  height: 550px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.publish-step,
.dataset-step {
  background-color: rgba(150, 150, 150, 0.6);
}
.receive-step,
.verify-step{
    background-color: rgba(120, 120, 120, 0.6);
    
}


.dataset-step .introduction,
.publish-step .introduction {
  width: 300px;
  margin: auto 150px auto 0;
}

.receive-step .introduction,
.verify-step .introduction {
  width: 300px;
  margin: auto 0 auto 150px;
}

.title {
  font-size: 30px;
  height: 50px;
  line-height: 50px;
}
.word {
  margin-top: 50px;
  font-size: 20px;
}

.video {
  width: 600px;
  height: 550px;
  /* background-color: red; */
}
</style>