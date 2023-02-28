import * as THREE from 'three';
import vertexShader from './atmosphere_shader/vertex.glsl';
import fragmentShader from './atmosphere_shader/frag.glsl';
import DistortionMap from './distortion_map.png';

const AtmosphereShader = {
    defines:{},
    uniforms: { /* these are essentially the arguments supplied to the shader */
        'time': {value: 0}, // increments every frame
        'time_dialation': {value: 0.1},
        'size': {value: 0.4}, // size of the distortion texture, smaller = more zoomed in
        'strength': {value: 0.02}, // distance moved by distortion
        'show_result': {value: 1.0}, // opacity of distortion textures (inverted, 0 = 100% opacity)
        'distort_tex': {value: new THREE.TextureLoader().load(DistortionMap)}, // distortion texture
        'tDiffuse': { value: null }, // unmodified screen contents as an image
    },
    vertexShader,
    fragmentShader,
};

export { AtmosphereShader };