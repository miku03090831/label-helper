<template>
  <div class="publish" ref="publishRef">
    <div class="form-container">
      <div class="form-title">发布任务</div>
      <a-divider
        style="margin: 0; width: 80%; height: 2px; background-color: #000"
      />
      <div class="form-body">
        <a-form name="publish-task" ref="taskRef" :model="taskForm">
          <a-form-item
            label="任务标题"
            name="title"
            :rules="{
              required: true,
              message: '标题不能为空',
              trigger: 'blur',
            }"
          >
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
                trigger: 'blur',
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
          <a-form-item class="input-file">
            <input type="file" @change="selectFolder($event)" webkitdirectory />
          </a-form-item>
          <a-form-item>
            <a-button @click="appendPic" v-show="appendBoolean"
              >追加截图</a-button
            >
            <a-button @click="reSelect" v-show="reSelectBoolean && !appendBoolean"
              >重新选择</a-button
            >
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="submitForm">发布任务</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
  <a-modal
    v-if="visible"
    v-model:visible="visible"
    title="手动选取帧"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
    width="1000px"
    :getContainer="() => $refs.publishRef"
  >
    <UpPreProcess
      :videoList="videoList"
      ref="upProcess"
      @selectOver="selectOver"
    />
  </a-modal>
</template>

<script type="text/javascript" >
import md5 from "js-md5";
import { message } from "ant-design-vue";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { Modal } from "ant-design-vue";
import { createVNode, defineComponent, reactive, ref } from "vue";
import UpPreProcess from "./UpPreProcess.vue";

const aboutSelect = (formData) => {
  const upProcess = ref(null);
  const visible = ref(false);
  const videoList = [];
  const appendBoolean = ref(false);
  const reSelectBoolean = ref(false);
  const clearFormData = () => {
    const temp = [];
    for (let key of formData.keys()) {
      temp.push(key);
    }
    temp.forEach((key) => {
      formData.delete(key);
    });
    temp.splice(0, temp.length);
  };
  const appendPic = () => {
    visible.value = true;
  };
  const reSelect = () => {
    visible.value = true;
  };

  const selectFolder = (e) => {
    clearFormData();
    videoList.splice(0, videoList.length);
    console.log("清除");
    reSelectBoolean.value = false;
    appendBoolean.value = false;
    let files = e.target.files;
    //文件夹名称
    let imagecounts = 0;
    let videocounts = 0;
    let othercounts = 0;
    //文件信息转换成FormData结构遍历上传
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith("image")) {
        imagecounts += 1;
        console.log("图片", files[i]);
        formData.append(i, files[i]);
      } else if (files[i].type.startsWith("video")) {
        videocounts += 1;
        videoList.push(URL.createObjectURL(files[i]));
      } else {
        othercounts += 1;
      }
      //上传
    }
    for (let i in videoList) {
      console.log(videoList[i]);
    }
    if (videocounts !== 0) {
      Modal.confirm({
        title: () => "上传结果",
        content: () =>
          createVNode("div", {}, [
            createVNode("p", {}, `您上传了${imagecounts}个图片文件`),
            createVNode(
              "p",
              {},
              `${videocounts}个视频文件需要选择一些帧用来标注，您可以手动选择特定帧，或者默认使用按时间均分取出的10帧`
            ),
            createVNode(
              "p",
              {},
              `另有${othercounts}个文件无法识别（这些文件的MIME类型不是image或video）`
            ),
          ]),
        maskClosable: false,
        okText: () => "手动选择帧",
        cancelText: () => "自动选择帧",
        onOk() {
          console.log("手动选择去喽");
          //这里不知道为什么this变成undefined了，所以在上面用that保存一下this的值
          visible.value = true;
        },
        onCancel() {
          console.log("自动选择去喽");
        },
      });
    } else {
      Modal.success({
        title: () => "上传结果",
        content: () =>
          createVNode("div", {}, [
            createVNode("p", {}, `您上传了${imagecounts}个图片文件`),
            createVNode(
              "p",
              {},
              `另有${othercounts}个文件无法识别，将被舍弃（这些文件的MIME类型不是image或video）`
            ),
          ]),
        maskClosable: false,
        okText: () => "确认",
        onOk() {
          console.log("上传图片成功");
        },
      });
    }
  };

  const selectOver = (val) => {
    for (let base64 of val) {
      let data = window.atob(base64.split(",")[1]);
      let arr = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) {
        arr[i] = data.charCodeAt(i);
      }
      let name = md5(base64);
      let blob = new Blob([arr], { type: "image/png" });
      blob.lastModifiedDate = new Date();
      blob.name = name + ".png";
      console.log(blob.name)
      formData.append(name, blob,blob.name);
    }
    message.success("截图已成功保存");
    reSelectBoolean.value = false;
    appendBoolean.value = true;
    visible.value = false;
  };

  const handleOk = () => {
    console.log("手动选择完毕");
    upProcess.value.addScreenShot();
  };

  const handleCancel = () => {
    console.log("手动选择取消");
    reSelectBoolean.value = true;
    visible.value = false;
  };

  return {
    reSelect,
    reSelectBoolean,
    appendBoolean,
    appendPic,
    upProcess,
    visible,
    videoList,
    selectFolder,
    selectOver,
    handleOk,
    handleCancel,
  };
};

const aboutForm = (formData) => {
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
        for (let i of formData.keys()) {
          console.log("最终图片", formData.get(i));
        }
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

  return {
    taskRef,
    taskForm,
    submitForm,
    removeTag,
    addTag,
  };
};

export default defineComponent({
  setup() {
    const formData = new FormData();
    const {
      reSelect,
      reSelectBoolean,
      appendBoolean,
      appendPic,
      upProcess,
      visible,
      videoList,
      selectFolder,
      selectOver,
      handleOk,
      handleCancel,
    } = aboutSelect(formData);
    const { taskForm, taskRef, submitForm, removeTag, addTag } =
      aboutForm(formData);

    return {
      reSelect,
      reSelectBoolean,
      appendBoolean,
      appendPic,
      selectFolder,
      selectOver,
      upProcess,
      handleOk,
      handleCancel,
      visible,
      videoList,
      // formData,
      taskRef,
      taskForm,
      submitForm,
      removeTag,
      addTag,
    };
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
  /* margin-top: 30px; */
}

.form-title {
  width: 600px;
  height: 70px;
  line-height: 70px;

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
  margin-bottom: 20px;
}
.setTags:deep(.ant-form-item) {
  margin-bottom: 0;
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

.publish:deep(.ant-modal) {
  top: 40px;
}
.publish:deep(.ant-modal-body) {
  padding: 0 !important;
  height: 550px;
}

.publish:deep(.ant-modal-content) {
  background-color: rgb(196, 226, 216) !important;
}
.publish:deep(.ant-modal-header) {
  background-color: rgb(196, 226, 216) !important;
  border: 0 !important;
}
.publish:deep(.ant-modal-footer) {
  border: 0 !important;
}
</style>