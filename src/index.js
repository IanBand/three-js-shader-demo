import * as THREE from 'three';
import * as dat from "lil-gui";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';


// remove padding
document.body.style.margin = 0;
document.body.style.padding = 0;

//debug
const gui = new dat.GUI();

const debugVars = {
    zoom: 0.1,
    objectDistance: 0,
    turbulance: 1,
}

gui.add(debugVars, "zoom", 0, 1);
gui.add(debugVars, "objectDistance", -8.5, 0.7);
gui.add(debugVars, "turbulance", 0, 1);

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

    



    // Call tick again on the next frame
    //window.requestAnimationFrame(tick);

}

const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
    // timekeeping
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // update
    mesh.rotation.x += deltaTime / 2;
	mesh.rotation.y += deltaTime / 3;

    mesh.position.z = debugVars.objectDistance;

	
    // render scene
    renderer.render( scene, camera );
    


    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();