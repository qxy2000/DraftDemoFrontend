<template>
  <el-container>
    <el-aside>
      <Navigator :status="navStatus"></Navigator>
    </el-aside>
    <el-main>
      <div class="overlay"></div>
      <div class="main-background"></div>
      <div class="main-content">
      <div class="sketch-box">
          <el-card class="img-show" shadow="hover">
            <img v-if="hasImage" :src="imageShowUrl" class="img-display" />
            <i v-else class="el-icon-picture-outline img-show-icon"></i>
          </el-card>
        <el-row class="img-title">草图显示</el-row>
        <el-row class="draw-sketch">
          <el-button class="button-sketch" type="primary" @click="createCanvas">绘制草图</el-button>
          <el-dialog
            title="画板"
            :visible.sync="centerDrawDialogVisible"
            :width="canvasWidth" :height="canvasHeight" center>
            <!-- Draw sketch with drawing board -->
            <div class="canvasboard" v-show="canvasVisible">
              <el-row type="flex" class="canrow" justify="center">
                <el-col :span="4" class="canrow-col">
                  <el-slider v-if="isPainting" v-model="lineWidth"
                    :min="1" :max="50">
                  </el-slider>
                  <!-- Adjust the thickness of the strokes -->
                  <el-slider v-else v-model="lineWidth"
                    :min="10" :max="50" :step="10">
                  </el-slider>
                </el-col>
                <el-col :span="12">
                  <div class="header">
                    <el-button-group>
                      <!-- brush -->
                      <el-button :type="buttonType(0)"
                        icon="iconfont icon-pen" round
                        @click="painting">
                      </el-button>
                      <!-- rubber -->
                      <el-button :type="buttonType(1)"
                        icon="iconfont icon-eraser"
                        @click="eraser">
                      </el-button>
                      <!-- revoke -->
                      <el-button
                        :type="buttonType(2)"
                        icon="iconfont icon-last-step"
                        :disabled="history.length === 0"
                        @click="lastStep">
                      </el-button>
                      <!-- empty the drawing board-->
                      <el-button
                        :type="buttonType(3)"
                        icon="iconfont icon-clear"
                        @click="clearAll">
                      </el-button>
                      <!-- save image -->
                      <el-button
                        :type="buttonType(4)"
                        icon="iconfont icon-save" round
                        @click="save">
                      </el-button>
                    </el-button-group>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <div class="content">
                  <canvas id="canvas" width="300px" height="300px"></canvas>
                </div>
              </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="centerDrawDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="handleDrawSubmit">搜 索</el-button>
            </span>
          </el-dialog>
        </el-row>
        <el-row class="upload-sketch">
          <el-button
            class="button-sketch"
            @click="centerUploadDialogVisible = true">上传图片</el-button>

          <el-dialog
            title="上传图片："
            :visible.sync="centerUploadDialogVisible"
            width="40%"
            center
          >
            <div class="url-font">请从以下两种上传方式中选择一种.</div>
            <div class="url-font">
              <span>图片url：</span>
              <div style="margin-top: 10px;">
                <el-input placeholder="输入图片网址"
                  v-model="picUrl" class="input-with-select">
                  <el-button slot="append" icon="el-icon-search"
                    @click="urlUpload">
                  </el-button>
                </el-input>
              </div>
            </div>
            <div>
              <div class="upload-font">
                <span>上传本地图片：</span>
              </div>
              <el-upload
                :action='uploadUrl' class="upload-demo"
                accept="image/jpeg,image/jpg,image/png"
                :before-upload="onBeforeUpload"
                ref="upload"
                :on-change="onHandleChange"
                :on-success="onHandleSuccess"
                :on-exceed="onHandleExceed"
                :file-list="fileList"
                :limit="1"
                :auto-upload="false"
              >
                <el-button slot="trigger" type="primary">选取文件</el-button>

                <el-button style="margin-left: 20px;" type="success"
                           @click="submitUpload">上传并检索
                </el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png文件，且不超过500KB
                </div>
              </el-upload>
            </div>
          </el-dialog>
        </el-row>
        <el-row>
          <el-button
            class="button-sketch"
            @click="clearSketch">清除草图</el-button>
        </el-row>
      </div>
      <div class="display-content">
      <div v-if="displayContent == 0">
        <div class="hint-word">请输入草图进行检索</div>
      </div>
      <div v-else-if="displayContent == 1">
        <div id="search-loading"></div>
      </div>
      <div v-else>
        <div class="result-display">
          <div v-for="item in currentModelIDs" :key="item.modelID">
            <DisplayBox :id=item.modelID :label=item.label></DisplayBox>
          </div>
          <div class="three-pagination">
            <el-pagination @current-change="handleModelPageChange" background
                            :page-size= "9" :total="totalModelNum"
                            layout="prev, pager, next">
            </el-pagination>
          </div>
        </div>
      </div>
      </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Navigator from "../components/Navigator";
import DisplayBox from "../components/DisplayBox";

import axios from "axios";
import VueAxios from "vue-axios";

export default {
  name: "DraftSearch",
  components: {
    Navigator,
    DisplayBox
  },
  data() {
    return {
      navStatus: {
        status1: 0,
        status2: 0,
        status3: 1
      },
      canvasVisible: false,
      canvasWidth: '800',
      canvasHeight: '480',
      paint: false,
      clear: false,
      isPainting: false,
      lineWidth: 1,
      canvas: {},
      ctx: {},
      pageWidth: 0,
      pageHeight: 0,
      lastPoint: {},
      newPoint: {},
      colorArr: [],
      history: [],
      fileList: [],
      imgfile: "",
      imgUrl: "",
      picUrl: "",
      imageShowUrl: "",
      hasImage: false,
      useDrawboard: false,
      useUpload: false,
      useUrl: false,
      centerDrawDialogVisible: false,
      centerUploadDialogVisible: false,
      uploadUrl: 'http://100.64.215.235:5000/api/search',
      currentModelIDs:'',
      totalModelIDs:'',
      totalModelNum:10,
      displayContent: 0,
      loading:'',
    };
  },
  methods: {
    // Canvas
    createCanvas() {
      this.centerDrawDialogVisible = true;
      //this.$nextTick()的作用：将回调延迟到下次 DOM 更新循环之后执行
      //当dialog打开时，这时候canvas有可能并没有被渲染出来，这个时候去获取canvas元素会报错；
      //而this.$nextTick()在这里实际上指的是等待dialog里面的canvas渲染完，再去执行里面的代码
      this.$nextTick(() => {
        this.initCanvas();
        this.painting();
        this.canvasVisible = true;
      });
    },
    initCanvas() {
      let that = this;
      // 获取canvas元素
      this.canvas = document.getElementById("canvas");
      // 指定了画布上绘制的类型为2d
      this.ctx = this.canvas.getContext("2d");
      // 获取画布相对于视窗的位置集合
      let rect = this.canvas.getBoundingClientRect();
      let initX = rect.left;
      let initY = rect.top;

      this.pageWidth = document.documentElement.clientWidth;
      this.pageHeight = document.documentElement.clientHeight;

      this.canvas.width = this.canvasWidth * 0.8;
      this.canvas.height = this.canvasHeight - 100;
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      let image = this.ctx.getImageData(0, 0, that.pageWidth, that.pageHeight);
      this.history.push(image);
      // 鼠标按下事件
      this.canvas.onmousedown = function(e) {
        that.ctx.beginPath();
        that.paint = that.isPainting;
        that.clear = !that.isPainting;

        let x = e.offsetX || e.clientX;
        let y = e.offsetY || e.clientY;
        that.lastPoint = { x: x, y: y };
      };
      // 鼠标移动事件
      this.canvas.onmousemove = function(e) {
        if (that.paint) {
          let x = e.offsetX;
          let y = e.offsetY;
          that.newPoint = { x: x, y: y };
          that.drawLine();
          that.lastPoint = that.newPoint;
        }
        if (that.clear) {
          let x = e.offsetX;
          let y = e.offsetY;
          that.ctx.save();
          that.ctx.clearRect(x, y, that.lineWidth, that.lineWidth);
          that.ctx.restore();
        }
      };
      // 鼠标松开事件
      this.canvas.onmouseup = function() {
        that.ctx.closePath();
        let image = that.ctx.getImageData(
          0,
          0,
          that.pageWidth,
          that.pageHeight
        );
        that.history.push(image);
        that.paint = that.clear = false;
      };
    },
    drawLine() {
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";
      this.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
      this.ctx.lineTo(this.newPoint.x, this.newPoint.y);
      this.ctx.stroke();
      this.ctx.closePath();
    },
    painting() {
      // adjust brush thickness
      this.isPainting = true;
      this.active = 0;
    },
    eraser() {
      this.isPainting = false;
      this.active = 1;
    },
    clearAll() {
      // clear canvas
      this.paint = this.clear = this.isPainting = false;
      this.ctx.clearRect(0, 0, this.pageWidth, this.pageHeight);
      this.history.length = 1;
      this.active = 3;
    },
    save() {
      // save canvas
      this.active = 4;
      this.paint = this.clear = this.isPainting = false;
      let imgUrl = this.canvas.toDataURL("image/png");
      console.log(imgUrl);
      let saveImg = document.createElement("a");
      document.body.appendChild(saveImg);
      saveImg.href = imgUrl;
      saveImg.download = "canvas" + new Date().getTime();
      console.log(saveImg);
      saveImg.target = "_blank";
      saveImg.click();
    },
    lastStep() {
      //revoke
      this.history.pop();
      this.ctx.putImageData(this.history[this.history.length - 1], 0, 0);
      this.active = 2;
    },
    buttonType(param) {
      if (param === this.active) {
        return "primary";
      }
    },

    
    // UI
    showLoading() {
      this.displayContent = 1;
      this.loading = this.$loading({
            //lock: true,//lock的修改符--默认是false
            fullscreen: false,
            text: '正在检索中',
            customClass: 'create-isLoading',
            background: 'rgba(0, 0, 0, 0)',//遮罩层颜色
            target: document.querySelector(".display-content")//loading覆盖的dom元素节点
      });
    },
    hideLoading() {
      this.displayContent = 2;
      this.loading.close();
    },
    clearSketch() {
      this.displayContent = 0;
      this.imageShowUrl = '';
      this.hasImage = false;
    },


    // Upload Image
    // canvas
    handleDrawSubmit() {
      this.hasImage = true;
      this.useDrawboard = true;
      this.canvasVisible = false;
      this.centerDrawDialogVisible = false;
      let imgUrl = this.canvas.toDataURL("image/png");
      this.imageShowUrl = imgUrl;
      let imgFile = this.base64ImgtoFile(imgUrl);
      const param = new FormData();
      param.append("file", imgFile);

      let config = {
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
      }
      this.showLoading();
      this.$axios.post("/search", param, config)
        .then(response => {
          this.hideLoading();
          console.log(response.data);
          this.initResultModel(response.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    // upload fle
    onBeforeUpload(file)
    {
      const isIMAGE = file.type === 'image/jpeg'||'image/jpg'||'image/png';
      const isLt500K = file.size / 1024 < 500;

      if (!isIMAGE) {
        this.$message.error('上传文件只能是jpg/png格式!');
      }
      if (!isLt500K) {
        this.$message.error('上传文件大小不能超过 500KB!');
      }
      return isIMAGE && isLt500K;
    },
    onHandleChange(file) {
      this.imageShowUrl = URL.createObjectURL(file.raw);
    },
    onHandleExceed() {
      this.$message.warning('仅支持上传一张图片');
    },
    submitUpload() {
      this.hasImage = true;
      this.useUpload = true;
      console.log("imageshowURL");
      console.log(this.imageShowUrl);
      this.headers = { "Content-Type": "application/x-www-form-urlencoded" };
      this.$refs.upload.submit();
      this.showLoading();
      this.centerUploadDialogVisible = false;
    },
    onHandleSuccess(res, file) {
      this.hideLoading();
      this.initResultModel(res);
    },

    // url upload
    urlUpload() {
      this.hasImage = true;
      this.useUrl = true;
      this.imageShowUrl = this.picUrl;
      var image = new Image();
      image.src = this.picUrl;
      let self = this;
      image.setAttribute("crossOrigin", "Anonymous");
      image.onload = function() {
        var base64 = self.getBase64Image(image);
        // base64 to file
        var urlFile = self.btof(base64, "img");
        let param = new FormData();
        param.append("file", urlFile);
        let config = {
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        }
        self.showLoading();
        self.$axios.post("/search", param, config)
          .then(response => {
            self.hideLoading();
            self.initResultModel(response.data);
          })
          .catch(function(error) {
            console.log(error);
          });
      };
      this.centerUploadDialogVisible = false;
    },

    // other func
    initResultModel(data) {
      this.totalModelIDs = data;
      this.totalModelNum =  Object.keys(this.totalModelIDs).length;
      this.currentModelIDs = {};
      for(var i = 0; i < 9; i++) {
        this.currentModelIDs[i] = this.totalModelIDs[i];
        console.log(this.totalModelIDs[i]);
      }
    },
    handleModelPageChange(newPage) {
      var startIndex = (newPage - 1) * 9;
      this.currentModelIDs = {};
      for(var i = 0; i < 9; i++) {
        var modelIndex = startIndex + i;
        if(modelIndex < this.totalModelNum) {
          this.currentModelIDs[i] = this.totalModelIDs[modelIndex];
        }
      }
    },
    
    // img file conversion
    // base64 to img file
    base64ImgtoFile(dataurl, filename = "img") {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let suffix = mime.split("/")[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      });
    },
    // url to img
    getBase64Image(img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
      var dataURL = canvas.toDataURL("image/" + ext);

      return dataURL;
    },
    btof(data, fileName) {
      const dataArr = data.split(",");
      const byteString = atob(dataArr[1]);

      const options = {
        type: "image/jpeg",
        endings: "native"
      };
      const u8Arr = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        u8Arr[i] = byteString.charCodeAt(i);
      }
      return new File([u8Arr], fileName + ".jpg", options);
    }
  }
};
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
  content: "";
  opacity: 0.7;
  background: #fff;
  z-index: -1;
}

.main-background {
  background: url("~@/assets/imgs/background.jpg");
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
  opacity: 0.8;
  z-index: -2;
}
.main-content {
  display: flex;
}
.sketch-box {
  width: 300px;
}
.display-content {
  flex-grow:2;
}
.hint-word {
  font-size: 26px;
  color: #999999;
  line-height: 100vh;
  user-select:none;
}
.result-display {
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.three-pagination {
    margin-right: 220px;
    margin-top: 10px;
}
.upload-display {
  margin-top: 50px;
}
.img-title {
  margin: 15px 0 20px 0;
  font-size: 18px;
}
.img-show {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  margin: 15px 0 0 5px;
}
.img-show:hover {
  border-color: #409eff;
}
.img-show-icon {
  font-size: 36px;
  color: #8c939d;
  width: 250px;
  height: 230px;
  line-height: 200px;
  text-align: center;
}
.img-display {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.url-font {
  margin-left: 20px;
  font-size: 18px;
  margin-top: 15px;
}
.upload-font {
  margin: 30px 20px 20px 20px;
  font-size: 18px;
}
.upload-demo {
  margin-left: 20px;
  margin-top: 12px;
}
.el-upload__tip {
  margin-top: 10px;
  font-size: 15px;
}
.button-sketch {
  background-color: white;
  color: black;
  border: 1px solid #999999;
  font-size: 18px;
  transition-duration: 0.2s;
  cursor: pointer;
  width: 180px;
  margin-top: 50px;
}
.button-sketch:hover {
  background-color: #999999;
  color: white;
}
.header {
  margin-left: 30px;
}
</style>

<style lang="less">
.sketch-box .el-card__body {
  padding: 0px;
  width: 295px;
  height: 230px;
}
.draw-sketch .el-dialog__header {
  padding-top: 15px;
}
.draw-sketch .el-dialog__body {
  padding: 10px 20px 10px 20px;
} 
.draw-sketch .el-dialog__footer {
  padding-bottom: 10px;
}
.upload-sketch .el-dialog__body {
  padding-top: 0;
  padding-bottom: 30px;
}
.create-isLoading {
  .el-loading-spinner {
    .circular {
      height: 70px;
      width: 70px;
    }
    .path {
      stroke: #999999;
      stroke-width: 2;
    }
    .el-loading-text {
      color: #999999;
      font-size: 24px;
    }
  }
}
</style>