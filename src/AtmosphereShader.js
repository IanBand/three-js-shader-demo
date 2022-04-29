import * as THREE from 'three';
import vertexShader from './vertex.glsl';
import fragmentShader from './frag.glsl';

import DistortionMap from './distortion_map.png';
const AtmosphereShader = {
    defines:{  /*Our definitions/constants*/

    },
    uniforms: { /* these are essentially the arguments supplied to the shader */
        'time': {value: 0},
        'time_dialation': {value: 0.1},
        'size': {value: 0.4}, // size of the distortion texture, smaller = more zoomed in
        'strength': {value: 0.02}, // distance moved by distortion
        'show_result': {value: 1.0}, // opacity of distortion textures (inverted, 0 = 100% opacity)
        // https://threejs.org/docs/#api/en/loaders/TextureLoader
        'distort_tex': {value: new THREE.TextureLoader().load(DistortionMap)}, //may have to import texture via js 'import'
        'tDiffuse': { value: null }, // honestly idek
    },
    /* 
        distorts & transforms vertecies of the world, 
        most of the time (in most shaders) we will only be converting from worldspace to screenspace
    */
    vertexShader,
    fragmentShader,
};

export { AtmosphereShader };