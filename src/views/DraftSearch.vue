<template>
  <el-container>
    <el-aside>
      <Navigator :status="navStatus"></Navigator>
    </el-aside>
    <el-main>
      <div class="overlay"></div>
      <div class="main-background"></div>
      <el-col :span="6" offset="1">
        <el-row>
          <div class="sketch">
            草图绘制
          </div>
        </el-row>
        <el-row>
          <el-card class="img-show">
            <img v-if="hasImage" :src="imageShowUrl" class="img-display" />
            <i v-else class="el-icon-picture-outline img-show-icon"></i>
          </el-card>
        </el-row>
        <el-row>
          <el-button class="button-draw" @click="createCanvas"
            >绘制草图</el-button
          >
          <el-dialog
            title="画板"
            :visible.sync="centerDrawDialogVisible"
            :width="canvasWidth"
            center
          >
            <!-- 用画板进行草图的绘制 -->
            <div class="canvasboard" v-show="canvasVisible">
              <!-- <canvas id="canvas" width="300" height="300">  -->
              <el-row type="flex" class="canrow" justify="center">
                <el-col :span="4" class="canrow-col">
                  <el-slider
                    v-if="isPainting"
                    v-model="lineWidth"
                    :min="1"
                    :max="50"
                  >
                  </el-slider>
                  <!-- 调整画笔粗细 -->
                  <el-slider
                    v-else
                    v-model="lineWidth"
                    :min="10"
                    :max="50"
                    :step="10"
                  >
                  </el-slider>
                </el-col>
                <el-col :span="12">
                  <div class="header">
                    <el-button-group>
                      <!-- 画笔 -->
                      <el-button
                        :type="buttonType(0)"
                        icon="iconfont icon-pen"
                        round
                        @click="painting"
                      >
                      </el-button>
                      <!-- 橡皮 -->
                      <el-button
                        :type="buttonType(1)"
                        icon="iconfont icon-eraser"
                        @click="eraser"
                      >
                      </el-button>
                      <!-- 撤销 -->
                      <el-button
                        :type="buttonType(2)"
                        icon="iconfont icon-last-step"
                        :disabled="history.length === 0"
                        @click="lastStep"
                      >
                      </el-button>
                      <!-- 清空画板 -->
                      <el-button
                        :type="buttonType(3)"
                        icon="iconfont icon-clear"
                        @click="clearAll"
                      >
                      </el-button>
                      <!-- 保存图片 -->
                      <el-button
                        :type="buttonType(4)"
                        icon="iconfont icon-save"
                        round
                        @click="save"
                      >
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
              <el-button @click="centerDrawDialogVisible = false"
                >取 消</el-button
              >
              <el-button type="primary" @click="handleDrawSubmit"
                >确 定</el-button
              >
            </span>
          </el-dialog>
        </el-row>
        <el-row>
          <el-button
            class="button-upload"
            @click="centerUploadDialogVisible = true"
            >上传图片</el-button
          >

          <el-dialog
            title="请从以下两种方式中选择一种："
            :visible.sync="centerUploadDialogVisible"
            width="30%"
            center
          >
            <div class="url-font">
              <span>图片url：</span>
              <div style="margin-top: 10px;">
                <el-input
                  placeholder="输入图片网址"
                  v-model="picUrl"
                  class="input-with-select"
                  ><el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="urlUpload"
                  ></el-button
                ></el-input>
              </div>
            </div>
            <div>
              <div class="upload-font">
                <span>上传本地图片：</span>
              </div>
              <el-upload
                class="upload-demo"
                ref="upload"
                action="http://127.0.0.1:5000/predict"
                :headers="headers"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :file-list="fileList"
                :auto-upload="false"
              >
                <el-button slot="trigger" type="primary">选取文件</el-button>

                <el-button
                  style="margin-left: 20px;"
                  type="success"
                  @click="submitUpload"
                  >上传到服务器</el-button
                >
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png文件，且不超过500kb
                </div>
              </el-upload>
            </div>
          </el-dialog>
        </el-row>
      </el-col>
      <el-col :span="14" offset="2">
        <div class="result-display">
          <DisplayBox :id="0"></DisplayBox>
          <DisplayBox :id="1"></DisplayBox>
          <DisplayBox :id="2"></DisplayBox>
          <DisplayBox :id="3"></DisplayBox>
          <DisplayBox :id="4"></DisplayBox>
          <DisplayBox :id="5"></DisplayBox>
          <DisplayBox :id="6"></DisplayBox>
          <DisplayBox :id="7"></DisplayBox>
          <DisplayBox :id="8"></DisplayBox>
          <!-- <DisplayBox :id="8"></DisplayBox> -->
        </div>
      </el-col>
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
      canvasWidth: 800,
      canvasHeight: 600,
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
      centerUploadDialogVisible: false
    };
  },
  methods: {
    //打开画布
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
    //画布初始化
    initCanvas() {
      let that = this;
      // 获取canvas元素
      // this.canvas = this.$refs.canvas;
      this.canvas = document.getElementById("canvas");
      // 指定了画布上绘制的类型为2d
      this.ctx = this.canvas.getContext("2d");
      // 获取画布相对于视窗的位置集合
      let rect = this.canvas.getBoundingClientRect();
      // let initX = rect.x;
      // let initY = rect.y;
      let initX = rect.left;
      let initY = rect.top;
      console.log("react");
      console.log(rect.left);
      console.log(rect.top);

      this.pageWidth = document.documentElement.clientWidth;
      this.pageHeight = document.documentElement.clientHeight;

      this.canvas.width = this.canvasWidth * 0.9;
      this.canvas.height = this.canvasHeight - 100;
      let image = this.ctx.getImageData(0, 0, that.pageWidth, that.pageHeight);
      this.history.push(image);
      // 鼠标按下事件
      this.canvas.onmousedown = function(e) {
        that.ctx.beginPath();
        that.paint = that.isPainting;
        that.clear = !that.isPainting;

        let x = e.offsetX || e.clientX;
        let y = e.offsetY || e.clientY;
        console.log("鼠标按下事件");
        console.log(x);
        console.log(y);
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
    //进行画线
    drawLine() {
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";
      this.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
      this.ctx.lineTo(this.newPoint.x, this.newPoint.y);
      this.ctx.stroke();
      this.ctx.closePath();
    },
    //调整画笔粗细
    painting() {
      this.isPainting = true;
      this.active = 0;
    },
    //橡皮操作
    eraser() {
      this.isPainting = false;
      this.active = 1;
    },
    //清空画板操作
    clearAll() {
      this.paint = this.clear = this.isPainting = false;
      this.ctx.clearRect(0, 0, this.pageWidth, this.pageHeight);
      this.history.length = 1;
      this.active = 3;
    },
    //保存所绘制的草图
    save() {
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
    // 撤销操作
    lastStep() {
      this.history.pop();
      this.ctx.putImageData(this.history[this.history.length - 1], 0, 0);
      this.active = 2;
    },
    buttonType(param) {
      if (param === this.active) {
        return "primary";
      }
    },

    //base64图片转file文件
    base64ImgtoFile(dataurl, filename = "file") {
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

    // 用绘制的草图进行搜索
    handleDrawSubmit() {
      this.hasImage = true;
      this.useDrawboard = true;
      this.canvasVisible = false;
      this.centerDrawDialogVisible = false;
      let imgUrl = this.canvas.toDataURL("image/png");
      this.imageShowUrl = imgUrl;
      console.log(this.imageShowUrl);
      let imgFile = this.base64ImgtoFile(imgUrl);
      console.log(imgFile);
      const param = new FormData();
      param.append("file", imgFile);
      // .post('http://100.64.161.192:9091/predict',param,{headers:{'Content-Type':'application/x-www-form-urlencoded' }}, ) //请求头要为表单
      axios
        .post("http://127.0.0.1:5000/predict", param, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        }) //请求头要为表单
        .then(response => {
          console.log(response.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    handleSuccess(res, file) {
      this.imageShowUrl = URL.createObjectURL(file.raw);
    },
    // getDataUrl(img) {
    //   // Create canvas
    //   const canvas = document.createElement("canvas");
    //   const ctx = canvas.getContext("2d");
    //   // Set width and height
    //   canvas.width = img.width;
    //   canvas.height = img.height;
    //   // Draw the image
    //   ctx.drawImage(img, 0, 0, img.width, img.height);
    //   return canvas.toDataURL("image/jpeg");
    // },
    //将选取的文件上传到服务器
    submitUpload() {
      this.hasImage = true;
      this.useUpload = true;
      console.log("imageshoeURL");
      console.log(this.imageShowUrl);
      this.headers = { "Content-Type": "application/x-www-form-urlencoded" };
      this.$refs.upload.submit();
      this.centerUploadDialogVisible = false;
    },
    urlUpload() {
      this.hasImage = true;
      this.useUrl = true;
      this.imageShowUrl = this.picUrl;
      console.log(this.imageShowUrl);
      var image = new Image();
      image.src = this.picUrl;
      let self = this;
      image.setAttribute("crossOrigin", "Anonymous");
      image.onload = function() {
        var base64 = self.getBase64Image(image);
        // document.getElementById("img")['src'] = base64;
        var formData = new FormData();
        //转换base64到file
        var urlFile = self.btof(base64, "img");
        console.log(urlFile);
        const param = new FormData();
        param.append("file", urlFile);
        console.log("url upload");
        // .post('http://100.64.161.192:9091/predict',param,{headers:{'Content-Type':'application/x-www-form-urlencoded' }}, ) //请求头要为表单
        axios
          .post("http://127.0.0.1:5000/predict", param, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
          }) //请求头要为表单
          .then(response => {
            console.log(response.data);
          })
          .catch(function(error) {
            console.log(error);
          });
      };
      this.centerUploadDialogVisible = false;
    },
    /** url 转换成img */
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

.sketch {
  width: 300px;
  float: left;
}
.result-display {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.upload-display {
  margin-top: 50px;
}
.img-show {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}
.img-show:hover {
  border-color: #409eff;
}
.img-show-icon {
  font-size: 28px;
  color: #8c939d;
  width: 250px;
  height: 200px;
  line-height: 200px;
  text-align: center;
}
.img-display {
  width: 178px;
  height: 178px;
  display: block;
  margin: 0px auto;
}
// .canvasboard {
//   width: 1000px;
// }
// .content {
//   height: 200px;
//   border: 1px solid #555555;
// }
.url-font {
  margin-left: 20px;
  font-size: 18px;
}
.upload-font {
  margin-left: 20px;
  margin-top: 30px;
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
.button-draw {
  background-color: white;
  color: black;
  border: 2px solid #555555;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 20px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;
  width: 200px;
  margin-top: 90px;
}
.button-draw:hover {
  background-color: #555555;
  color: white;
}
.button-upload {
  background-color: white;
  color: black;
  border: 2px solid #555555;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 20px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;
  width: 200px;
  margin-top: 50px;
}
.button-upload:hover {
  background-color: #555555;
  color: white;
}
.header {
  margin-left: 30px;
}
</style>
