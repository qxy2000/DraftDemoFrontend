<template>
    <el-container>
        <el-aside>
            <Navigator :status = navStatus></Navigator>
        </el-aside>
        <el-main>
            <div class="overlay"></div> 
            <div class="main-background"></div>
            <div class="main-content">    
                <el-avatar :size = 200 :src="require('@/assets/imgs/introduce.jpg')">
                </el-avatar>
                <div class="sub-title">项目名称</div>
                <div class="main-title">基于Web的三维模型检索系统设计与实现</div>
                <div class="intro-content">项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍
                    项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍
                    项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script>
import Navigator from "../components/Navigator"

export default {
    name: 'Introduce',
    components: {
        Navigator,
    },
    data() {
        return {
            navStatus: {
                status1: 1,
                status2: 0,
                status3: 0
            },
        }
    },
}
</script>

<style lang="less" scoped>
.el-main {
    padding: 0;
}

.overlay {
    position: absolute;
    top: 0;
    left: 300px;
    right: 0;
    bottom: 0;
    content: '';
    opacity: .7;
    background: #fff;
    z-index: -1; 
}

.main-background {
    background: url('~@/assets/imgs/background.jpg');
    width: 100%;
    height: 100%;
    position: fixed;
    background-size: 100% 100%;
    opacity: .8;
    z-index: -2;
}

.main-content {
    z-index: 1;
    margin-top: 80px;
}

.sub-title {
    color: #bfbfbf;
    font-size: 24px;
    font-weight: 300;
    margin-top: 20px;
}

.main-title {
    color: black;
    font-weight: 900;
    font-size: 38px;
    margin-top: 10px;
}

.intro-content {
    width: 50%;
    margin-left: 25%;
    margin-top: 20px;
    color: #999999;
    font-size: 19px;
    line-height: 30px;
}
</style>