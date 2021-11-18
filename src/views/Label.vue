<template>
  <div class="label">
    <div class="toolbar">
      <a-button @click="changeFunc(1)"> 矩形 </a-button>
      <a-button @click="changeFunc(0)">选择</a-button>
      <a-button @click="changeFunc(2)">还原</a-button>
    </div>
    <div class="draw">
      <canvas id="draw-label"></canvas>
    </div>
    <div class="result"></div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { fabric } from "fabric";

const aboutCanvas = () => {
  let fabricObj = null;
  let color = "#ff0000";
  let group = null;
  const func = ref(0);
  let start = {},
    end = {},
    drawing = false;

  const getCanvas = () => {
    //第一次调用,会创建并返回一个canvas实例。
    //后续调用，会直接返回第一次创建的实例
    if (fabricObj) {
      console.log("已经存在");
      return fabricObj;
    } else {
      console.log("第一次");
      return initCanvas();
    }
  };

  const addIntoGroup = () => {
    //如果group不是空的的话，需要先把group解散
    let objectsArray = getCanvas().getObjects();
  };

  const changeFunc = (f) => {
    func.value = f;
    if (func.value === 0) {
      let objectsArray = getCanvas().getObjects();
      console.log("大畜生");
      for (let item of objectsArray) {
        item.set("left", 0);
        item.set("top", 0);
        item.setCoords();
      }
      // let text = new fabric.Text('选中啦');
      // let group = new fabric.Group([ text ], {
      //   moveCursor:'pointer'
      // });

      // for(let a of objectsArray){
      //   // getCanvas().remove(a);
      //   group.add(a);
      // }
      let group = new fabric.Group(objectsArray,{
        // originX:"left",
        // originY:"top",
      });
      group.set("width", 600);
      group.set("height", 450);
      //破案了，所有元素在group中的坐标，都是以group的正中心为原点。
      //根据所有元素的最大y坐标和x坐标来得到一个宽高
      //并且当宽高足够的时候，group会居中地摆放所有的元素，使得左右padding相等，上下padding相等。
      //当宽高不足的时候，也还是会居中，使得左右溢出的相等，上下溢出的相等
      //就可以先计算出group的中心，然后进行坐标系变换，把原点从group中心移到左上角去
      group.setCoords();
      getCanvas().add(group);
      getCanvas().remove(group);
      // let item = objectsArray[0];
      // item.set("left",0);
      // item.set("top",0);
      // item.setCoords();
      // getCanvas().renderAll()
      console.log("解散group之前", getCanvas().getObjects());
    }
    if (func.value === 1) {
      // let objectsArray = getCanvas().getObjects();
      // for (let item of objectsArray) {
      //   //这里给top和left的值应该经过计算
      //   //从左上角的坐标得到以group为中心的坐标
      //   item.set("left", -300);
      //   item.set("top", -225);
      //   item.setCoords();
      // }
      // getCanvas().renderAll()
      const fabricObj = getCanvas();
      drawing = true;
      fabricObj.getObjects()[0].set("selectable", false);
      console.log(fabricObj.getObjects());
    }
    if(func.value===2){
      getCanvas().setZoom(1);
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
    fabricObj.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  };

  const draw = (type) => {
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
        });
        getCanvas().add(drawObj);
      }
    }
  };
  const mouseDown = (opt) => {
    // console.log("pointer",opt.pointer)
    // console.log("absolute",opt.absolutePointer)
    let pic = getCanvas().getObjects()[0].oCoords;
    let {
      tl: { y: top, x: left },
      br: { y: bottom, x: right },
    } = pic;
    console.log(top, bottom, left, right);
    let tempX = Math.max(left, opt.absolutePointer.x);
    start.x = Math.min(right, tempX);
    let tempY = Math.max(top, opt.absolutePointer.y);
    start.y = Math.min(bottom, tempY);
    // console.log(start);
  };

  const mouseUp = (opt) => {
    let pic = getCanvas().getObjects()[0].oCoords;
    let {
      tl: { y: top, x: left },
      br: { y: bottom, x: right },
    } = pic;
    let tempX = Math.max(left, opt.absolutePointer.x);
    end.x = Math.min(right, tempX);
    console.log(end.x);
    let tempY = Math.max(top, opt.absolutePointer.y);
    end.y = Math.min(bottom, tempY);
    // end.x = opt.pointer.x;
    // end.y = opt.pointer.y;
    if (drawing) {
      draw(1);
      drawing = false;
    }
  };

  const initCanvas = () => {
    fabricObj = new fabric.Canvas("draw-label", {
      centeredScaling: false,
      backgroundColor: "pink",
    });
    const image = new Image();
    image.src = "http://www.005.tv/uploads/allimg/180714/1QJK101-0.jpg";
    //   image.setAttribute('crossOrigin','anonymous')
    image.onload = () => {
      const imageInstance = new fabric.Image(image, {
        left: 0,
        top: 0,
      });
      fabricObj.setWidth(1000);
      fabricObj.setHeight(676);
      // fabricObj.setWidth(image.width);
      // fabricObj.setHeight(image.height);
      // imageInstance.on({
      //   moving: () => {
      //     if (!group) {
      //       let objectsArray = getCanvas().getObjects()
      //       group = new fabric.Group(objectsArray)
      //       console.log(group)
      //       getCanvas().setActiveObject(group)
      //       console.log("我被移动啦")

      //     }
      //   },
      //   moved: (opt) => {
      //     group = null;

      //   },
      // });
      fabricObj.add(imageInstance);
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
      fabricObj.getObjects()[0].set("selectable", true);
    };
    return fabricObj;
  };

  return {
    changeFunc,
    getCanvas,
  };
};

export default defineComponent({
  setup() {
    const { getCanvas, changeFunc } = aboutCanvas();
    onMounted(() => {
      getCanvas();
    });
    onUnmounted(() => {
      console.log("退出");
    });
    return {
      changeFunc,
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
  width: 5vw;
  min-width: 50px;
  background-color: #fff;
}
.draw {
  height: 100%;
  width: 75vw;
  min-width: 750px;
}

#draw-label {
  height: 100%;
  width: 100%;
}

.result {
  height: 100%;
  width: 20vw;
  min-width: 200px;
  background-color: blue;
}
</style>