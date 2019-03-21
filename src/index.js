// import * as THREE from 'three';
// import * as dat from 'dat.gui';
// import * as OrbitControls from 'three-orbitcontrols'
// import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'


// import color_table from '../dist/resource/logic_json/color_table.json'
// import test_trim from '../dist/resource/logic_json/test_trim.json'
// import test_car from '../dist/resource/logic_json/test_car.json'


// const SUNu = 0.148000
// const SUNv = 0.260000


// const scene = new THREE.Scene()
// let camera = new THREE.PerspectiveCamera(53, window.innerWidth / window.innerHeight, 1, 10000)

// const renderer = new THREE.WebGLRenderer()
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.toneMapping = THREE.LinearToneMapping;

// const controls = new OrbitControls(camera, renderer.domElement)
// const objLoader = new OBJLoader();
// const mtlLoader = new MTLLoader();

// let angle1= 0;
// let bulbLight = null;
// let hemispherelight = null;

// let dom_light = {
//   dom_intensity: 0.38,
// };

// let bubl_light = {
//   emissiveIntensity: 1.2,
//   decay: 1,
// };



// const init = function () {
//   const theta = (SUNu + 0.5)*Math.PI*2;
//   const phi = SUNv*Math.PI;

//   const sun_z = Math.cos(phi);
//   const sun_x = Math.sin(theta) * Math.sin(phi) * -1;
//   const sun_y = Math.cos(theta) * Math.sin(phi) * -1;

//   console.log(sun_x,sun_z,sun_y)

//   scene.background = new THREE.Color(0xdddddd);
//   camera.position.set(10, 20, -10); // Set position like this
//   camera.lookAt(new THREE.Vector3(0,0,0)); // Set look at coordinate like this

//   var axesHelper = new THREE.AxesHelper( 1200 );
//   scene.add( axesHelper );

//   hemispherelight = new THREE.HemisphereLight(0xdee2e8, 0x353021, 0.38);
//   scene.add(hemispherelight);

//   bulbLight = new THREE.SpotLight( 0xc0bfad, 1 , 1000, 10);
//    bulbLight.position.set( 0, 20, 0 );
//    bulbLight.decay = 1;
//    bulbLight.castShadow = true;
//    bulbLight.shadow.camera.far = 200;
//    scene.add( bulbLight );

//   let mtl_list = new Array()

//   mtlLoader.load('/resource/testcar_0319.mtl', function (materials) {
//     materials.preload()
//     for(let mn in materials.materials){
//       //console.log(materials.materials[mn])
//       mtl_list.push(materials.materials[mn])
//     }
//   })


//   let trimchange = new dat.GUI();
//   let trim_amount = trimchange.addFolder('trim_amount');
//   const trims = Object.keys(test_trim)

//   let cn = {
//     add:function(trim){

//       for( let i = scene.children.length - 1; i >= 0; i--) {
//         if(scene.children[i].type == 'Mesh'){
//           scene.remove(scene.children[i])
//         }
//       }


//       objLoader.load('/resource/testcar_0319.obj', function (car) {
//         let trim_objects = new Array()
//         car.traverse(function(child) {

//           if (child instanceof THREE.Mesh) {
//               child.receiveShadow = true
//               child.castShadow = true
//             }

//           let obj_name = child.name.split("_")
//           obj_name.splice(-1,1)
//           obj_name = obj_name.join("_")

//           for(let i=0; i<trim.length; i++){
//              if(obj_name == trim[i]){
//                trim_objects.push(child)
//              }
//            }
//         });

//         for(let i=trim_objects.length-1; i>=0; i--){
//           scene.add(trim_objects[i])
//         }
//       })

//     }
//   };
//   for(let i=0; i<trims.length; i++){
//     trim_amount.add({add : cn.add.bind(this, Object.keys(test_trim[trims[i]]))}, "add").name(trims[i])
//   }


//   let colorchange = new dat.GUI()
//   let color_amount = colorchange.addFolder('color_amount')
//   const extint = Object.keys(color_table["test_car"])

//   let ccn = {
//     add:function(color){
//       //color is material name, in mtl_list
//       let color_obj_set = []

//       for(let i=0; i<color.length; i++){
//         for(let j=0; j<mtl_list.length; j++){
//           if(color[i]==mtl_list[j].name){
//             //console.log(mtl_list[j])
//             //console.log(mtl_list[j].name.split('_')[0])
//             //console.log(test_car[mtl_list[j].name.split('_')[0]])
//             color_obj_set.push({key:mtl_list[j], value:test_car[mtl_list[j].name.split('_')[0]]})
//           }
//         }
//       }
//       console.log(color_obj_set)
//       // for( let i = scene.children.length - 1; i >= 0; i--) {
//       //   if(scene.children[i].type == 'Mesh'){
//       //     scene.remove(scene.children[i])
//       //   }
//       // }
//       for(let i=0; i<color_obj_set.length; i++){
//         //console.log(color_obj_set[i].key)
//         for(let j=0; j<color_obj_set[i].value.length; j++){
//           //console.log(color_obj_set[i].value[j])
//           for(let k=scene.children.length-1; k>=0; k--){
//             if(scene.children[k].name == color_obj_set[i].value[j]){
//               scene.children[k].material = color_obj_set[i].key
//             }
//           }
//         }
//       }
//     }
//   }
//   for(let i=0; i<extint.length; i++){
//     let colors = Object.keys(color_table["test_car"][extint[i]])

//     for(let j=0; j<colors.length; j++){
//       color_amount.add({add : ccn.add.bind(this, color_table["test_car"][extint[i]][colors[j]])}, "add").name(colors[j])
//     }
//   }

//   renderer.setSize(window.innerWidth, window.innerHeight);
//   document.body.appendChild(renderer.domElement);
// }


// const mainLoop = function () {

//   angle1-=0.005;
//   bulbLight.position.x = 10*Math.sin(angle1);
//   bulbLight.position.z = 10*Math.cos(angle1);


//   window.addEventListener( 'resize', onWindowResize, false );
//   renderer.render(scene, camera);
//   requestAnimationFrame(mainLoop);
// }


// function onWindowResize() {

//     var width = window.innerWidth;
//     var height = window.innerHeight;

//     camera.aspect = width / height;
//     camera.updateProjectionMatrix();

//     renderer.setSize( width, height );

// }



// init()
// mainLoop()


import * as THREE from 'three';

import * as dat from 'dat.gui';

import * as OrbitControls from 'three-orbitcontrols'
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'

import *  as RGBELoader from 'three/examples/js/loaders/RGBELoader.js'
import * as HDRCubeTextureLoader from 'three/examples/js/loaders/HDRCubeTextureLoader.js'
import EquirectangularToCubeGenerator from 'three/examples/js/loaders/EquirectangularToCubeGenerator.js'


const SUNu = 0.148000
const SUNv = 0.260000


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(53, window.innerWidth / window.innerHeight, 1, 10000)
const renderer = new THREE.WebGLRenderer()

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.LinearToneMapping
renderer.toneMappingExposure = 1.0

const orbitControls = new OrbitControls(camera, renderer.domElement)
const objLoader = new OBJLoader()
const mtlLoader = new MTLLoader()

let exrBackground = null;
let cubeMapTexture = null
let angle1= 0;
let angle2= 0;
let spotLight = null;
let hemispherelight = null;
let is_camera_round = false;
let camera_index = 0;
let c_nodes = null;
let camera_nodes = null;


// For Menu Parameters
const CameraParams = {

  camera_x: -500,
  camera_y: 150,
  camera_z: -200,
}

const DomLightParams = {

  dom_intensity: 0.38,
}

const SpotLightParams = {

  emissiveIntensity: 1.2,
  decay: 1,
}

const ColorChangeParams = {

  diffuse: '#ff0000'
}

const CameraAngleParams = {

  x:0,
  y:0,
  z:0,
}

const CarSpeculerParams = {

  c_speculer:'#ffffff',
}

const CarPaintParams = {

  c_paint:'#ff0000',
}

const TireParams = {

    y_rotation:0,
}

const c_node = {

    node_num:0,
}


const createCameraCube = function (x, y, z, node, i) {

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


const removeCameraCube = function(){

  for(let i=0; i<108; i++){
    if(scene.getObjectByName(i) != null){
      scene.remove( scene.getObjectByName(i) );
    }
  }
}

const addTire = function () {
    let geometry = new THREE.BoxGeometry(16,16,16);
    let material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    let tire = new THREE.Mesh(geometry, material);
    tire.position.set(200,100,200)
    tire.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            child.castShadow = true;
        }
    })
    tire.name = 'test_tire';
    scene.add(tire);
}

const loadHDR = () => {
        //new THREE.RGBELoader().load('./resource/textures/HDR/Etnies_Park_Center_3k.hdr', (texture, textureData)=> {
        new THREE.RGBELoader().load('./resource/background/BasketballCourt_3k.hdr', (texture, textureData)=> {
        texture.encoding = THREE.RGBEEncoding;
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.flipY = true;

        const cubemap = new THREE.EquirectangularToCubeGenerator(texture, { resolution: 3200, type: THREE.UnsignedByteType });
        //const cubemap = new THREE.EquirectangularToCubeGenerator(texture, { resolution: 800, type: THREE.UnsignedByteType });
        exrBackground = cubemap.renderTarget;
        cubeMapTexture = cubemap.update(renderer);
        texture.dispose();
    })
}

const loadOBJ = () => {
    mtlLoader.load('/resource/spo.mtl', function (materials) {

        let room = null;
        objLoader.setMaterials(materials)
        objLoader.load('/resource/spo.obj', function (room) {

            room.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.receiveShadow = true
                    child.castShadow = true
                }

                if (child.name === 'Object001') {

                    child.material.envMap = cubeMapTexture;
                    child.material.envMapIntensity = 1
                    child.material.reflectivity= 0.38
                    child.material.shininess = 30;
                    child.material.needsUpdate = true;
                }
            })

            scene.add(room);
        })
    })
}

const addFloor = () => {

    const material = new THREE.MeshPhongMaterial({color: 0xffffee, dithering: true });
    const geometry = new THREE.BoxBufferGeometry(1200, 1, 1200)
    const floorMesh = new THREE.Mesh(geometry, material)
    floorMesh.position.set(0, -100, 0)
    floorMesh.castShadow = true
    floorMesh.receiveShadow = true
    scene.add(floorMesh)
}

const setLights = () => {

    hemispherelight = new THREE.HemisphereLight(0xdee2e8, 0x353021, 0.38)
    // scene.add(hemispherelight)

    spotLight = new THREE.SpotLight( 0xc0bfad, 1 , 1000, 10)
    spotLight.position.set( 0, 400, 0 )
    spotLight.decay = 1
    spotLight.castShadow = true
    spotLight.shadow.camera.far = 1200
    scene.add( spotLight )

    const theta = (SUNu + 0.5)*Math.PI*2;
    const phi = SUNv*Math.PI;

    const sun_z = Math.cos(phi);
    const sun_x = Math.sin(theta) * Math.sin(phi) * -1;
    const sun_y = Math.cos(theta) * Math.sin(phi) * -1;

    let directionalLight = new THREE.DirectionalLight( 0xfdfffa, 0.8 );
    directionalLight.castShadow = true
    const d = 1200;
      directionalLight.shadow.camera.left = - d;
      directionalLight.shadow.camera.right = d;
      directionalLight.shadow.camera.top = d;
      directionalLight.shadow.camera.bottom = - d;
    directionalLight.shadow.camera.far = 3000
    directionalLight.position.set = new THREE.Vector3(sun_x,sun_y,sun_z)
    scene.add( directionalLight );

    //scene.add(new THREE.AmbientLight( 0x666666 ))

}




const loadGUI = () => {

  const gui = new dat.GUI();

  const camera_option = gui.addFolder('Camera');
  camera_option.add( CameraParams, 'camera_x', -1000, 1000, 1);
  camera_option.add( CameraParams, 'camera_y', 50, 700, 1);
  camera_option.add( CameraParams, 'camera_z', -600, 600, 1);

  const dom_option = gui.addFolder('Dom');
  dom_option.add(DomLightParams, 'dom_intensity', 0, 1, 0.01);
  dom_option.open();

  const bubl_light_option = gui.addFolder('Spot_light');
  bubl_light_option.add(SpotLightParams, 'emissiveIntensity', 0, 3, 0.1);
  bubl_light_option.add(SpotLightParams, 'decay', 0, 4, 0.1);
  bubl_light_option.open();

  const camera_move = gui.addFolder('camera_move');
  camera_move.add(CameraAngleParams, 'x').name('angle_x');
  camera_move.add(CameraAngleParams, 'y').name('angle_y');
  camera_move.add(CameraAngleParams, 'z').name('angle_z');

  const light_change = gui.addFolder('light_change');
  let light_Color = light_change.addColor(ColorChangeParams, 'diffuse' ).name('Color (Diffuse)').listen();
  light_Color.onChange(function(value){
    spotLight.color.setHex( value.replace("#", "0x") );
  })
  light_change.open();

  let car_color = gui.addFolder('car_color');
  let speculer_color = car_color.addColor( CarSpeculerParams, 'c_speculer').name('Color (speculer)').listen();
  speculer_color.onChange(function(value){
    let tt = scene.getObjectByName('Object001');
    tt.material.specular.setHex(value.replace("#", "0x"));
  });

  let paint_color = car_color.addColor(CarPaintParams, 'c_paint').name('Color (paint)').listen();
  paint_color.onChange(function(value){
    let tt = scene.getObjectByName('Object001');
    tt.material.color.setHex(value.replace("#", "0x"));
  });
  car_color.open();


  let node_amount = gui.addFolder('node_amount');
  let n_i = node_amount.add(c_node, 'node_num', 36, 108, 36).name('node_amount');
  let cn = {
    add:function(){
      c_nodes = new Array(c_node.node_num);
      camera_nodes = new Array(c_node.node_num);
      removeCameraCube();
      for(var i=0; i < c_node.node_num; i++){
        c_nodes[i] = [
          Math.sqrt(camera.position.x*camera.position.x + camera.position.z*camera.position.z)*Math.sin(angle2),
          camera.position.y,
          Math.sqrt(camera.position.x*camera.position.x + camera.position.z*camera.position.z)*Math.cos(angle2),
        ]
        angle2 += 2*Math.PI/c_node.node_num;
        createCameraCube(
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
      removeCameraCube();
      for(var i=0; i < c_node.node_num; i++){
        c_nodes[i] = [
          400*Math.sin(angle2),
          camera.position.y,
          600*Math.cos(angle2),
        ]
        angle2 += 2*Math.PI / c_node.node_num;
        createCameraCube(400*Math.sin(angle2), camera.position.y, 600*Math.cos(angle2), camera_nodes[i], i)
      }
      is_camera_round = true;
    }
  };
  node_amount.add(cn_2, 'add').name('Ellipse');
  node_amount.open();


  let tire_y_rotate = gui.addFolder('tire_rotate');
  tire_y_rotate.add(TireParams, 'y_rotation', -45, 45, 1).name('rotation');
  tire_y_rotate.open();

  gui.open();
}

const init = function () {

  let geometry = new THREE.BoxGeometry(32, 32, 32);
  let material = new THREE.MeshBasicMaterial({ color: 0xddeeff });
  let cube = new THREE.Mesh(geometry, material);
  cube.position.set(300, -80, 300)
  cube.traverse(function(child) {
    if (child instanceof THREE.Mesh) {
      child.receiveShadow = true;
      child.castShadow = true;
    }
  });

  scene.add(cube);

    camera.position.set(-500, 150, -200)
    renderer.setSize(window.innerWidth, window.innerHeight)

    setLights()

    loadHDR()
    loadOBJ()

    //addTire()
    addFloor()

    loadGUI()

    document.body.appendChild(renderer.domElement)
}


const loop = function () {

  scene.background = exrBackground
  angle1 -= 0.005
  spotLight.position.x = 800 * Math.sin(angle1)
  spotLight.position.z = 800 * Math.cos(angle1)

  if ((is_camera_round == true) && (camera_index < c_node.node_num)){

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

  if(tire1 != undefined){

    tire1.position.x = -150;
    tire1.position.z = -150;
  }

  if(tire2 != undefined){

    tire2.rotation.y = TireParams.y_rotation;
  }

  let tire3 = scene.getObjectByName('test_tire');

  if(tire3 != undefined){

    tire3.rotation.y = TireParams.y_rotation;
  }

  hemispherelight.intensity = DomLightParams.dom_intensity
  spotLight.decay = SpotLightParams.decay
  spotLight.emissiveIntensity = SpotLightParams.emissiveIntensity

  camera.lookAt(
    new THREE.Vector3(
        CameraAngleParams.x, CameraAngleParams.y, CameraAngleParams.z
      )
  )
  window.addEventListener( 'resize', onWindowResize, false );
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}


function onWindowResize() {

    var width = window.innerWidth;
    var height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize( width, height );
}

init()
loop()