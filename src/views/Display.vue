<template>
    <el-container>
        <el-aside>
            <Navigator :status = navStatus></Navigator>
        </el-aside>
        <el-main>
            <div class="overlay"></div> 
            <div class="main-background"></div>
            <div class="select-box">
                <el-autocomplete class="search-input" size="small"
                                 v-model="keyword"
                                 :fetch-suggestions="querySearch"
                                 prefix-icon="el-icon-search"
                                 placeholder="输入关键词进行查找"
                                 @select="handleSelect"
                                 :trigger-on-focus="false"
                                 clearable>
                </el-autocomplete>
                <div class="group-title">选择您要查看的模型类别:</div>
                <div>
                    <el-radio-group v-model="radio" class="group-box" @change="getModelsByTag"
                                    size="small" fill="#eff5ff" text-color="#409eff">
                        <div v-for="(item, index) in items" :key="index">
                            <el-radio-button :label="index" class="group-button">
                                {{item}}</el-radio-button>
                        </div>
                    </el-radio-group>
                </div>
                <div class="pagination">
                    <el-pagination small background :page-size="35"
                                   :total="totalLabelNum"
                                   @current-change="handleLablePageChange"
                                   :current-page="currentLabelPage"
                                   layout="prev, pager, next">
                    </el-pagination>
                </div>
            </div>
            <div v-if="displayContent === false">
                <div class="hint-word">请选择模型类别</div>
            </div>
            <div v-else>
                <div class="three-dimensional-content">
                    <div v-for="item in currentModelIDs" :key="item">
                      <DisplayBox :id=item :label=currentLabel></DisplayBox>
                    </div>
                </div>
                <div class="three-pagination">
                    <el-pagination @current-change="handleModelPageChange" background
                                   :page-size= "9" :total="totalModelNum"
                                   layout="prev, pager, next">
                    </el-pagination>
                </div>
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
            totalLabelNum: 10,
            totalModelNum: 10,
            radio: '',
            displayContent: false,
            items : ['airplane', 'alarm_clock', 'ant', 'apple', 'armchair', 'ashtray', 'axe', 'banana', 'barn',
                    'basketbal_bat', 'basket', 'bathtub', 'bear_animal', 'bed', 'bee', 'beer_mug', 'bench', 'bicycle', 
                    'blimp', 'book', 'bookself', 'bowl', 'brain', 'bread', 'bridge', 'bus', 'bush', 'butterfly',
                    'cabinet', 'cake', 'camel', 'camera', 'candle', 'cannon'],
            currentLabelPage: 1,
            currentModelPage: 1,
            drawer: false,
            size: '800px',
            labels:'',
            currentLabel:'',
            currentModelIDs:'',
            totalModelIDs:'',
            keyword:'',
            searchlabels:'',
        }
    },
    created() {
        this.$axios.get('/display/getlabels').then(
            response => {
                this.updateLabels(response.data);
            }
        );
    },
    methods: {
        getModelsByTag(index) {
            this.displayContent = true;
            this.currentLabel = this.items[index];
            var itemIndex = (this.currentLabelPage - 1) * 34 + parseInt(index);
            console.log("page: " + itemIndex);
            this.$axios.get('/display/getmodels/' + itemIndex).then(
                response => {
                    this.updateModels(response.data);
                }
            )
        },
        handleLablePageChange(newPage) {
            this.displayContent = false;
            this.radio = '';
            this.currentLabelPage = newPage;
            var startIndex = (newPage - 1) * 34;
            var items_new = {};
            for(var i = 0; i < 34; i++) {
                if((startIndex + i) >= this.totalLabelNum) {
                    break;
                }
                items_new[i] = this.labels[startIndex + i];
            }
            if(newPage == 5) {
                items_new[34] = this.labels[ this.totalLabelNum - 1];
            }
            this.items = items_new;
        },
        handleModelPageChange(newPage) {
            this.currentModelPage = newPage;
            this.currentModelIDs = {};
            var startIndex = (this.currentModelPage - 1) * 9;
            for(var i = 0; i < 9; i++) {
                var modelIndex = startIndex + i;
                if(modelIndex < this.totalModelNum) {
                    this.currentModelIDs[i] = this.totalModelIDs[modelIndex];
                }
            }
        },
        updateLabels(data) {
            this.labels = data;
            this.totalLabelNum = Object.keys(this.labels).length;
            this.searchlabels = this.loadAll();
        },
        updateModels(data) {
            this.totalModelIDs = data;
            this.totalModelNum = Object.keys(this.totalModelIDs).length;
            this.currentModelIDs = {};
            for(var i = 0; i < 9; i++) {
                if(i < this.totalModelNum) {
                    this.currentModelIDs[i] = this.totalModelIDs[i];
                }
            }
        },
        querySearch(queryString, cb) {
            var searchlabels = this.searchlabels;
            var results = queryString ? searchlabels.filter(this.createFilter(queryString)) : searchlabels;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (searchlabel) => {
                return (searchlabel.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        loadAll() {
            var result = [];
            for(var i = 0; i < this.totalLabelNum; i++) {
                var current = {};
                current["value"] = this.labels[i];
                current["index"] = i;
                result[i] = current;
            }
            return result;
        },
        handleSelect(item) {
            var index = item.index;
            var currentPage = parseInt(index / 34);
            index -= currentPage * 34;
            currentPage += 1;
            if(currentPage == 6) {
                currentPage = 5;
                index = 34;
            }
            
            // page change
            this.currentLabelPage = currentPage;
            this.handleLablePageChange(currentPage);

            // index change
            this.radio = index;
            this.getModelsByTag(index);
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
    user-select:none;
}

.group-title {
    margin-top: 10px;
    text-align: left;
    margin-left: 24px;
    font-size: 15px;
}

.pagination {
    text-align: left;
    position: absolute;
    bottom: 40px;
    left: 330px;
}

.hint-word {
    font-size: 26px;
    color: #999999;
    line-height: 100vh;
    user-select:none;
}
.three-dimensional-content {
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
}

.three-pagination {
    left: 50%;
    width: 400px;
    margin-left: 100px;
    position: absolute;
    top: 95%;
}

.group-box .el-button {
    font-size: 13px;
}

.search-input {
    width: 250px;
    margin-top: 60px;
    margin-bottom: 10px;
}
</style>

<style lang="less">
.group-box .el-radio-button__inner {
    padding: 9px 12px;
    font-size: 13px;
}
</style>