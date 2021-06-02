<template>
<div id="navigator">
    <div id="whole-title"><a @click="goIntroduce">三维模型检索</a></div>
    <div id="logo">
        <el-image :src="require('@/assets/imgs/title2.gif')" style="width: 110px;"/>
    </div>
    <div v-if = "status.status1 == 0">
        <div class="link-1">
            <a @click="goIntroduce" class="sub-title">项目介绍</a>
        </div>
    </div>
    <div v-else-if = "status.status1 == 1">
        <div class="visited-content">项目介绍</div>
    </div>
    <br/>

    <div v-if = "status.status2 == 0">
        <div class="link-2">
            <a @click="goDisplay" class="sub-title">模型查看</a>
        </div>
    </div>
    <div v-else-if = "status.status2 == 1">
        <div class="visited-content">模型查看</div>
    </div><br/>

    <div v-if = "status.status3 == 0">
        <div class="link-3">
            <a @click="goDraftSearch" class="sub-title">草图检索</a>
        </div>
    </div>
    <div v-if = "status.status3 == 1">
        <div class="visited-content">草图检索</div>
    </div>

    <div class="foot">
        Copyright © 2021 All rights reserved
    </div>
</div>
</template>

<script>
export default {
    name: 'Navigator',
    data() {
        return {
            
        }   
    },
    props: [
        'status',
    ],
    methods: {
        goIntroduce() {
            this.$router.push("/");
        },
        goDisplay() {
            this.$router.push("/display");
        },
        goDraftSearch() {
            this.$router.push("/draftsearch");
        }
    }
}
</script>

<style lang="less" scoped>
a {
    text-decoration: none;
    color: #000000;
    cursor: pointer;
}
a.sub-title {
  text-transform: uppercase;
  font-size: 17px;
  font-weight: 800;
  color: #939393;
  padding-bottom: 3px;
  text-decoration: none;
  position: relative;
  display: block;
}
[class^="link-"] {
  display: inline-block;
  margin-bottom: 40px;
}

a.sub-title:before, a.sub-title:after {
  content: '';
  border-bottom: solid 2px black;
  position: absolute;
  bottom: 0;
  width: 0;
}
 
a.sub-title:before { left: 50%; }
a.sub-title:after { right: 50%; }

a.sub-title:before, a.sub-title:after {
  -webkit-transition: all 0.2s ease;
          transition: all 0.2s ease;
}

a.sub-title:hover:before, a.sub-title:hover:after {
  width: 50%;
}

a.sub-title:hover {
    color: black;
}

.foot {
    font-size: 15px;
    color: #939393;
    position:fixed;
    bottom: 30px;
    left: 30px;
}

.visited-content {
    border-bottom: solid 2px black;
    font-size: 17px;
    font-weight: 800;
    color: black;
    padding-bottom: 3px;
    margin-bottom: 40px;
    display: inline-block;
    cursor: default;
}

#navigator {
    background-color: #f5f5f5;
    text-align: center;
    height: 100vh;
    width: 300px;
    position: absolute;
}
#logo {
    padding-top: 15px;
    padding-bottom: 90px;
}
#whole-title {
    font-size: 31px;
    font-weight: 900;
    padding-top: 120px;
    //padding-bottom: 90px;
}
</style>