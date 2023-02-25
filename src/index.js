import * as THREE from 'three';
import * as dat from "lil-gui";

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { AtmospherePass } from './AtmospherePass.js';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
// import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js'; 
// import { AtmosphereShader } from './AtmosphereShader.js'



// remove padding
document.body.style.margin = 0;
document.body.style.padding = 0;

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-= debug gui =-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const gui = new dat.GUI();

const debugVars = {
    fov: 70,
    objectDistance: -2,
    SH_time_dialation: 0.12,
    SH_size: 3.85,
    SH_strength: 0.0515,
    SH_show_result: 1
}

gui.add(debugVars, "fov", 10, 150);
gui.add(debugVars, "objectDistance", -8.5, 0.7);
gui.add(debugVars, "SH_time_dialation", 0, 0.3);
gui.add(debugVars, "SH_size", 0, 10);
gui.add(debugVars, "SH_strength", 0, 0.5);
gui.add(debugVars, "SH_show_result", 0, 1);




// =-=-=-=-=-=-=-=-=-=-=-=-=-=-= camera =-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const camera = new THREE.PerspectiveCamera( debugVars.fov, window.innerWidth / window.innerHeight, 0.01, 10 );
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
//const atmospherePass = new ShaderPass(AtmosphereShader); 
const atmospherePass = new AtmospherePass(); 
const composer = new EffectComposer( renderer );

composer.addPass( renderPass );
composer.addPass( atmospherePass );

postprocessing.composer = composer;

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-= animation =-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
    // timekeeping
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // update mesh & scene
    mesh.rotation.x += deltaTime / 2;
	mesh.rotation.y += deltaTime / 3;

    mesh.position.z = debugVars.objectDistance;
    camera.setFocalLength(debugVars.fov);

    // update shader uniforms
    atmospherePass.updateUniform('time', elapsedTime);
    atmospherePass.updateUniform('time_dialation', debugVars.SH_time_dialation);
    atmospherePass.updateUniform('size', debugVars.SH_size);
    atmospherePass.updateUniform('strength', debugVars.SH_strength);
    atmospherePass.updateUniform('show_result', debugVars.SH_show_result);

	
    // render scene
    // renderer.render( scene, camera );
    postprocessing.composer.render( 0.1 );


    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();