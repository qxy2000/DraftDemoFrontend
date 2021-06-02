<template>
    <el-container>
        <el-aside>
            <Navigator :status = navStatus></Navigator>
        </el-aside>
        <el-main>
            <div class="overlay"></div> 
            <div class="main-background"></div>
            <div class="main-content">
                <div class="logo-content">
                    <div class="logo-3d">
                        <div><el-image :src="require('@/assets/imgs/2.gif')" style="width: 80px;"/> </div>
                        <el-image :src="require('@/assets/imgs/title2.gif')" style="width: 300px;"/>
                    </div>
                </div>
                <div class="sub-title">项目名称</div>
                <div class="main-title">基于Web的三维模型检索系统设计与实现</div>
                <div class="intro-content">&nbsp;&nbsp;{{content1}}{{content2}}{{content3}}</div>
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
            fit: 'contain',
            content1:'随着三维模型生成的门槛降低及三维模型应用的不断发展，三维模型数量不断增加，对三维模型进行匹配与检索的需求也愈发迫切。在众多三维模型检索方式中，基于草图进行检索是一种相对来说比较自然与简便的检索方式。',
            content2:'本项目设计并实现了一个基于Web的二维草图的三维模型检索系统。该系统前端基于Vue开发，支持用户根据标签查看三维模型，根据输入或上传其绘制的二维草图检索三维模型，结果支持三维可视化与三维交互。该系统后端基于Flask开发，通过机器学习进行特征提取与相似度比较。',
            content3: '二维草图的三维模型检索核心算法使用基于师生策略的跨模态引导网络，通过使用3D形状的分类结果来指导草图的特征学习。',
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
    margin-top: 90px;
}

.logo-content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 60%;
    margin-left: 20%;
}
.logo-font {
    font-size:110px;
    color:#999999;
    font-weight: lighter;
}
.sub-title {
    color: #bfbfbf;
    font-size: 24px;
    font-weight: 300;
    margin-top: 40px;
}

.main-title {
    color: black;
    font-weight: 900;
    font-size: 38px;
    margin-top: 10px;
}

.intro-content {
    width: 56%;
    margin-left: 22%;
    margin-top: 30px;
    color: #999999;
    font-size: 17px;
    line-height: 30px;
}
</style>