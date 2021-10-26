!<template>
    <div class="detail">
        <div class="detail-card">
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <div class="pic-container"
            v-for="(item) in task.imgs"
            :key="item">
                <img :src=item alt="">
            </div>
        </div>
    </div>
</template>

<script>
    import { defineComponent,reactive } from "vue";
    export default defineComponent({
        props:["id"],
        setup(props){
            console.log(props.id)
            const task = reactive({
                id:"1",
                title:"test1",
                tags: ["花", "鸟", "鱼", "虫", "草", "木"],
                uploader:"user1",
                imgs:["https://img7.51tietu.net/pic/2019-082412/ykbpo4rebqfykbpo4rebqf.jpg","http://qqpublic.qpic.cn/qq_public/0/0-3973878894-A12F35B7356F47ABF34D1BB9543B6C92/0?fmt=jpg&size=45&h=675&w=900&ppv=1.jpg","http://www.005.tv/uploads/allimg/180714/1QJK101-0.jpg"]
            })

            return {
                task
            }
        }
    })
</script>

<style scoped>
.detail{
    width: 100vw;
    height: calc(100% - 46px);
    margin-top: 46px;
    overflow-y: scroll;
}
.detail-card{
    width: 60vw;
    min-width: 500px;
    height: 100%;
    min-height: 500px;
    background-color: #fff;
    margin: 0 auto;
}
</style>