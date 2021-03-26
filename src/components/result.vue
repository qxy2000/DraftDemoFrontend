<template>
 <div>
  <el-row>
    <el-col :span="6" :offset="2">
       <el-card class="box-card">
            <el-image :src="src"></el-image>
       </el-card>
    </el-col>
  </el-row>
  <el-row style="padding-top:50px">
    <div id="app">
    <div class="card" v-for="message in messages" :key="message.id" v-bind:title="message.title" v-bind:desc="message.desc">
      <img class="img" :src="message.src"><br>{{message.desc}}
    </div>
  </div>
  </el-row>
</div>
</template>
<script>
  export default {
    data() {
      return {
       src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
       fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
      
       messages:[
          {
            id: '1',
            title: 'yiyiyi',
            desc: '111',
            src: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=588962106,1094118114&fm=26&gp=0.jpg'
          },
          {
            id: '2',
            title: 'ererer',
            desc: '222',
            src: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=588962106,1094118114&fm=26&gp=0.jpg'
          },
          {
            id: '3',
            title: 'sansansan',
            desc: '333',
            src: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=588962106,1094118114&fm=26&gp=0.jpg'
          },
          {
            id: '4',
            title: 'sisisi',
            desc: '444',
            src: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=588962106,1094118114&fm=26&gp=0.jpg'
          },
          {
            id: '5',
            title: 'wuwuwu',
            desc: '555',
            src: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=588962106,1094118114&fm=26&gp=0.jpg'
          },
          {
            id: '6',
            title: 'liuliuliu',
            desc: '666',
            src: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=588962106,1094118114&fm=26&gp=0.jpg'
          },
        ]
      
      }
    },
    methods: {

    }
  }
</script>
<style>
 #app{
    width: 90%;
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
    margin: auto;
  }
  .card{
    height: 300px;   
    background-color: #ffffff;
    padding: auto;
    margin-left: 3%
  }
  .card .img{
    height: 200px;
    /* height: auto; */
    vertical-align: middle;
    max-width: 100%;
  }

</style>

