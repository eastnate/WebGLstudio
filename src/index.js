console.log('hello')

import * as THREE from '../node_modules/three/build/three.js';

let scene, camera, renderer, cube;
let ADD = 0.01;

let createCube = function(){
   let geometry = new THREE.BoxGeometry(1,1,1);
   let material = new THREE.MeshBasicMaterial({color:0x00a1cb});
   cube = new THREE.Mesh(geometry, material)
   scene.add(cube);
};

let init = function() {
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
   
   document.body.appendChild(renderer.domElement);
 };


let mainLoop = function() {
   cube.position.x += ADD;    
   cube.rotation.z -= ADD;
   
   if(cube.position.x <= -3 || cube.position.x >= 3)
      ADD *= -1;
   
   renderer.render(scene, camera);
   requestAnimationFrame(mainLoop);
 };


init()
mainLoop()