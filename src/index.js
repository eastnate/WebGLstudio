import * as THREE from 'three';
import * as dat from 'dat.gui';
import * as OrbitControls from 'three-orbitcontrols'
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'
import *  as RGBELoader from 'three/examples/js/loaders/RGBELoader.js'
import * as HDRCubeTextureLoader from 'three/examples/js/loaders/HDRCubeTextureLoader.js'
import * as PMREMGenerator from 'three/examples/js/pmrem/PMREMGenerator.js'
import * as PMREMCubeUVPacker from 'three/examples/js/pmrem/PMREMCubeUVPacker.js'



var hdrCubeRenderTarget;
var hdrCubeMap;

console.log('Original')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
const renderer = new THREE.WebGLRenderer()
const loader = new THREE.OBJLoader()
const controls = new OrbitControls(camera, renderer.domElement)

let torusMesh = null
let car = null
let ADD = 0.01
let color = new THREE.Color(0xFFf000)

const hdrUrls = ['px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr'];

// -------------------------------------------------------------------------
hdrCubeMap = new THREE.HDRCubeTextureLoader()
    .setPath('./resource/textures/HDR/')
    .load(THREE.UnsignedByteType, hdrUrls, function () {

        var pmremGenerator = new THREE.PMREMGenerator(hdrCubeMap);
        pmremGenerator.update(renderer);

        var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker(pmremGenerator.cubeLods);
        pmremCubeUVPacker.update(renderer);

        hdrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;

    });
// -------------------------------------------------------------------------


const Params = {
    importObj() {
        mtlLoader.load('/audi_obj.mtl', function (materials) {

            materials.preload();

            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            // objLoader.setPath('/examples/3d-obj-loader/assets/');
            objLoader.load('resource/audi_obj.obj', function (object) {
                car = object
                

                scene.add(car)
                car.position.y = -100
            })
        })
    },
    exportObj() { },
    y: 2,
    x: 2,
    roughness: 0.0,
    metalness: 0.0,
    exposure: 1.0,
}


const createDonut = function () {
    var geometry = new THREE.TorusKnotBufferGeometry(18, 8, 150, 20);
    var material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: Params.metalness,
        roughness: Params.roughness
    });

    torusMesh = new THREE.Mesh(geometry, material);
    scene.add(torusMesh);
}





renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// 미끄러움
renderer.toneMapping = THREE.ReinhardToneMapping;
// 어두워진거 밝아짐
renderer.gammaInput = true;
renderer.gammaOutput = true;

const mtlLoader = new THREE.MTLLoader();
mtlLoader.setTexturePath('/resource');
mtlLoader.setPath('/resource');



const init = function () {

    scene.background = new THREE.Color(0xffffee);
    camera.position.z = 5
    renderer.toneMapping = THREE.LinearToneMapping
    createDonut();

    const geometry = new THREE.PlaneBufferGeometry(200, 200);
    const material = new THREE.MeshBasicMaterial();
    const planeMesh = new THREE.Mesh(geometry, material);
    planeMesh.position.y = - 50;
    planeMesh.rotation.x = - Math.PI * 0.5;
    scene.add(planeMesh);



    // create the renderer   
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // // Light
    // const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    // scene.add(light);
    // renderer.render(scene, camera);

    // GUI
    const panel = new dat.GUI();
    const folder1 = panel.addFolder('Basic')
    const folder2 = panel.addFolder('Object/Camera Controls')
    const folder3 = panel.addFolder('IBL');

    folder1.add(Params, 'importObj'),
        folder1.add(Params, 'exportObj')
    folder1.open()
    folder2.add(Params, 'y', -50, 5)
    folder2.add(Params, 'x', -50, 5)
    folder2.open()
    folder3.add(Params, 'roughness',0, 1)
    folder3.add(Params, 'metalness',0, 1)
    folder3.add(Params, 'exposure',0, 3)
    folder3.open()
}


const animate = function () {

   

    requestAnimationFrame(animate);

    if (!!car) {
        car.position.y = Params.y
        car.position.x = Params.x
    }
    if (torusMesh.position.x <= -3 || torusMesh.position.x >= 3)
        ADD *= -1;

    torusMesh.material.roughness = Params.roughness;
    torusMesh.material.metalness = Params.metalness;

    
    if (hdrCubeRenderTarget) {
        // Here!
        torusMesh.material.envMap = hdrCubeRenderTarget.texture;

        torusMesh.material.needsUpdate = true;
        torusMesh.rotation.y += 0.005;
        scene.background = hdrCubeMap;
        renderer.toneMappingExposure = Params.exposure;
        renderer.render(scene, camera);
    }
}


init()
animate()