import * as THREE from 'three';
import * as dat from "lil-gui";

// remove padding
document.body.style.margin = 0;
document.body.style.padding = 0;

//debug
const gui = new dat.GUI();

const debugVars = {
    zoom: 1,
    objectDistance: 1,
    turbulance: 1,
}

// camera
const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
camera.position.z = 1;

// scene + mesh
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
const material = new THREE.MeshNormalMaterial();
const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );



const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animation );
document.body.appendChild( renderer.domElement );

// animation

function animation( time ) {

	mesh.rotation.x = time / 2000;
	mesh.rotation.y = time / 1000;

	renderer.render( scene, camera );

}