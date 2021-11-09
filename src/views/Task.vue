<template>
    <div class="tasks">
        <div class="side-bar">
            <a-button class="pub" ref="pub" @click="showPub">发布任务</a-button>
            <a-button class="rec" ref="rec" @click="showRec">领取任务</a-button>
        </div>
        <div class="task-body">
            <Publish v-if="func_num===1"/>
            <Receive v-if="func_num===2"/>
        </div>
    </div>
</template>

<script>
import Publish from "../components/Publish.vue"
import Receive from "../components/Receive.vue"
import { defineComponent,ref } from "vue";
    export default defineComponent({
        components:{
            Publish,Receive
        },
        data(){
            return{
                func_num:1,
            }
        },
        methods:{
            showPub(){
                this.func_num=1;
            },
            showRec(){
                this.func_num=2;
            }

        }

    })


</script>

<style scoped>


.tasks{
    margin-top: 46px;
    /* background-color: rgba(200, 200, 200, 0.5); */
    height: calc(100% - 46px);
    display: flex;
}

.task-body{
    width: 80%;
    height: 100%;
    overflow-y: scroll;
}

.side-bar{
    width: 20%;
    height: 100%;
    display: flex;
    padding-top: 20px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: rgb(3,54,73);
}

.ant-btn{
    width: 150px;
    height: 40px;
    margin-top: 30px;
    border-radius: 10px;
}
</style>