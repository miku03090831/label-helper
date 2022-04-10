<template>
  <div class="label">
    <div class="toolbar">
      <div class="buttons">
        <a-button @click="changeFunc('矩形')"> 画矩形 </a-button>
        <a-button @click="changeFunc('拖拽')">拖拽图片</a-button>
        <a-button @click="changeFunc('还原')">复原位置</a-button>
      </div>
      <div class="draw-intro">
        <h3>操作介绍</h3>
        <p>点击上面“画矩形”的按钮可以在图片上做出标记</p>
        <p>
          然后在右侧可以给标记添加标签名称，可以直接选择发布者预设的标签，也可以自定义标签
        </p>
        <p>
          点击“保存本张图片”可以在本地暂时保存本张图片的标注结果，并且切换图片时会自动保存
        </p>
        <p>点击“上传全部结果”可以将结果传到服务器</p>
      </div>
    </div>
    <div class="draw">
      <canvas id="draw-label"></canvas>
    </div>
    <div class="result">
      <div class="result-top">
        <div class="head">
          <span class="head-id">id</span>
          <span class="head-type">形状</span>
          <span class="head-tag">标签</span>
          <span class="head-del">删除</span>
        </div>
        <div class="items">
          <div v-for="(item, index) in labels" :key="index">
            <span class="item-id" @click="chooseLabel(item)"
              >{{ item.id }}
            </span>
            <span class="item-type">{{ item.type }}</span>
            <a-auto-complete
              class="item-tag"
              v-model:value="item.tag"
              style="width: 100px"
              @click="chooseLabel(item)"
              :options="options"
            ></a-auto-complete>
            <!-- <span @click="setColor(item)">换色</span> -->
            <span @click="deleteItem(item)" class="item-del">删除</span>
          </div>
        </div>
      </div>
      <div class="result-bottom">
        <a-button class="save" @click="stroeAsJson">保存本张图片</a-button>
        <a-button class="upload" @click="uploadResult">上传全部结果</a-button>
        <div class="change">
          <a-button class="last" @click="lastPic">上一张</a-button>
          <span>{{ index + 1 }}/{{ length }}</span>
          <a-button class="next" @click="nextPic">下一张</a-button>
          <div>切换图片前会自动保存</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
  toRaw,
  getCurrentInstance,
} from "vue";
import { fabric } from "fabric";

const aboutCanvas = (src, proxy, id) => {
  let picJson = new Array();
  let labelJson = new Array();
  let index = ref(0);
  let fabricObj = null;
  let color = "#ff0000";
  const func = ref(0);
  let start = {},
    end = {},
    drawing = false;

  const labels = ref([]);

  const getCanvas = () => {
    //第一次调用,会创建并返回一个canvas实例。
    //后续调用，会直接返回第一次创建的实例
    if (fabricObj) {
      return fabricObj;
    } else {
      return initCanvas();
    }
  };

  const stroeAsJson = () => {
    let canvas = getCanvas();
    let CanvasJson = JSON.stringify(canvas.toJSON(["id"]));
    let tagResult = toRaw(labels.value);
    picJson[index.value] = CanvasJson;
    labelJson[index.value] = tagResult;
    // console.log("保存了吗", picJson);
    // console.log(labelJson);
  };

  const uploadResult = () => {
    proxy.$axios
      .post("/api/taskChange/storeResult", {
        taskid: id,
        pjson: JSON.stringify(picJson),
        ljson: JSON.stringify(labelJson),
      })
      .then((res) => {
        // console.log(res.data.message)
      });
    proxy.$axios.post("/api/taskChange/finishTask",{
      taskid:id,
      rid:localStorage.getItem("labelLogin")
    }).then(res=>{
      // console.log(res.data.message)
    })
  };

  const test = () => {
    let canvas = getCanvas();

  };

  const chooseLabel = (item) => {
    let canvas = getCanvas();
    let objs = canvas.getObjects();
    for (let i of objs) {
      if (i.id === item.id) {
        canvas.setActiveObject(i);
        canvas.requestRenderAll();
        break;
      }
    }
  };

  const deleteItem = (item) => {
    chooseLabel(item);
    let canvas = getCanvas();
    let objs = canvas.getObjects();
    for (let i of objs) {
      if (i.id === item.id) {
        canvas.remove(i);
        let index = labels.value.findIndex((el) => {
          return el.id === item.id;
        });
        labels.value.splice(index, 1);
      }
    }
  };

  const setControl = (obj, type) => {
    switch (type) {
      case 0: {
        obj.setControlsVisibility({
          mtr: false,
        });
        break;
      }
      case 1: {
        obj.setControlsVisibility({
          mtr: false,
          ml: false,
          mr: false,
          mb: false,
          mt: false,
        });
        break;
      }
      case 2: {
        obj.setControlsVisibility({
          mtr: false,
          ml: false,
          mr: false,
          mb: false,
          mt: false,
          tl: false,
          tr: false,
          bl: false,
          br: false,
        });
        break;
      }

      default:
        break;
    }
  };

  const changeFunc = (f) => {
    const func_dict = {
      拖拽: 0,
      矩形: 1,
      还原: 2,
    };
    func.value = func_dict[f];
    getCanvas().getObjects()[0].set("selectable", false);
    if (func.value === 0) {
      let canvas = getCanvas();
      canvas.getObjects()[0].set("selectable", true);
      canvas.discardActiveObject();
      let sel = new fabric.ActiveSelection(canvas.getObjects(), {
        canvas: canvas,
      });
      setControl(sel, 2);
      canvas.setActiveObject(sel);
      canvas.requestRenderAll();
      //破案了，所有元素在group中的坐标，都是以group的正中心为原点。
      //根据所有元素的最大y坐标和x坐标来得到一个宽高
      //并且当宽高足够的时候，group会居中地摆放所有的元素，使得左右padding相等，上下padding相等。
      //当宽高不足的时候，也还是会居中，使得左右溢出的相等，上下溢出的相等
      //就可以先计算出group的中心，然后进行坐标系变换，把原点从group中心移到左上角去
      //然后在自己写的过程中碰到了数不清的bug，最后找官方的demo抄了
    }
    if (func.value === 1) {
      let canvas = getCanvas();
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      const fabricObj = getCanvas();
      drawing = true;
    }
    if (func.value === 2) {
      let canvas = getCanvas();
      canvas.discardActiveObject();
      let sel = new fabric.ActiveSelection(canvas.getObjects(), {
        canvas: canvas,
      });
      setControl(sel, 2);
      canvas.setActiveObject(sel);
      canvas.setZoom(1);
      sel.center();
      sel.setCoords();
      canvas.requestRenderAll();
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }
  };

  const changeCallback = () => {
    fabricObj.renderAll();
    let objs = fabricObj.getObjects();
    objs[0].set("selectable", false);
    setControl(objs[0], 2);
    for (let i in objs) {
      if (i !== 0) {
        setControl(objs[i], 0);
      }
    }
  };
  const nextPic = () => {
    if (index.value >= src.length - 1) return;
    stroeAsJson();
    changeFunc(2);
    let canvas = getCanvas();
    canvas.dispose();
    //没画过就应该init，画过就应该load

    index.value += 1;
    if (typeof picJson[index.value] === "undefined") {
      initCanvas(index.value);
      labels.value = [];
    } else {
      // initCanvas(index);
      // fabricObj.clear()

      labels.value = labelJson[index.value];
      fabricObj = new fabric.Canvas("draw-label");
      fabricObj.on({
        "mouse:wheel": mouseWheel,
        "mouse:down": mouseDown,
        "mouse:up": mouseUp,
      });
      fabricObj.loadFromJSON(picJson[index.value], changeCallback);
    }
  };

  const lastPic = () => {
    if (index.value <= 0) return;
    stroeAsJson();
    changeFunc(2);
    let canvas = getCanvas();
    canvas.dispose();
    //没画过就应该init，画过就应该load

    index.value -= 1;
    if (typeof picJson[index.value] === "undefined") {
      initCanvas(index.value);
      labels.value = [];
    } else {
      // initCanvas(index);
      // fabricObj.clear()
      labels.value = labelJson[index.value];
      fabricObj = new fabric.Canvas("draw-label");
      fabricObj.on({
        "mouse:wheel": mouseWheel,
        "mouse:down": mouseDown,
        "mouse:up": mouseUp,
      });
      fabricObj.loadFromJSON(picJson[index.value], changeCallback);
    }
  };

  const mouseWheel = (opt) => {
    let zoom;
    let deltaY;
    const fabricObj = getCanvas();
    //官方文档给出的demo
    deltaY = opt.e.deltaY;
    zoom = fabricObj.getZoom();
    zoom *= 0.999 ** deltaY;
    //限制最大和最小缩放比例
    zoom = Math.max(0.1, zoom);
    zoom = Math.min(10, zoom);
    //下面一行是一鼠标为中心缩放。目前因为不知道如何还原，所以暂时不使用
    //fabricObj.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    fabricObj.setZoom(zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  };

  const draw = (type) => {
    let timeId = Date.now();
    switch (type) {
      case 1: {
        //矩形
        let path =
          "M" +
          start.x +
          " " +
          start.y +
          " H" +
          end.x +
          " V" +
          end.y +
          " H" +
          start.x +
          "Z";
        let drawObj = new fabric.Path(path, {
          stroke: color,
          strokeWidth: 5,
          fill: color + "40",
          hasBorders: false,
          // cornerStyle: "circle",
          // cornerSize: 7,
          // cornerColor: "black",
          // transparentCorners: false,
          id: timeId,
        });
        labels.value.push(
          reactive({
            id: timeId,
            type: "矩形",
            tag: "未命名",
          })
        );
        setControl(drawObj, 0);
        getCanvas().add(drawObj);
      }
    }
  };
  const mouseDown = (opt) => {
    // console.log("pointer",opt.pointer)
    // console.log("absolute",opt.absolutePointer)
    let pic = getCanvas().getObjects()[0].aCoords;
    let {
      tl: { y: top, x: left },
      br: { y: bottom, x: right },
    } = pic;
    let tempX = Math.max(left, opt.absolutePointer.x);
    start.x = Math.min(right, tempX);
    let tempY = Math.max(top, opt.absolutePointer.y);
    start.y = Math.min(bottom, tempY);
    // console.log(start);
  };

  const mouseUp = (opt) => {
    let pic = getCanvas().getObjects()[0].aCoords;
    let {
      tl: { y: top, x: left },
      br: { y: bottom, x: right },
    } = pic;
    let tempX = Math.max(left, opt.absolutePointer.x);
    end.x = Math.min(right, tempX);
    let tempY = Math.max(top, opt.absolutePointer.y);
    end.y = Math.min(bottom, tempY);
    // end.x = opt.pointer.x;
    // end.y = opt.pointer.y;
    if (drawing) {
      draw(func.value);
      drawing = false;
    }
  };

  const initCanvas = (index = 0) => {
    fabricObj = new fabric.Canvas("draw-label", {
      centeredScaling: false,
      backgroundColor: "white",
    });
    fabricObj.preserveObjectStacking = true;

    const domCanvas = document.querySelector(".draw");
    fabricObj.setWidth(domCanvas.offsetWidth);
    fabricObj.setHeight(domCanvas.offsetHeight);
    const image = new Image();
    image.src = src[index];
    //image.src="http://qqpublic.qpic.cn/qq_public/0/0-3973878894-A12F35B7356F47ABF34D1BB9543B6C92/0?fmt=jpg&size=45&h=675&w=900&ppv=1.jpg"
    //   image.setAttribute('crossOrigin','anonymous')
    image.onload = () => {
      const imageInstance = new fabric.Image(image, {
        // left: 0,
        // top: 0,
      });
      // fabricObj.setWidth(image.width);
      // fabricObj.setHeight(image.height);
      setControl(imageInstance, 2);
      fabricObj.add(imageInstance);
      imageInstance.center();
      imageInstance.setCoords();
      imageInstance.set("selectable", false);
      window.onresize = () => {
        fabricObj.setWidth(domCanvas.offsetWidth);
        fabricObj.setHeight(domCanvas.offsetHeight);
        imageInstance.center();
        imageInstance.setCoords();
      };
    };

    fabricObj.on({
      "mouse:wheel": mouseWheel,
      "mouse:down": mouseDown,
      "mouse:up": mouseUp,
    });
    //fabric没有提供右键响应事件，需要自己手动在upper-canvas类上面绑定。
    //设置点击右键会退出画图模式
    const upper = document.getElementsByClassName("upper-canvas")[0];
    upper.oncontextmenu = (e) => {
      e.preventDefault();
      drawing = false;
      fabricObj.getObjects()[0].set("selectable", false);
    };
    return fabricObj;
  };

  return {
    labels,
    changeFunc,
    getCanvas,
    chooseLabel,
    deleteItem,
    stroeAsJson,
    nextPic,
    lastPic,
    test,
    index,
    uploadResult
  };
};

export default defineComponent({
  props: ["id"],
  setup(props) {
    let { proxy } = getCurrentInstance();
    let imgArr = [];

    const {
      getCanvas,
      changeFunc,
      labels,
      chooseLabel,
      deleteItem,
      stroeAsJson,
      nextPic,
      lastPic,
      test,
      index,
      uploadResult
    } = aboutCanvas(imgArr, proxy, props.id);
    // const options = ref([{ value: "花" }, { value: "鸟" }, { value: "鱼" }]);
    const options = ref([]);
    proxy.$axios
      .post("/api/getTask/getCertainTags", { taskid: props.id })
      .then((res) => {
        for (let tag of res.data.message) {
          options.value.push({ value: tag.tag });
        }
      });
    let length = ref(0);
    onMounted(() => {
      proxy.$axios
        .post("/api/getTask/getCertainPics", { taskid: props.id })
        .then((res) => {
          for (let pic of res.data.message) {
            imgArr.push(pic.img);
          }
          length.value = imgArr.length;
          getCanvas();
        });
    });
    onUnmounted(() => {
    });
    return {
      chooseLabel,
      changeFunc,
      labels,
      deleteItem,
      options,
      stroeAsJson,
      nextPic,
      lastPic,
      test,
      index,
      length,
      uploadResult
    };
  },
});
</script>

<style scoped>
.label {
  width: 100vw;
  min-width: 1000px;
  height: calc(100% - 46px);
  margin-top: 46px;
  background-color: #000;
  display: flex;
}
.toolbar {
  height: 100%;
  width: 10vw;
  min-width: 100px;
  background-color: rgba(204, 204, 204, 0.8);
}
.draw {
  height: 100%;
  width: 70vw;
  min-width: 700px;
}

#draw-label {
  height: 100%;
  width: 100%;
}

.result {
  height: 100%;
  width: 20vw;
  min-width: 310px;
  background-color: rgba(204, 204, 204, 0.8);
}

.head {
  height: 40px;
}
.items {
  height: 460px;
  background-color: #cccccc;
  overflow: scroll;
}

.result-bottom {
  /* height: 100px;
  background-color: #000; */
}
.head-id,
.item-id {
  text-align: center;
  display: inline-block;
  width: 100px;
  margin-right: 5px;
  margin-bottom: 5px;
}

.head-type,
.item-type {
  display: inline-block;
  width: 40px;
  margin-right: 5px;
  margin-bottom: 5px;
}

.head-tag,
.item-tag {
  display: inline-block;
  width: 100px;
  margin-right: 5px;
  margin-bottom: 5px;
}

.head-del,
.item-del {
  display: inline-block;
  width: 40px;
  margin-bottom: 5px;
}
.save,
.upload {
  width: 170px;
  margin: 10px 70px;
}
.change {
  width: 100%;
  text-align: center;
}
.buttons {
  width: 100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
.buttons .ant-btn {
  margin-top: 10px;
}

.draw-intro {
  margin: 50px auto;
  width: 80%;
}
</style>