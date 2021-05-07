<template>
    <el-container>
        <el-aside>
            <Navigator :status = navStatus></Navigator>
        </el-aside>
        <el-main>
            <div class="overlay"></div> 
            <div class="main-background"></div>
            <div class="sketch">
                草图绘制
            </div>
            <div class="result-display">
                <DisplayBox :id=0></DisplayBox>
                <DisplayBox :id=1></DisplayBox>
                <DisplayBox :id=2></DisplayBox>
                <DisplayBox :id=3></DisplayBox>
                <DisplayBox :id=4></DisplayBox>
                <DisplayBox :id=5></DisplayBox>
                <DisplayBox :id=6></DisplayBox>
                <DisplayBox :id=7></DisplayBox>
                <DisplayBox :id=8></DisplayBox>
            </div>
        </el-main>
    </el-container>
</template>

<script>
import Navigator from "../components/Navigator"
import DisplayBox from "../components/DisplayBox"

export default {
    name: 'DraftSearch',
    components: {
        Navigator,
        DisplayBox,
    },
    data() {
        return {
            navStatus: {
                status1: 0,
                status2: 0,
                status3: 1
            },
        }
    }    
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

.sketch {
    width: 300px;
    float: left;
}
.result-display {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
</style>