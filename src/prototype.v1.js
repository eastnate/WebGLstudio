import * as THREE from 'three';

import * as dat from 'dat.gui';

import * as OrbitControls from 'three-orbitcontrols'
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'
import *  as RGBELoader from 'three/examples/js/loaders/RGBELoader.js'
import * as HDRCubeTextureLoader from 'three/examples/js/loaders/HDRCubeTextureLoader.js'

import EquirectangularToCubeGenerator from 'three/examples/js/loaders/EquirectangularToCubeGenerator.js'

import * as PMREMGenerator from 'three/examples/js/pmrem/PMREMGenerator.js'
import * as PMREMCubeUVPacker from 'three/examples/js/pmrem/PMREMCubeUVPacker.js'

const scene = new THREE.Scene()
let camera = new THREE.PerspectiveCamera(53, window.innerWidth / window.innerHeight, 1, 10000)

const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.LinearToneMapping;

const controls = new OrbitControls(camera, renderer.domElement)
const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();
const objLoader2 = new OBJLoader();
const mtlLoader2 = new MTLLoader();

let angle1= 0;
let angle2= 0;
let bulbLight = null;
let hemispherelight = null
var pngCubeRenderTarget, exrCubeRenderTarget;
var pngBackground, exrBackground;
let cubeMapTexture = null

let camera_params = {
  camera_x: -500,
  camera_y: 150,
  camera_z: -200,
};

let dom_light = {
  dom_intensity: 0.38
};

let bubl_light = {
  emissiveIntensity: 1.2,
  decay: 1,
};


// let cube = null;
// const createCube = function () {
//     let geometry = new THREE.BoxGeometry(1200, 1, 1200);
//     let material = new THREE.MeshBasicMaterial({ color: 0xffffff });
//     cube = new THREE.Mesh(geometry, material);
//     cube.position.set(0,-100,0)
//     cube.traverse(function(child) {
//       if (child instanceof THREE.Mesh) {
//         child.receiveShadow = true;
//         child.castShadow = true;
//       }
//     });
//     scene.add(cube);
// }



const init = function () {

    // scene.background = new THREE.Color(0x000000);
    camera.position.set(-500, 150, -200); // Set position like this
    camera.lookAt(new THREE.Vector3(0,0,0)); // Set look at coordinate like this



    
    new THREE.RGBELoader().load('./resource/textures/HDR/Etnies_Park_Center_3k.hdr', function (texture, textureData) {
        texture
        texture.encoding = THREE.RGBEEncoding;
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.flipY = true;
        console.log(textureData.width)
        console.log(textureData.height)
        textureData.width = 2000
        console.log(textureData.width)
        var cubemapGenerator = new THREE.EquirectangularToCubeGenerator(texture, { resolution: 3200, type: THREE.UnsignedByteType });
        exrBackground = cubemapGenerator.renderTarget;
        cubeMapTexture = cubemapGenerator.update(renderer);

        var pmremGenerator = new THREE.PMREMGenerator(cubeMapTexture);
        pmremGenerator.update(renderer);

        var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker(pmremGenerator.cubeLods);
        pmremCubeUVPacker.update(renderer);

        exrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;

        texture.dispose();
        pmremGenerator.dispose();
        pmremCubeUVPacker.dispose();

        

    });


   

    // for object MTL import
    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath('/resource');
    mtlLoader.setPath('/resource');

    mtlLoader.load('/spo.mtl', function (materials) {

        materials.preload();
        const objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('/resource');
        objLoader.load('/spo.obj', function (object) {

            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {

                    child.receiveShadow = true;
                    child.castShadow = true;
                    //console.log(child.name);
                  }
                if (child.name === 'Object001') {
                    console.log('This is Material:', child.material)
                    child.material.envMap = cubeMapTexture;
                    child.material.specular.setHex(0xff0000)
                    child.material.envMapIntensity = 1
                    child.material.reflectivity= 0.38
                    child.material.shininess = 30;
                    //child.material.color.setHex(0xfff000);
                    child.material.needsUpdate = true;
                }

                if (child.name === 'OUT650') {
                    //child.material.color.setHex(0x00008f);
                }

            });

            object.position.y = -100
            scene.add(object);
        })
    })

    hemispherelight = new THREE.HemisphereLight(0xdee2e8, 0x353021, 0.38);
    scene.add(hemispherelight);

    //b67e5b : sunrise
    //c0bfad : at noon
    //bdbec0 : mist and cloud
    //0b46a5 :
    //dee2e8 :



    bulbLight = new THREE.SpotLight( 0xc0bfad, 1 , 1000, 10);
      bulbLight.position.set( 0, 400, 0 );
      bulbLight.decay = 1;
      bulbLight.castShadow = true;
      bulbLight.shadow.camera.far = 200;
      scene.add( bulbLight );



    var gui = new dat.GUI();
    let camera_option = gui.addFolder('Camera');
    camera_option.add( camera_params, 'camera_x', -1000, 1000, 1);
    camera_option.add( camera_params, 'camera_y', 50, 700, 1);
    camera_option.add( camera_params, 'camera_z', -600, 600, 1);
    camera_option.open();

    var dom_option = gui.addFolder('Dom');
    dom_option.add(dom_light, 'dom_intensity', 0, 1, 0.01);
    dom_option.open();

    var bubl_light_option = gui.addFolder('Bubl_light');
    bubl_light_option.add(bubl_light, 'emissiveIntensity', 0, 3, 0.1);
    bubl_light_option.add(bubl_light, 'decay', 0, 4, 0.1);
    bubl_light_option.open();

    gui.open();


    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}


const mainLoop = function () {
  angle1-=0.005;
  angle2+=0.003
  scene.background = exrBackground;


  bulbLight.position.x = 800*Math.sin(angle1);
  bulbLight.position.z = 800*Math.cos(angle1);


  camera.position.x = camera_params.camera_x
  camera.position.y = camera_params.camera_y
  camera.position.z = camera_params.camera_z
  camera.lookAt(new THREE.Vector3(0,0,0));


  hemispherelight.intensity = dom_light.dom_intensity


  bulbLight.decay = bubl_light.decay;
  bulbLight.emissiveIntensity = bubl_light.emissiveIntensity;



  window.addEventListener( 'resize', onWindowResize, false );
  renderer.render(scene, camera);
  requestAnimationFrame(mainLoop);
}

function onWindowResize() {

    var width = window.innerWidth;
    var height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );

}

init()
mainLoop()