<template>
  <div class="publish" ref="publishRef">
    <div class="form-container">
      <div class="form-title">发布任务</div>
      <a-divider
        style="margin: 0; width: 80%; height: 2px; background-color: #000"
      />
      <div class="form-body">
        <a-form name="publish-task" ref="taskRef" :model="taskForm">
          <a-form-item label="任务标题">
            <a-input v-model:value="taskForm.title"></a-input>
          </a-form-item>
          <div class="setTagTitle">请设置预设分类，便于其他用户标记</div>
          <a-form-item>
            <a-button type="dashed" @click="addTag">
              <PlusOutlined />
              Add Tag
            </a-button>
          </a-form-item>
          <div class="setTags">
            <a-form-item
              v-for="(tag, index) in taskForm.tags"
              :key="tag.key"
              :name="['tags', index, 'value']"
              :rules="{
                required: true,
                message: '分类名不能为空',
                trigger: 'change',
              }"
              :wrapper-col="{ span: 24 }"
            >
              <a-input
                v-model:value="tag.value"
                placeholder="请输入预设的分类名，例如：花"
                style="width: 80%; margin-right: 8px"
              />
              <MinusCircleOutlined
                class="dynamic-delete-button"
                @click="removeTag(tag)"
              />
            </a-form-item>
          </div>
          <a-form-item>
              <input type="file" @change="selectFolder($event)" webkitdirectory />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="submitForm">发布任务</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
  <a-modal v-if="visible" v-model:visible="visible" title="手动选取帧" :maskClosable="false" @ok="handleOk" @cancel="handleCancel" width="1000px" :getContainer="()=>$refs.publishRef">
    <UpPreProcess :videoList="videoList"/>
  </a-modal>
</template>

<script type="text/javascript" >
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons-vue";
import {Modal} from "ant-design-vue"
import { createVNode,defineComponent, reactive, ref } from "vue";
import UpPreProcess from "./UpPreProcess.vue";
export default defineComponent({
  setup() {
      const visible = ref(false);
    const formData = new FormData();
    const videoList = [];
    const taskRef = ref(null);
    const taskForm = reactive({
      tags: [],
      title: "",
    });

    const submitForm = () => {
      taskRef.value
        .validate()
        .then(() => {
          console.log("values", taskForm);
        })
        .catch((error) => {
          console.log("error", error);
        });
    };

    const removeTag = (item) => {
      let index = taskForm.tags.indexOf(item);
      if (index !== -1) {
        taskForm.tags.splice(index, 1);
      }
    };

    const addTag = () => {
      taskForm.tags.push({
        value: "",
        key: Date.now(),
      });
    };

    const handleOk = ()=>{
      console.log("手动选择完毕")
      visible.value = false;
    }

    const handleCancel = ()=>{
      console.log("手动选择取消")
      visible.value = false;
    }
    return {
      handleOk,
      handleCancel,
      visible,
      videoList,
      formData,
      taskRef,
      taskForm,
      submitForm,
      removeTag,
      addTag,
    };
  },

  methods: {
    selectFolder(e) {
      this.videoList.splice(0,this.videoList.length)
      let files = e.target.files;
      //文件夹名称
      var relativePath = files[0].webkitRelativePath;
      let imagecounts = 0;
      let videocounts = 0;
      let othercounts = 0;
      //文件信息转换成FormData结构遍历上传
      for (let i = 0; i < files.length; i++) {
        if(files[i].type.startsWith("image")){
          imagecounts+=1;
          this.formData.append(i,files[i])
        }
        else if(files[i].type.startsWith("video")){
          videocounts+=1;
          this.videoList.push(URL.createObjectURL(files[i]))
        }
        else{
          othercounts+=1;
        }
        //上传
      }
      for(let i in this.videoList){
        console.log(this.videoList[i])
      }
      const that = this;
      Modal.confirm({
        title:()=>"上传结果",
        content:()=>createVNode('div',{},[createVNode('p',{},`您上传了${imagecounts}个图片文件`),
                                          createVNode('p',{},`${videocounts}个视频文件需要选择一些帧用来标注，您可以手动选择特定帧，或者默认使用按时间均分取出的10帧`),
                                          createVNode('p',{},`另有${othercounts}个文件无法识别（这些文件的MIME类型不是image或video）`)]),
        maskClosable:false,
        okText:()=>'手动选择帧',
        cancelText:()=>'自动选择帧',
        onOk(){
          console.log("手动选择去喽")
          //这里不知道为什么this变成undefined了，所以在上面用that保存一下this的值
          that.visible=true
        },
        onCancel(){
          console.log("自动选择去喽")
        },
      });
    },
    checkVideo(){

    }
  },
  components: {
    MinusCircleOutlined,
    PlusOutlined,
    UpPreProcess,
  },
});
</script>

<style scoped>
.publish {
  display: flex;

  flex-direction: column;
  align-items: center;
}

.form-container {
  background-color: rgba(200, 200, 200, 0.5);
  width: 600px;
  margin-top: 70px;
}

.form-title {
  width: 600px;
  height: 100px;
  line-height: 100px;

  font-size: 40px;
  padding-left: 20px;
}
.form-body {
  width: 600px;
  height: 600px;
  background-color: rgba(200, 200, 200, 0.5);
  padding: 40px;
}
.setTags {
  height: 200px;
  background-color: rgba(200, 200, 200);
  overflow: scroll;
}
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}

.publish:deep(.ant-modal-body){
  padding: 0!important;
  height: 600px;
}
</style>