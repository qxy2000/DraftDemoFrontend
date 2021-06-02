<template>
<div>
    <el-card class="box-card" :body-style="{ padding: '0px' }">
        <div :id="id">
        </div>
        <div class="display-button">
            <div class="display-label">
                <el-tag size="mini">{{label}}</el-tag></div>
            <div>
                <el-link :underline="false" @click="download"><i class="el-icon-download"></i>下载</el-link>
                <el-link :underline="false" @click="openDrawer"><i class="el-icon-full-screen"></i>查看</el-link>
            </div>
        </div>
        <el-drawer title="模型详情" :visible.sync="drawer" :size="size" z-index="10"
                   :before-close="handleClose" destroy-on-close>
            <div class="drawer-content">
                <div>模型标签: <el-tag>{{label}}</el-tag></div>
                <div>
                    <el-button @click="rotateControl">
                        <i class="el-icon-view"></i>
                        <span v-if="drawerControl.autoRotate=== false">旋转展示</span>
                        <span v-if="drawerControl.autoRotate=== true">停止旋转</span>
                    </el-button>
                    <el-button @click="drawerDownload"><i class="el-icon-download"></i>下载模型</el-button>
                </div>
            </div>
        </el-drawer>
    </el-card>
</div>
</template>

<script>

export default {
    data() {
        return {
            renderer: '',
            scene: '',
            camera: '',
            geometry: '',
            material: '',
            mesh: '',
            control: '',
            drawerControl: '',
            drawer: false,
            size: '850px',
            drawerRenderer: '',
            drawerScene: '',
            drawerCamera: '',
            animateControl: '',
            cameraPos: 0,
            filePath: '',
            contentData: '',
        }
    },
    props: [
        'id',
        'label',
    ],
    mounted() {
         this.init();
    },
    methods: {
        init() {
            //init Renderer
            var box = document.getElementById(this.id);  
            this.renderer = new THREE.WebGLRenderer({antialias: true,alpha:true});
            //this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(270, 170); 
            box.appendChild(this.renderer.domElement);

            //init scene
            this.scene = new THREE.Scene();

            //init camera
            this.camera = new THREE.PerspectiveCamera(45, 270 / 170, 0.0001, 20000); 
            this.camera.position.set(0, 0, 2);
            this.scene.add(this.camera);
        
            //init light
            var light = new THREE.DirectionalLight(0xffffff);
            light.position.set(20, 50, 50);
            this.scene.add(light);
            this.scene.add(new THREE.AmbientLight(0x555555));

            //init controller
            this.control = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.control.enabled = true;
            this.control.target = new THREE.Vector3();         
            this.control.autoRotate = false;
            this.control.enablePan = false;


            //load mesh
            this.loadModel();
        },

        loadModel() {
            axios.get('http://100.64.215.235:5000/api/model/'+this.id).then(
                response => (this.parseText(response.data))
            );
        },

        parseText(data) {
            this.contentData = data;
            var resArr = data.split(/\s+/);
            var numVertices = resArr[1];
            var numFaces = resArr[2];

            var vertices = [];
            var indexVNum = 4 + 3 * numVertices;
            for (var i = 4; i < indexVNum; i+=3) {
                var point = new THREE.Vector3(resArr[i], resArr[i + 1], resArr[i + 2]);
                vertices.push(point);
            }

            var faces = [];
            var indexFNum = indexVNum + 4 * numFaces;
            for (var i = indexVNum; i < indexFNum; i+=4) {
                //calculate normal
                var p0 = vertices[resArr[i + 1]];
                var p1 = vertices[resArr[i + 2]];
                var p2 = vertices[resArr[i + 3]];
                var v1 = p0.clone().sub(p1);
                var v2 = p0.clone().sub(p2);
                var v3 = new THREE.Vector3();
                v3.crossVectors(v1,v2)
                v3.normalize()
                var face = new THREE.Face3(resArr[i + 1], resArr[i + 2], resArr[i + 3], v3);
                faces.push(face);
            }

            this.geometry = new THREE.Geometry();
			this.geometry.vertices = vertices;
            this.geometry.faces=faces;
            this.geometry.computeBoundingBox();

            this.material = new THREE.MeshLambertMaterial( { color: 0x7cadd2} );
            this.mesh = new THREE.Mesh( this.geometry, this.material );

            // center
            var widthX = this.geometry.boundingBox.max.x - this.geometry.boundingBox.min.x;
            var widthY = this.geometry.boundingBox.max.y - this.geometry.boundingBox.min.y;
            var widthZ = this.geometry.boundingBox.max.z - this.geometry.boundingBox.min.z;
            if(this.id == "4300") {
                console.log("widthX: " + widthX + " widthY: " + widthY + " widthZ: " + widthZ);
            }
            
            var cX = this.geometry.boundingBox.min.x + widthX/2;
            var cY = this.geometry.boundingBox.min.y + widthY/2;
            var cZ = this.geometry.boundingBox.min.z + widthZ/2;

            this.mesh.translateX(-cX);
            this.mesh.translateY(-cY);
            this.mesh.translateZ(-cZ);

            // scale
            var scaleX = 1 / widthX;
            var scaleY = 1 / widthY;
            var scaleZ = 1 / widthZ;
            var scale_0 = scaleX < scaleY ? scaleX : scaleY;
            var scale_1 = scale_0 < scaleZ ? scale_0 : scaleZ;
            if(this.id == "4300") {
                console.log("scale: " + scale_1);
            } 
            this.camera.position.z /= scale_1;
            
            this.scene.add(this.mesh);
            this.animate();
        }, 

        animate() {
            this.renderer.render( this.scene, this.camera ); //渲染界面 
            requestAnimationFrame(this.animate);
        },

        render() {
            this.control.update();
        },

        download() {
            console.log("download");
            let content = new Blob([this.contentData]);
            let urlObject = window.URL || window.webkitURL || window;	
            let url = urlObject.createObjectURL(content); 	
	  	    let el = document.createElement('a');
            el.href = url; 
            el.download ="model.off";
            document.body.appendChild(el);
            el.click();
            setTimeout(function(e){
                document.body.removeChild(el);
            },1000);
            urlObject.revokeObjectURL(url);
        },
        openDrawer() {
            this.drawer = true;
            setTimeout(() => this.showContent(), 300);
        },
        showContent(){ 
            this.drawerRenderer = new THREE.WebGLRenderer({antialias: true,alpha:true});
            //this.drawerRenderer = new THREE.WebGLRenderer();
            this.drawerRenderer.setSize(800, 500);
            this.drawerRenderer.domElement.style= "position: absolute; z-index: 2000; right: 25px; top: 100px;"
            document.body.appendChild(this.drawerRenderer.domElement);
            
            this.drawerScene = new THREE.Scene();

            this.drawerCamera = new THREE.PerspectiveCamera(45, 800 / 500, 0.0001, 20000); 
            this.drawerCamera.position.set(0, 0, 2);
            this.drawerScene.add(this.drawerCamera);

            var drawerLight = new THREE.DirectionalLight(0xffffff, 1);
            drawerLight.position.set(20, 40, 40);
            this.drawerScene.add(drawerLight);
            this.drawerScene.add(new THREE.AmbientLight(0x555555, 1.5));

            //init mesh
            var boxX = this.geometry.boundingBox.max.x - this.geometry.boundingBox.min.x;
            var boxY = this.geometry.boundingBox.max.y - this.geometry.boundingBox.min.y;
            var boxZ = this.geometry.boundingBox.max.z - this.geometry.boundingBox.min.z
            var cX = this.geometry.boundingBox.min.x + boxX/2;
            var cY = this.geometry.boundingBox.min.y + boxY/2;
            var cZ = this.geometry.boundingBox.min.z + boxZ/2;

            console.log("widthX: " + boxX + " widthY: " + boxY + " widthZ: " + boxZ);
            var newMesh = new THREE.Mesh( this.geometry, this.material );
            newMesh.translateX(-cX);
            newMesh.translateY(-cY);
            newMesh.translateZ(-cZ);

            // scale
            var scaleX = 1 / boxX;
            var scaleY = 1 / boxY;
            var scaleZ = 1 / boxZ;
            var scale_0 = scaleX < scaleY ? scaleX : scaleY;
            var scale_1 = scale_0 < scaleZ ? scale_0 : scaleZ; 
            this.drawerCamera.position.z /= scale_1;

            this.drawerScene.add(newMesh);

            //init control
            this.control.enabled = false;
            this.drawerControl = new THREE.OrbitControls(this.drawerCamera, this.drawerRenderer.domElement);
            this.drawerControl.enabled = true;
            this.drawerControl.target = new THREE.Vector3();         
            this.drawerControl.autoRotate = false;
            this.drawerControl.autoRotateSpeed = 0.5;

            this.drawerAnimate();
        },
        drawerAnimate() {
            this.drawerControl.update();
            this.drawerRenderer.render( this.drawerScene, this.drawerCamera );
            this.animateControl = requestAnimationFrame(this.drawerAnimate);
        },
        handleClose(done) {
            window.cancelAnimationFrame(this.animateControl);
            document.body.removeChild(this.drawerRenderer.domElement);
            this.drawerRenderer.forceContextLoss();
            this.drawerRenderer = null;
            //this.renderer.setSize(260, 180);
            this.drawerControl.enabled = false; 
            this.control.enabled = true;
            done();
        },
        rotateControl(e) {
            let target = e.target;
            if(target.nodeName == "SPAN" || target.nodeName == "I"){
                target = e.target.parentNode.parentNode;
            }
            target.blur();
            if (this.drawerControl.autoRotate) {
                this.drawerControl.autoRotate = false;
            } else {
                this.drawerControl.autoRotate = true;
                this.drawerControl.autoRotateSpeed = 3.0;
            }
        },
        drawerDownload(e) {
            let target = e.target;
            if(target.nodeName == "SPAN"){
                target = e.target.parentNode;
            }
            if(target.nodeName == "I") {
                target = e.target.parentNode.parentNode;
            }
            target.blur();
            let content = new Blob([this.contentData]);
            let urlObject = window.URL || window.webkitURL || window;	
            let url = urlObject.createObjectURL(content); 	
	  	    let el = document.createElement('a');
            el.href = url; 
            el.download ="model.off";
            document.body.appendChild(el);
            el.click();
            setTimeout(function(e){
                document.body.removeChild(el);
            },1000);
            urlObject.revokeObjectURL(url);
        },
    }
}
</script>

<style lang="less" scoped>
#displaybox {
    width: 270px;
}
.el-card {
    width: 270px;
    margin: 15px 13px 0 0;
}
/*
.display-button ^=[classel-icon-]{
    font-size: 16px;
}*/
.display-button .el-link {
    font-size: 13px;
    margin-left: 10px;
}

.display-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 10px;
    margin-left: 10px;
    height: 35px;
}

.display-label {
    user-select: none;
}

.drawer-content {
    display:flex;
    margin: 550px 50px 0 50px;
    align-items: center;
    justify-content: space-between;
}

.drawer-content .el-button {
    margin-right: 20px;
}
</style>

<style lang="less">
.drawer-content .el-tag {
    font-size: 15px;
}
</style>