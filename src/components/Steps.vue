!<template>
  <div class="steps">
    <div class="step publish-step">
      <div class="introduction">
        <div class="title">发布任务</div>
        <hr />
        <div class="word">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt
          pariatur, earum optio incidunt maxime temporibus delectus enim
          perferendis, nemo veniam ea voluptatum alias quidem, quisquam dolorum
          sit aliquid praesentium non?
        </div>
      </div>
      <div class="video">
          <video src="./testvideo/1.mp4" width="600px" height="550px" autoplay loop muted></video>
      </div>
    </div>
    <div class="step receive-step">
        <div class="video"><video src="./testvideo/1.mp4" width="600px" height="550px" autoplay loop muted></video></div>
        <div class="introduction">
        <div class="title">领取任务</div>
        <hr />
        <div class="word">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt
          pariatur, earum optio incidunt maxime temporibus delectus enim
          perferendis, nemo veniam ea voluptatum alias quidem, quisquam dolorum
          sit aliquid praesentium non?
        </div>
      </div>
    </div>
    <div class="step dataset-step">
        <div class="introduction">
        <div class="title">查看数据集</div>
        <hr />
        <div class="word">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt
          pariatur, earum optio incidunt maxime temporibus delectus enim
          perferendis, nemo veniam ea voluptatum alias quidem, quisquam dolorum
          sit aliquid praesentium non?
        </div>
      </div>
      <div class="video"><video src="./testvideo/1.mp4" width="600px" height="550px" autoplay loop muted></video></div>
    </div>
    <div class="step verify-step">
        <div class="video"><video src="./testvideo/1.mp4" width="600px" height="550px" autoplay loop muted></video></div>
        <div class="introduction">
        <div class="title">复核</div>
        <hr />
        <div class="word">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt
          pariatur, earum optio incidunt maxime temporibus delectus enim
          perferendis, nemo veniam ea voluptatum alias quidem, quisquam dolorum
          sit aliquid praesentium non?
        </div>
      </div>
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