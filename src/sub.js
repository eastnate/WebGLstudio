import * as THREE from 'three';
import * as dat from 'dat.gui';
import * as OrbitControls from 'three-orbitcontrols'
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
const renderer = new THREE.WebGLRenderer()
const loader = new THREE.OBJLoader()
const controls = new OrbitControls(camera, renderer.domElement)

let cube = null
let car = null
let ADD = 0.01
let color = new THREE.Color(0xFF0000)


const createCube = function () {
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshBasicMaterial({ color: 0x00a1cb });
    cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
}

const mtlLoader = new THREE.MTLLoader();
mtlLoader.setTexturePath('/resource');
mtlLoader.setPath('/resource');


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
    exportObj() {},
    y: 2,
    x: 2,
}


const init = function () {

    scene.background = new THREE.Color(0xffffee);
    camera.position.z = 5

    createCube();

    // Background: invert the geometry on the x-axis so that all of the faces point inward
    // var geometry = new THREE.SphereGeometry(50, 60, 40,0,2*Math.PI,0,0.5 * Math.PI)
    var geometry = new THREE.SphereGeometry(50, 60, 40,0, 2*Math.PI,0,0.5*Math.PI)

    geometry.scale( -1, 1, 1)
    // var material = new THREE.MeshBasicMaterial({
    //     map: new THREE.TextureLoader().load('resource/background/test.jpg')
    // });
    var material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
            emissive: 0x072534,
            side: THREE.DoubleSide,
            flatShading: true });
    let mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh);

    // create the renderer   
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Light
    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( light );
    renderer.render(scene, camera);

    // GUI
    const panel = new dat.GUI();
    const folder1 = panel.addFolder( 'Basic')
    const folder2 = panel.addFolder( 'Object/Camera Controls')
    const folder3 = panel.addFolder( 'Scene Details' );
    const folder4 = panel.addFolder( 'VisualFX' );
    folder1.add(Params, 'importObj'),
    folder1.add(Params, 'exportObj')
    folder1.open()
    folder2.add(Params,'y', -50, 5)
    folder2.add(Params,'x', -50, 5)
    folder2.open()
}

const mainLoop = function () {
    cube.position.x += ADD
    cube.rotation.z -= ADD

    if (!!car) {
        car.position.y = Params.y
        car.position.x = Params.x
    }
    if (cube.position.x <= -3 || cube.position.x >= 3)
        ADD *= -1;
    
    renderer.render(scene, camera);
    requestAnimationFrame(mainLoop);
}


init()
mainLoop()