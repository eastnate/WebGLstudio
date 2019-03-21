import * as THREE from 'three';

import * as dat from 'dat.gui';

import * as OrbitControls from 'three-orbitcontrols'
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'

// BY JINWOO
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

// for background BY JINWOO
var pngCubeRenderTarget, exrCubeRenderTarget;
var pngBackground, exrBackground;
let cubeMapTexture = null


let angle1= 0;
let angle2= 0;
let bulbLight = null;
let hemispherelight = null;

let is_camera_round = false;
let camera_index = 0;
let c_nodes = null;

let camera_nodes = null;

let camera_params = {
  camera_x: -500,
  camera_y: 150,
  camera_z: -200,
};

let dom_light = {
  dom_intensity: 0.38,
};

let bubl_light = {
  emissiveIntensity: 1.2,
  decay: 1,
};

let color_change = {
  diffuse: '#ff0000'
};

let camera_angle = {
  x:0,
  y:0,
  z:0,
};

let c_node = {
  node_num:0,
};

let tire_rotation = {
  y_rotation:0,
};

let car_speculer = {
  c_speculer:'#ffffff',
};

let car_paint = {
  c_paint:'#ff0000',
}
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

const createCube = function (x, y, z, node, i) {
  let geometry = new THREE.BoxGeometry(8, 8, 8);
  let material = new THREE.MeshBasicMaterial({ color: 0xddeeff });
  let cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, z)
  cube.traverse(function(child) {
    if (child instanceof THREE.Mesh) {
      child.receiveShadow = true;
      child.castShadow = true;
    }
  });

  cube.name = i
  node = cube;
  scene.add(node);
};

const removeCube = function(){
  for(let i=0; i<108; i++){
    if(scene.getObjectByName(i) != null){
      scene.remove( scene.getObjectByName(i) );
    }
  }
}

const init = function () {

  scene.background = new THREE.Color(0x000000);
  camera.position.set(-500, 150, -200); // Set position like this
  camera.lookAt(new THREE.Vector3(0,0,0)); // Set look at coordinate like this


 // BY JINWOO
  new THREE.RGBELoader().load('./resource/textures/HDR/Etnies_Park_Center_3k.hdr', function (texture, textureData) {
        texture
        texture.encoding = THREE.RGBEEncoding;
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.flipY = true;
        // console.log(textureData.width)
        // console.log(textureData.height)
        textureData.width = 2000
        // console.log(textureData.width)
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

  var axesHelper = new THREE.AxesHelper( 1200 );
  scene.add( axesHelper );

  const createtire = function () {
    let geometry = new THREE.BoxGeometry(16,16,16);
    let material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    let tire = new THREE.Mesh(geometry, material);
    tire.position.set(200,100,200)
    tire.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });
    tire.name = 'test_tire';
    scene.add(tire);
  };
  createtire()

  mtlLoader.load('/resource/spo.mtl', function (materials) {

    let room = null;
    objLoader.setMaterials(materials);

    objLoader.load('/resource/spo.obj', function (room) {
      room.traverse(function(child) {

        if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            child.castShadow = true
          }

        if(child.name == 'OUT650'){
          //child.position.set(200,100,200)
          console.log(child.getWorldPosition())
        }

        if (child.name === 'Object001') {
            child.material.envMap = cubeMapTexture;
            //child.material.specular.setHex(0xffffff)
            child.material.envMapIntensity = 1
            child.material.reflectivity= 0.38
            child.material.shininess = 30;
            //child.material.color.setHex(0xfff000);
            child.material.needsUpdate = true;
        }


      });
      scene.add(room);
    })
  })

  var material = new THREE.MeshPhongMaterial( { color: 0xffffee, dithering: true } );
  var geometry = new THREE.BoxBufferGeometry( 1200, 1, 1200 );

  var mesh = new THREE.Mesh( geometry, material );
  mesh.position.set( 0, -100, 0 );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add( mesh );


  hemispherelight = new THREE.HemisphereLight(0xdee2e8, 0x353021, 0.38);
  scene.add(hemispherelight);

  //b67e5b : sunrise
  //c0bfad : at noon
  //bdbec0 : mist and cloud
  //0b46a5 :
  //dee2e8 :
  // var bulbGeometry = new THREE.SphereGeometry(10, 32, 32);
  // bulbLight = new THREE.SpotLight(0xc0bfad, 1, 1000, 10);
  // var bulbMat = new THREE.MeshStandardMaterial({
  //   emissive: 0xffffee,
  //   emissiveIntensity: 1.2,
  //   color: 0xffffee,
  //   roughness: 5,
  // });
  // bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
  // bulbLight.position.set(0, 400, 0);
  // bulbLight.decay = 1;
  // bulbLight.receiveShadow = true;
  // bulbLight.castShadow = true;
  // bulbLight.shadow.mapSize.width = 1024;
   // bulbLight.shadow.mapSize.height = 1024;
  // bulbLight.shadow.camera.near = 1;
  // bulbLight.shadow.camera.far = 1200;
  // scene.add(bulbLight);


  bulbLight = new THREE.SpotLight( 0xc0bfad, 1 , 1000, 10);
   bulbLight.position.set( 0, 400, 0 );
   bulbLight.decay = 1;
   bulbLight.castShadow = true;
   bulbLight.shadow.camera.far = 1200;
   scene.add( bulbLight );



  let gui = new dat.GUI();
  let camera_option = gui.addFolder('Camera');
  camera_option.add( camera_params, 'camera_x', -1000, 1000, 1);
  camera_option.add( camera_params, 'camera_y', 50, 700, 1);
  camera_option.add( camera_params, 'camera_z', -600, 600, 1);
  //camera_option.open();

  let dom_option = gui.addFolder('Dom');
  dom_option.add(dom_light, 'dom_intensity', 0, 1, 0.01);
  dom_option.open();

  let bubl_light_option = gui.addFolder('Bubl_light');
  bubl_light_option.add(bubl_light, 'emissiveIntensity', 0, 3, 0.1);
  bubl_light_option.add(bubl_light, 'decay', 0, 4, 0.1);
  bubl_light_option.open();


  let camera_move = gui.addFolder('camera_move');
  camera_move.add(camera_angle, 'x').name('angle_x');
  camera_move.add(camera_angle, 'y').name('angle_y');
  camera_move.add(camera_angle, 'z').name('angle_z');
  //camera_move.open();


  let light_change = gui.addFolder('light_change');
  let light_Color = light_change.addColor( color_change, 'diffuse' ).name('Color (Diffuse)').listen();
  light_Color.onChange(function(value){
    bulbLight.color.setHex( value.replace("#", "0x") );
  });
  light_change.open();

  let car_color = gui.addFolder('car_color');
  let speculer_color = car_color.addColor( car_speculer, 'c_speculer').name('Color (speculer)').listen();
  speculer_color.onChange(function(value){
    let tt = scene.getObjectByName('Object001');
    tt.material.specular.setHex(value.replace("#", "0x"));
  });
  let paint_color = car_color.addColor(car_paint, 'c_paint').name('Color (paint)').listen();
  paint_color.onChange(function(value){
    let tt = scene.getObjectByName('Object001');
    tt.material.color.setHex(value.replace("#", "0x"));
  });
  car_color.open();

  // let fun = {
  //   add:function(){
  //     is_camera_round = true;
  //   }
  // };
  let node_amount = gui.addFolder('node_amount');
  //node_amount.add(fun, 'add').name('camera_round');
  let n_i = node_amount.add(c_node, 'node_num', 36, 108, 36).name('node_amount');
  let cn = {
    add:function(){
      c_nodes = new Array(c_node.node_num);
      camera_nodes = new Array(c_node.node_num);
      removeCube();
      for(var i=0; i < c_node.node_num; i++){
        // c_nodes[i] = [
        //   400*Math.sin(angle2),
        //   camera.position.y,
        //   400*Math.cos(angle2),
        // ]
        // angle2 += 2*Math.PI/c_node.node_num;
        // createCube(400*Math.sin(angle2), camera.position.y, 400*Math.cos(angle2), camera_nodes[i], i);
        c_nodes[i] = [
          Math.sqrt(camera.position.x*camera.position.x + camera.position.z*camera.position.z)*Math.sin(angle2),
          camera.position.y,
          Math.sqrt(camera.position.x*camera.position.x + camera.position.z*camera.position.z)*Math.cos(angle2),
        ]
        angle2 += 2*Math.PI/c_node.node_num;
        createCube(
          Math.sqrt(camera.position.x*camera.position.x + camera.position.z*camera.position.z)*Math.sin(angle2),
          camera.position.y,
          Math.sqrt(camera.position.x*camera.position.x + camera.position.z*camera.position.z)*Math.cos(angle2),
          camera_nodes[i], i);
      }
      is_camera_round = true;
    }
  };
  node_amount.add(cn, 'add').name('Circle');

  let cn_2 = {
    add:function(){
      c_nodes = new Array(c_node.node_num);
      camera_nodes = new Array(c_node.node_num);
      removeCube();
      for(var i=0; i < c_node.node_num; i++){
        c_nodes[i] = [
          400*Math.sin(angle2),
          camera.position.y,
          600*Math.cos(angle2),
        ]
        angle2 += 2*Math.PI/c_node.node_num;
        createCube(400*Math.sin(angle2), camera.position.y, 600*Math.cos(angle2), camera_nodes[i], i)
      }
      is_camera_round = true;
    }
  };
  node_amount.add(cn_2, 'add').name('Ellipse');
  node_amount.open();


  let tire_y_rotate = gui.addFolder('tire_rotate');
  tire_y_rotate.add(tire_rotation, 'y_rotation', -45, 45, 1).name('rotation');
  tire_y_rotate.open();

  gui.open();


  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}


const mainLoop = function () {
  // camera.position.x = camera_params.camera_x;
  // camera.position.y = camera_params.camera_y;
  // camera.position.z = camera_params.camera_z;

  scene.background = exrBackground;
  angle1-=0.005;
  bulbLight.position.x = 800*Math.sin(angle1);
  bulbLight.position.z = 800*Math.cos(angle1);


  if ((is_camera_round == true) && (camera_index < c_node.node_num)){
    // camera_params.camera_x = c_nodes[camera_index][0];
    // camera_params.camera_y = c_nodes[camera_index][1];
    // camera_params.camera_z = c_nodes[camera_index][2];
    camera.position.x = c_nodes[camera_index][0];
    camera.position.y = c_nodes[camera_index][1];
    camera.position.z = c_nodes[camera_index][2];
    camera_index += 1;
  }
  else{
    camera_index = 0;
    is_camera_round = false;
  }

  let tire1 = scene.getObjectByName('pCylinder23');
  let tire2 = scene.getObjectByName('OUT650');
  //tire1.rotateY(tire_rotation.y_rotation);
  //console.log(tire1);
  if(tire1 != undefined){
    //tire1.lookAt(tire1.position.x, tire1.position.y, tire1.position.z)
    tire1.position.x = -150;
    tire1.position.z = -150;
    //tire1.rotation.y = tire_rotation.y_rotation;
    //tire1.rotateOnAxis(new THREE.Vector3( -150, 0, -150 ), tire_rotation.y_rotation)
  }
  if(tire2 != undefined){
    tire2.rotation.y = tire_rotation.y_rotation;
    //tire2.rotateOnAxis(new THREE.Vector3( -150, 0, -150 ), tire_rotation.y_rotation)
  }
  let tire3 = scene.getObjectByName('test_tire');
  if(tire3 != undefined){
    tire3.rotation.y = tire_rotation.y_rotation;
    //tire3.rotateOnAxis(new THREE.Vector3( 0, 0, 0 ), tire_rotation.y_rotation)
  }



  hemispherelight.intensity = dom_light.dom_intensity;


  bulbLight.decay = bubl_light.decay;
  bulbLight.emissiveIntensity = bubl_light.emissiveIntensity;


  camera.lookAt(
    new THREE.Vector3(
        camera_angle.x, camera_angle.y, camera_angle.z
      )
  );
  window.addEventListener( 'resize', onWindowResize, false );
  renderer.render(scene, camera);
  requestAnimationFrame(mainLoop);
  renderer.toneMappingExposure = 1.6;
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