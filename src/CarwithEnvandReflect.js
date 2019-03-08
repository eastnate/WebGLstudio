import * as THREE from 'three';
import * as dat from 'dat.gui';
import * as OrbitControls from 'three-orbitcontrols'
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'
import *  as RGBELoader from 'three/examples/js/loaders/RGBELoader.js'
import * as HDRCubeTextureLoader from 'three/examples/js/loaders/HDRCubeTextureLoader.js'

import EquirectangularToCubeGenerator from 'three/examples/js/loaders/EquirectangularToCubeGenerator.js'

import * as PMREMGenerator from 'three/examples/js/pmrem/PMREMGenerator.js'
import * as PMREMCubeUVPacker from 'three/examples/js/pmrem/PMREMCubeUVPacker.js'

import base from './base.js'

var params = {
    envMap: 'EXR',
    roughness: 0.0,
    metalness: 0.0,
    exposure: 1.0,
    debug: false,
};

var container
var camera, scene, renderer, controls;
var torusMesh, planeMesh;
var standardMaterial, floorMaterial;
var pngCubeRenderTarget, exrCubeRenderTarget;
var pngBackground, exrBackground;
let cubeMapTexture = null

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 120);

    // Scene
    scene = new THREE.Scene();

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.toneMapping = THREE.LinearToneMapping;

    // Light
    const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(light);
    renderer.render(scene, camera);


    var geometry = new THREE.TorusKnotBufferGeometry(18, 8, 150, 20);
    var material = new THREE.MeshStandardMaterial({
        metalness: params.roughness,
        roughness: params.metalness,
        envMapIntensity: 1.0,
        color: 0x00a1cb,
    });

    torusMesh = new THREE.Mesh(geometry, material);
    console.log('This is Torus', torusMesh.material)
    scene.add(torusMesh);


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

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;


    controls = new THREE.OrbitControls(camera, renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
    var gui = new dat.GUI();

    gui.add(params, 'envMap', ['EXR', 'PNG']);
    gui.add(params, 'roughness', 0, 1, 0.01);
    gui.add(params, 'metalness', 0, 1, 0.01);
    gui.add(params, 'exposure', 0, 2, 0.01);
    gui.add(params, 'debug', false);
    gui.open();

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

                if (child.name === 'Object001') {
                    console.log('This is Material:', child.material)
                    child.material.envMap = cubeMapTexture;
                    child.material.specular.setHex(0xff0000)
                    child.material.envMapIntensity = 1
                    child.material.reflectivity= 0.38
                    child.material.shininess = 30;
                    child.material.color.setHex(0xfff000);
                    child.material.needsUpdate = true;
                }

                if (child.name === 'OUT650') {
                    console.log('This is Material:', child.material)
                    child.material.color.setHex(0x00008f);
                }

            });

            object.position.y = -100
            scene.add(object);
        })
    })//mtl load end
} //init end


function onWindowResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    
    torusMesh.material.roughness = params.roughness;
    torusMesh.material.metalness = params.metalness;

    // var newEnvMap = torusMesh.material.envMap;
    let newEnvMap = null
    if (exrCubeRenderTarget) {
        newEnvMap = exrCubeRenderTarget.texture
    } else{
        console.log(exrCubeRenderTarget,'exrCubeRenderTarget is null')
        newEnvMap = null
    }
    console.log('It work!', newEnvMap)
    torusMesh.material.envMap = cubeMapTexture;
    //torusMesh.material.envMap = newEnvMap;
    torusMesh.material.needsUpdate = true;

    torusMesh.rotation.y += 0.005;
    scene.background = exrBackground;
    renderer.toneMappingExposure = params.exposure;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.render(scene, camera);

}