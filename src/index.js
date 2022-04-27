import * as THREE from 'three';
import * as dat from "lil-gui";

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';


// remove padding
document.body.style.margin = 0;
document.body.style.padding = 0;

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-= debug gui =-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const gui = new dat.GUI();

const debugVars = {
    zoom: 0.1,
    objectDistance: 0,
    turbulance: 1,
}

gui.add(debugVars, "zoom", 0, 1);
gui.add(debugVars, "objectDistance", -8.5, 0.7);
gui.add(debugVars, "turbulance", 0, 1);

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-= camera =-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
camera.position.z = 1;

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-= scene + mesh =-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
const material = new THREE.MeshNormalMaterial();
const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );



const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-= post processing =-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const postprocessing = {};
const renderPass = new RenderPass( scene, camera );
let width = window.innerWidth;
let height = window.innerHeight;
const bokehPass = new BokehPass( scene, camera, {
    focus: 1.0,
    aperture: 0.025,
    maxblur: 0.01,

    width: width,
    height: height
} );

const composer = new EffectComposer( renderer );

composer.addPass( renderPass );
composer.addPass( bokehPass );

postprocessing.composer = composer;
postprocessing.bokeh = bokehPass;

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-= animation =-=-=-=-=-=-=-=-=-=-=-=-=-=-=
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
    postprocessing.composer.render( 0.1 );
    


    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();