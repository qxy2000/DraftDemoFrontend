<template>
    <el-card class="box-card" :body-style="{ padding: '0px' }">
        <div :id="id">
        </div>
        <div class="display-button">
             <el-link :underline="false"><i class="el-icon-download"></i>下载</el-link>
             <el-link :underline="false" @click="openDialog"><i class="el-icon-full-screen"></i>查看详情</el-link>
        </div>
    </el-card>
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
        }
    },
    props: [
        'id',
    ],
    mounted() {
         this.init();
         this.animate();
    },
    methods: {
        init() {
            //init Renderer
            var box = document.getElementById(this.id);  
            this.renderer = new THREE.WebGLRenderer({antialias: true,alpha:true});
            //this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(260, 180); 
            box.appendChild(this.renderer.domElement);

            //init scene
            this.scene = new THREE.Scene();

            //init camera
            this.camera = new THREE.PerspectiveCamera(45, 260 / 180, 0.1, 200); 
            this.camera.position.set(0, 0, 3);
            this.scene.add(this.camera);
        
            //init light
            var light = new THREE.DirectionalLight(0xffffff);
            light.position.set(20, 50, 50);
            this.scene.add(light);
            this.scene.add(new THREE.AmbientLight(0x222222));

            //init mesh
            this.geometry = new THREE.BoxGeometry( 1, 1, 1 );         
            this.material = new THREE.MeshLambertMaterial({color:0x999999});       
            this.mesh = new THREE.Mesh( this.geometry, this.material );        
            this.scene.add( this.mesh );

            //init control
            this.control = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.control.enabled = true;
            this.control.target = new THREE.Vector3();         
            this.control.autoRotate = false;
            this.control.enablePan = false;
            this.control.rotateSpeed = 0.2;
        },
        render() {
            this.control.update();
        },
        animate() {       
            this.render();
            this.mesh.rotation.x += 0.005; //每帧网格模型的沿x轴旋转0.01弧度        
            this.mesh.rotation.y += 0.005; //每帧网格模型的沿y轴旋转0.02弧度    
            this.renderer.render( this.scene, this.camera ); //渲染界面 
            requestAnimationFrame(this.animate)
        },
        openDialog() {
            console.log("openDialog");
        },
    }
}
</script>

<style lang="less" scoped>
#displaybox {
    width: 260px;
}
.el-card {
    width: 260px;
    margin-top: 20px;
}

/*
.display-button [class^=el-icon-]{
    font-size: 16px;
}*/
.display-button .el-link {
    font-size: 13px;
    margin-left: 10px;
}

.display-button {
    margin: 0 0 10px 100px;
}
</style>