<template>
    <el-container>
        <el-aside>
            <Navigator :status = navStatus></Navigator>
        </el-aside>
        <el-main>
            <div class="overlay"></div> 
            <div class="main-background"></div>
            <div class="select-box">
                <div class="group-title">选择您要查看的模型类别:</div>
                <div>
                    <el-radio-group v-model="radio" class="group-box">
                        <div v-for="(item, index) in items" :key="index">
                            <el-button size="mini" class="group-button" @click="getModelsByTag(index)">
                                {{item}}</el-button>
                        </div>
                    </el-radio-group>
                </div>
                <div class="pagination">
                    <el-pagination small background
                                   @current-change="handleCurrentChange"
                                   layout="prev, pager, next" :total="50">
                    </el-pagination>
                </div>
            </div>
            <div class="three-dimensional-content">
                <DisplayBox :id=0 :fileName="fileName[0]"></DisplayBox>
                <DisplayBox :id=1 :fileName="fileName[1]"></DisplayBox>
                <DisplayBox :id=2 :fileName="fileName[2]"></DisplayBox>
                <DisplayBox :id=3 :fileName="fileName[3]"></DisplayBox>
                <DisplayBox :id=4 :fileName="fileName[4]"></DisplayBox>
                <DisplayBox :id=5 :fileName="fileName[5]"></DisplayBox>
                <DisplayBox :id=6 :fileName="fileName[6]"></DisplayBox>
                <DisplayBox :id=7 :fileName="fileName[7]"></DisplayBox>
                <DisplayBox :id=8 :fileName="fileName[8]"></DisplayBox>
            </div>
            <div class="three-pagination">
                    <el-pagination @current-change="handleRequest" background
                                   layout="prev, pager, next" :total="50">
                    </el-pagination>
                </div>
        </el-main>
    </el-container>
</template>

<script>
import Navigator from "../components/Navigator"
import DisplayBox from "../components/DisplayBox"

export default {
    name: 'Display',
    components: {
        Navigator,
        DisplayBox,
    },
    data() {
        return {
            navStatus: {
                status1: 0,
                status2: 1,
                status3: 0
            },
            radio: 'airplane',
            items : ['airplane', 'alarm clock', 'ant', 'apple', 'armchair', 'ashtray', 'axe', 'banana', 'barn',
                    'basketball bat', 'basket', 'bathtub', 'bear', 'bed', 'bee', 'beer', 'bench', 'bicycle', 
                    'blimp', 'book', 'bookself', 'bowl', 'brain', 'bread', 'bridge', 'bus', 'bush', 'butterfly',
                    'cabinet', 'cake', 'camel', 'camera', 'candle', 'cannon', 'car', 'castle', 'cell phone', 'chair'],
            items1: ['airplane', 'alarm clock', 'ant', 'apple', 'armchair', 'ashtray', 'axe', 'banana', 'barn',
                    'basketball bat', 'basket', 'bathtub', 'bear', 'bed', 'bee', 'beer', 'bench', 'bicycle', 
                    'blimp', 'book', 'bookself', 'bowl', 'brain', 'bread', 'bridge', 'bus', 'bush', 'butterfly',
                    'cabinet', 'cake', 'camel', 'camera', 'candle', 'cannon', 'car', 'castle', 'cell phone', 'chair'],
            items2: ['chandelier', 'church', 'cigarette', 'computer', 'couch', 'cow'],
            drawer: false,
            size: '800px',
            fileName: [
                'M000001.off',
                'M000003.off',
                'M000008.off',
                'M000013.off',
                'M000015.off',
                'M000020.off',
                'M000022.off',
                'M000042.off',
                'M000052.off'
            ]
        }
    },
    methods: {
        getModelsByTag(index) {
            console.log("click: " + index);
        },
        handleCurrentChange(newPage) {
            if (newPage == 1) {
                this.items = this.items1;
            } 
            else {
                this.items = this.items2;
            }
        },
        handleRequest(newPage) {

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

.select-box {
    width: 300px;
    float: left;
}
.group-box {
    display: flex;
    flex-wrap: wrap;
    margin-left: 20px;
}

.group-button {
    margin-right: 10px;
    margin-top: 10px;
}

.group-title {
    margin-top: 90px;
    margin-bottom: 10px;
    text-align: left;
    margin-left: 20px;
}

.pagination {
    text-align: left;
    position: absolute;
    bottom: 50px;
    left: 330px;
}

.three-dimensional-content {
    padding: 0;
    display: flex;
    flex-wrap: wrap;
}

.three-pagination {
    margin-left: 300px;
    margin-top: 10px;
}

.group-box .el-button {
    font-size: 13px;
}
</style>