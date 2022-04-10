<template>
  <div class="receive">
    <div class="receive-title">领取任务</div>
    <div class="list-container">
      <div class="item-wrapper" v-for="(item) in taskList" :key="item">
        <div class="list-item" @click="detail(item.id)">
          <div class="item-title">{{ item.title }}</div>
          <!-- <div class="item-tags">预设标签: {{ getTags(index) }}</div> -->
          <div class="item-uploader">发布者:{{ item.uploader }}</div>
          <div class="item-preview">
            <img
              src="../assets/3.jpg"
              alt=""
              style="width: 100%; height: 100%"
            />
          </div>
        </div>
      </div>
    </div>  
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { defineComponent, ref, reactive, onMounted ,getCurrentInstance} from "vue";
const aboutList = (taskList,router) => {
  // const getTags = (index) => {
  //   let tags = taskList[index].tags;
  //   if (tags.length === 0) {
  //     return "无预设";
  //   } else {
  //     const limit = 3;
  //     let tagString = tags[0];
  //     let totalLength = tagString.length;
  //     if (totalLength > limit) {
  //       return tagString.slice(0, limit) + "...";
  //     }
  //     for (let i in tags) {
  //       if (i === "0") continue;
  //       else {
  //         if (totalLength + tags[i].length <= limit) {
  //           tagString += "," + tags[i];
  //           totalLength += tags[i].length;
  //         } else {
  //           let diff = limit - totalLength;
  //           tagString += "," + tags[i].slice(0, diff) + "...";
  //           break;
  //         }
  //       }
  //     }
  //     return tagString;
  //   }
  // };
  const detail = (id) => {
    // router.push(`/detail/${id}`);
    let {href} = router.resolve(`/detail/${id}`)
    window.open(href,'_blank')
  };

  return {
      detail,
    // getTags,
  };
};

export default defineComponent({
  setup() {
    let taskList = reactive([])
    let {proxy} = getCurrentInstance();
    proxy.$axios.post("/api/getTask/getTaskList").then(res=>{
      for(let item of res.data.message){
        taskList.push({
          id:item.taskid,
          title:item.taskName,
          uploader:item.author,
          imgsrc: "../assets/1.jpg",
        })
      }
    }).catch(error=>{
      console.log(error)
    })
    const router = useRouter();
    
    // let taskList = reactive([
    //   {
    //     id: "1",
    //     title: "test1",
    //     tags: ["花", "鸟", "鱼", "虫", "草", "木"],
    //     uploader: "user1",
    //     imgsrc: "../assets/1.jpg",
    //   },
    //   {
    //     id: "2",
    //     title: "test2",
    //     tags: ["花", "鱼", "虫"],
    //     uploader: "user2",
    //     imgsrc: "../assets/1.jpg",
    //   },
      
    // ]);
    const { detail } = aboutList(taskList, router);//因为router必须要定义在setup中，所以只能先定义，再当做参数传过去
    return {
      taskList,
      // getTags,
      detail,
    };
  },
});
</script>

<style scoped>
.receive {
  height: 100%;
  min-height: 500px;
}
.receive-title {
  height: 100px;
  line-height: 100px;
  padding-left: 20px;
  font-size: 40px;
  width: 60vw;
  min-width: 584px;
  margin: 0 auto;
  background-color: rgb(175,215,237);
}
.list-container {
  margin: 0 auto;
  width: 60vw;
  min-width: 584px;
  height: calc(100% - 100px);
  background-color: rgb(3,54,73);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
  align-items: flex-start;
  overflow: scroll;
}
.list-container::after {
  content: "";
  flex: auto;
}

.item-wrapper {
  width: 15vw;
  min-width: 146px;
  min-height: 146px;
  height: 15vw;
  background-color: rgb(3,54,73);
}
.list-item {
  position: relative;
  left: 5%;
  top: 5%;
  width: 90%;
  height: 90%;
  background-color: #fff;
}

.item-preview img {
  object-fit: contain;
}
</style>