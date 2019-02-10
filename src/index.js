import * as THREE from 'three';
import * as dat from 'dat.gui';
import * as OrbitControls from 'three-orbitcontrols';
import OBJLoader from 'three-obj-loader';

let scene, camera, renderer, cube, controls;
let ADD = 0.01;


let createCube = function () {
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshBasicMaterial({ color: 0x00a1cb });
    cube = new THREE.Mesh(geometry, material)
    scene.add(cube);
}

const params = {
    importObj(){
        console.log('import obj')
    },
    setMtl() {
        console.log('set mtl')
    }  ,
    exportObj(){
        console.log('export obj')
    },
}

let init = function () {
    // create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffee);

    // create an locate the camera
    camera = new THREE.PerspectiveCamera(75,
        window.innerWidth / window.innerHeight,
        1, 1000);
    camera.position.z = 5;
   
    createCube();

    // create the renderer   
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new OrbitControls( camera, renderer.domElement);
    document.body.appendChild(renderer.domElement);
    
    // renderer.render(scene, camera);
    
    const gui = new dat.GUI();
    gui.add(params, 'importObj')
    gui.add(params, 'setMtl')
    gui.add(params, 'exportObj')

    OBJLoader(THREE);
    const loader = new THREE.OBJLoader()
    console.log(loader.load)
    loader.load(
        // resource URL
        'resource/test.obj',
        // called when resource is loaded
        function ( object ) {
            scene.add( object )
        },
        // called when loading is in progresses
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )    
        },
        // called when loading has errors
        function ( error ) {
            console.log( 'An error happened' );
    
        }
    );
  
    
};


let mainLoop = function () {
    cube.position.x += ADD;
    cube.rotation.z -= ADD;

    if (cube.position.x <= -3 || cube.position.x >= 3)
        ADD *= -1;

    renderer.render(scene, camera);
    requestAnimationFrame(mainLoop);
};

init()
mainLoop()