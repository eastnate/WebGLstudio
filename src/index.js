import * as THREE from 'three';
import * as dat from 'dat.gui';
import * as OrbitControls from 'three-orbitcontrols'
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'
import *  as RGBELoader from 'three/examples/js/loaders/RGBELoader.js'
import * as HDRCubeTextureLoader from 'three/examples/js/loaders/HDRCubeTextureLoader.js'

import EquirectangularToCubeGenerator from 'three/examples/js/loaders/EquirectangularToCubeGenerator.js'

import * as PMREMGenerator from 'three/examples/js/pmrem/PMREMGenerator.js'
import * as PMREMCubeUVPacker from 'three/examples/js/pmrem/PMREMCubeUVPacker.js'


const mtlLoader = new THREE.MTLLoader();

var renderer, scene, camera;

var spotLight, lightHelper, shadowCameraHelper;

var gui;

function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 65, 8, - 10 );

    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render );

    controls.enablePan = false;

    var ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
    scene.add( ambient );

    spotLight = new THREE.SpotLight( 0xffffff, 1 );
    spotLight.position.set( 15, 40, 35 );
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.05;
    spotLight.decay = 2;
    spotLight.distance = 200;

    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 200;
    scene.add( spotLight );

    lightHelper = new THREE.SpotLightHelper( spotLight );
    scene.add( lightHelper );

    shadowCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
    scene.add( shadowCameraHelper );

    scene.add( new THREE.AxesHelper( 10 ) );

    var material = new THREE.MeshPhongMaterial( { color: 0x808080, dithering: true } );

    var geometry = new THREE.PlaneBufferGeometry( 2000, 2000 );

    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set( 0, - 1, 0 );
    mesh.rotation.x = - Math.PI * 0.5;
    mesh.receiveShadow = true;
    scene.add( mesh );

    var material = new THREE.MeshPhongMaterial( { color: 0x4080ff, dithering: true } );

    var geometry = new THREE.BoxBufferGeometry( 3, 1, 2 );

    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set( 40, 2, 0 );
    mesh.castShadow = true;
    scene.add( mesh );

    mtlLoader.load('resource/room_obj.mtl', function (materials) {

        // materials.preload();

        const objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        // objLoader.setPath('/examples/3d-obj-loader/assets/');
        objLoader.load('resource/room_obj.obj', function (object) {
            object.traverse( function ( child ) {

                if ( child instanceof THREE.Mesh ) {
            
                    //child.material.map = texture;
                    child.castShadow = true;
                    child.receiveShadow = true;
            
                }
            
            } );
            scene.add(object)

        })
    })
    


    controls.target.copy( mesh.position );
    controls.update();

    window.addEventListener( 'resize', onResize, false );

}

function onResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function render() {

    lightHelper.update();

    shadowCameraHelper.update();

    renderer.render( scene, camera );

}

function buildGui() {

    gui = new dat.GUI();

    var params = {
        'light color': spotLight.color.getHex(),
        intensity: spotLight.intensity,
        distance: spotLight.distance,
        angle: spotLight.angle,
        penumbra: spotLight.penumbra,
        decay: spotLight.decay
    };

    gui.addColor( params, 'light color' ).onChange( function ( val ) {

        spotLight.color.setHex( val );
        render();

    } );

    gui.add( params, 'intensity', 0, 2 ).onChange( function ( val ) {

        spotLight.intensity = val;
        render();

    } );


    gui.add( params, 'distance', 50, 200 ).onChange( function ( val ) {

        spotLight.distance = val;
        render();

    } );

    gui.add( params, 'angle', 0, Math.PI / 3 ).onChange( function ( val ) {

        spotLight.angle = val;
        render();

    } );

    gui.add( params, 'penumbra', 0, 1 ).onChange( function ( val ) {

        spotLight.penumbra = val;
        render();

    } );

    gui.add( params, 'decay', 1, 2 ).onChange( function ( val ) {

        spotLight.decay = val;
        render();

    } );

    gui.open();

}

init();

buildGui();

render();
