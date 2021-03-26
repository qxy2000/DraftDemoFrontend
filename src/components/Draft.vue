 <template>
 <div>
  <el-row>
 <el-button type="primary" v-show="openbuttonVisible" @click="createCanvas">点击打开画板</el-button>
  </el-row>
<el-row style="padding-top:30px" v-show="openbuttonVisible">
  <el-col :span="6" :offset="9">
 <!-- <el-upload
  class="upload-demo"
  action="http://127.0.0.1:5000/"
  accept="image/png,image/gif,image/jpg,image/jpeg"
  :limit="1"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :auto-upload="false"
  :on-success="onSuccess"
  :on-progress="onProgress"
  :file-list="fileList"
  list-type="picture">
  <el-button slot="trigger" type="primary" @click="searchVisible=true">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload> -->

<!-- 与服务器链接的url -->
<!-- action="http://100.64.161.192:9091/predict" -->
<el-upload
  class="upload-demo"
  ref="upload"
  action="http://127.0.0.1:5000/predict"
  :headers="headers"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :file-list="fileList"
  :auto-upload="false">
  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>

  </el-col>
</el-row>
 <el-row style="padding-top:30px">
   <el-button  type="primary" v-show="searchVisible" @click="handleDrawSubmit">搜索</el-button>
</el-row>

 <div class="canvas" v-show="canvasVisible">
   <!-- <canvas id="canvas" width="300" height="300">  -->
    <el-card shadow="always" class="box-card">
    <el-row type="flex" class="canrow" justify="center">
      <el-col :span="4" class="canrow-col">
        <el-slider v-if="isPainting"
                   v-model="lineWidth"
                   :min="1"
                   :max="50">
        </el-slider>
        <el-slider v-else
                   v-model="lineWidth"
                   :min="10"
                   :max="50"
                   :step="10">
        </el-slider>
      </el-col>
      <el-col :span="8">
        <div class="header">
          <el-button-group>
            <el-button :type=buttonType(0)
                       icon="iconfont icon-pen" round
                       @click="painting">
            </el-button>
            <el-button :type="buttonType(1)"
                       icon="iconfont icon-eraser"
                       @click="eraser">
            </el-button>
            <el-button :type="buttonType(2)"
                       icon="iconfont icon-last-step"
                       :disabled="history.length === 0"
                       @click="lastStep">
            </el-button>
            <el-button :type="buttonType(3)"
                       icon="iconfont icon-clear"
                       @click="clearAll">
            </el-button>
            <el-button :type="buttonType(4)"
                       icon="iconfont icon-save"
                       round @click="save">
            </el-button>
          </el-button-group>
        </div>
      </el-col>
      <!-- <el-col span="6" class="row-col">
        <div class="row-col-color">
          <el-button v-for="(item, index) in colorArr"
                     :size="colorSize(index)"
                     :style="item.style" circle
                     @click="checkColor(index)">
          </el-button>
        </div>
      </el-col> -->
    </el-row>
    <el-row>
      <!-- <el-col :span="14" :offset="6"> -->
        <div class="content">
          <!-- <canvas ref="canvas" id="canvas" width="300" height="300"></canvas> -->
           <canvas id="canvas" width="300" height="300"></canvas>
        </div>
      <!-- </el-col> -->
    </el-row>
  

  <span class="dialog-footer">
    <el-button @click="canvasVisible = false; openbuttonVisible=true">取 消</el-button>
    <el-button type="primary" @click="handleDrawSubmit">确 定</el-button>
  </span>
   </el-card>
 </div>

  <h1>{{msg}}</h1>
  <el-button type="primary" @click="testBack">test与后端的连接</el-button>

  </div>
</template>
<script type="text/ecmascript-6">
import axios from 'axios'
import VueAxios from 'vue-axios'

  export default {
    data() {
      return {
        active: 0,
        canvasVisible: false,
        openbuttonVisible:true,
        searchVisible:false,
        colorActive: 0,
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
        msg:'',
        imgUrl:'',
        file:'',
        fileList:[]
        //fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
      }
    },
    methods: {
      getMessage(){
        // const path='http://100.64.161.192:9091/';
        const path='http://127.0.0.1:5000/';
        axios
          .get(path)
          .then(res=>{
            this.msg=res.data;
          })
          .catch(error=>{
            console.error(error);
          });
      },
      testBack(){
        this.getMessage();
        },

      // handleRemove(file, fileList) {
      //   console.log(file, fileList);
      // },
      
      
      // // 点击保存按钮上传图片
      // submit2:function(){
		  //   this.$refs.upload.submit();
	    // },
		
	    // // 图片上传成功后，后台返回图片的路径
	    // onSuccess:function(res){
		  //   // console.log(res);
		  //   if(res.status==200){
			//     this.imgUrl=res.data.imgUrl;
		  //   }
      // },
      submitUpload() {
        this.headers = {"Content-Type": "application/x-www-form-urlencoded"};
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },

      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      getColor() {
        this.$store.dispatch('ajax', {
          url: '/canvas/color',
          success: (response) => {
            if (response.flag === 1) {
              this.colorArr = response.data;
            }
          }
        });
      },

      createCanvas(){
        this.initCanvas();
        this.painting();
        this.canvasVisible=true;
        this.openbuttonVisible=false;
        this.searchVisible=false
      },

      initCanvas() {
        let that = this;
        // 获取canvas元素
        // this.canvas = this.$refs.canvas;
        this.canvas = document.getElementById("canvas");
        // 指定了画布上绘制的类型为2d
        this.ctx = this.canvas.getContext('2d');
        // 获取画布相对于视窗的位置集合
        let rect = this.canvas.getBoundingClientRect();
        // let initX = rect.x;
        // let initY = rect.y;
        let initX = rect.left;
        let initY = rect.top;
        console.log("react")
        console.log(rect.left)
        console.log(rect.top)
        // this.pageWidth = document.documentElement.clientWidth - rect.x - 50;
        // this.pageHeight = document.documentElement.clientHeight - rect.y - 50;
        this.pageWidth = document.documentElement.clientWidth - rect.left - 50;
        this.pageHeight = document.documentElement.clientHeight - rect.top - 50;
        console.log("document.documentElement.clientWidth document.documentElement.clientHeight")
        console.log(document.documentElement.clientWidth)
        console.log(document.documentElement.clientHeight)
        console.log("pageWidth  pageHeight")
        console.log(this.pageWidth)
        console.log(this.pageHeight)
        this.canvas.width = this.pageWidth;
        this.canvas.height = this.pageHeight;
        let image = this.ctx.getImageData(0, 0, that.pageWidth, that.pageHeight);
        this.history.push(image);
        // 鼠标按下事件
        this.canvas.onmousedown = function (e) {
          that.ctx.beginPath();
          that.paint = that.isPainting;
          that.clear = !that.isPainting;
          let x = e.clientX - initX;
          let y = e.clientY - initY;
          // let x = e.clientX;
          // let y = e.clientY ;
          console.log("鼠标按下事件");
          console.log(x);
          console.log(y);
          that.lastPoint = {x: x, y: y};
        };
        // 鼠标移动事件
        this.canvas.onmousemove = function (e) {
          if (that.paint) {
            let x = e.clientX - initX;
            let y = e.clientY - initY;
            // let x = e.clientX;
            // let y = e.clientY;
            // console.log("鼠标移动事件");
            // console.log(x);
            // console.log(y);
            that.newPoint = {x: x, y: y};
            that.drawLine();
            that.lastPoint = that.newPoint;
          }
          if (that.clear) {
            let x = e.clientX - initX;
            let y = e.clientY - initY;
            // let x = e.clientX;
            // let y = e.clientY;
            that.ctx.save();
            that.ctx.clearRect(x, y, that.lineWidth, that.lineWidth);
            that.ctx.restore();
          }
        };
        // 鼠标松开事件
        this.canvas.onmouseup = function () {
          that.ctx.closePath();
          let image = that.ctx.getImageData(0, 0, that.pageWidth, that.pageHeight);
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
        this.isPainting = true;
        this.active = 0;
      },
      eraser() {
        this.isPainting = false;
        this.active = 1;
      },
      clearAll() {
        this.paint = this.clear = this.isPainting = false;
        this.ctx.clearRect(0, 0, this.pageWidth, this.pageHeight);
        this.history.length = 1;
        this.active = 3;
      },
      save() {
        this.active = 4;
        this.paint = this.clear = this.isPainting = false;
        let imgUrl = this.canvas.toDataURL("image/png");
        console.log(imgUrl);
        let saveImg = document.createElement("a");
        document.body.appendChild(saveImg);
        saveImg.href = imgUrl;
        saveImg.download = "canvas" + (new Date).getTime();
        console.log(saveImg);
        saveImg.target = "_blank";
        saveImg.click();
      },
    //   checkColor(param) {
    //     this.ctx.strokeStyle = this.colorArr[param].color;
    //     this.colorActive = param;
    //   },
    //   colorSize(param) {
    //     if (param === this.colorActive) {
    //       return "default"
    //     } else {
    //       return "medium"
    //     }
    //   },
      lastStep() {
        this.history.pop();
        this.ctx.putImageData(this.history[this.history.length - 1], 0, 0);
        this.active = 2;
      },
      buttonType(param) {
        if (param === this.active) {
          return "primary"
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
        this.searchVisible=true;
      },

      base64ImgtoFile(dataurl, filename = 'file') {
        let arr = dataurl.split(',')
        let mime = arr[0].match(/:(.*?);/)[1]
        let suffix = mime.split('/')[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      })
      },

      handleDrawSubmit(){
        this.canvasVisible = false; 
        this.openbuttonVisible=true; 
        console.log("markkkkkkkkkk")
        let imgUrl = this.canvas.toDataURL("image/png");
        //console.log(imgUrl);
        let imgFile = this.base64ImgtoFile(imgUrl); 
        console.log(imgFile);
        const param = new FormData();
        param.append('file', imgFile);
        // .post('http://100.64.161.192:9091/predict',param,{headers:{'Content-Type':'application/x-www-form-urlencoded' }}, ) //请求头要为表单
        axios
          .post('http://127.0.0.1:5000/predict',param,{headers:{'Content-Type':'application/x-www-form-urlencoded' }}, ) //请求头要为表单
          .then(response=>{
            console.log(response.data);
            this.$router.push('/result');
          })
          .catch(function (error) {
            console.log(error);
          })
        
        //this.$router.push('/result')
      },
      handleUploadSubmit(){
        this.$router.push('/result')
      }
    // mounted() {
    // //   this.getColor();
    //   this.initCanvas();
    //   this.painting();
    // }
    }
  }
</script>
<style lang="less" scoped>
  .header {
    text-align: center;
  }
  .canrow {
    padding: 5px 0;
    &-col {
      padding: 0 30px;
      background-color: #f9fafc;
      border-radius: 50px;
      &-color {
        text-align: center;
        line-height: 30px;
      }
    }
  }
  .box-card {
    width: 1000px;
    margin: 0 auto;
  }
  .content {
    border: 1px solid #DCDFE6;
  }
</style>

