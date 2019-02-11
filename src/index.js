import * as THREE from 'three';
import * as dat from 'dat.gui';
import * as OrbitControls from 'three-orbitcontrols'
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
const loader = new THREE.OBJLoader()


let cube
let ADD = 0.01
let color = new THREE.Color(0xFF0000)


const createCube = function () {
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshBasicMaterial({ color: 0x00a1cb });
    cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
}

var mtlLoader = new THREE.MTLLoader();
// mtlLoader.setTexturePath('/examples/3d-obj-loader/assets/');
// mtlLoader.setPath('/examples/3d-obj-loader/assets/');


const BtnParams = {
    importObj() {
        mtlLoader.load('resource/j_test.mtl', function (materials) {

            materials.preload();

            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            // objLoader.setPath('/examples/3d-obj-loader/assets/');
            objLoader.load('resource/j_test.obj', function (object) {

                scene.add(object);
                object.position.y -= 60;

            });

        });
        // loader.load(
        //     'resource/j_test.obj',
        //     (object) => {
        //         object.traverse(function (child) {
        //             if (child instanceof THREE.Mesh) {
        //                 child.material.ambient = color
        //                 child.material.color = color
        //             }
        //         })
        //         object.position.y = 0;
        //         scene.add(object);
        //     },
        //     // called when loading is in progresses
        //     (xhr) => {
        //     },
        //     // called when loading has errors
        //     (error) => {
        //     }
        // )
    },
    setMtl() {},
    exportObj() {},
}

const init = function () {

    scene.background = new THREE.Color(0xffffee);

    camera.position.z = 5;

    createCube();

    var geometry = new THREE.SphereBufferGeometry(500, 60, 40);
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale(- 1, 1, 1);
    var material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('resource/background/test.jpg')
    });
    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // create the renderer   
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    // light
    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( light );
    renderer.render(scene, camera);

    const gui = new dat.GUI();
    gui.add(BtnParams, 'importObj')
    gui.add(BtnParams, 'setMtl')
    gui.add(BtnParams, 'exportObj')

}


const mainLoop = function () {
    cube.position.x += ADD;
    cube.rotation.z -= ADD;

    if (cube.position.x <= -3 || cube.position.x >= 3)
        ADD *= -1;
    
    
    renderer.render(scene, camera);
    requestAnimationFrame(mainLoop);
}

init()
mainLoop()



// ----------------------------------------
// const scene = new THREE.Scene()
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
// const renderer = new THREE.WebGLRenderer();
// const controls = new OrbitControls(camera, renderer.domElement);

// init();
// animate();
// function init() {

//     var geometry = new THREE.SphereBufferGeometry(500, 60, 40);
//     // invert the geometry on the x-axis so that all of the faces point inward
//     geometry.scale(- 1, 1, 1);
//     var material = new THREE.MeshBasicMaterial({
//         map: new THREE.TextureLoader().load('resource/background/test.jpg')
//     });
//     let mesh = new THREE.Mesh(geometry, material);
//     scene.add(mesh);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);

//     document.body.appendChild(renderer.domElement);
  
// }

// function animate() {
//     requestAnimationFrame(animate)
//     renderer.render(scene, camera)
// }
