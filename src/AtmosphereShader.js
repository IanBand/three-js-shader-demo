import * as THREE from 'three';

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
    vertexShader: /* glsl */ `
        
        varying vec2 vUv;
        
        void main() {

            // save screen coordinate of pixel to be used in frag shader
            vUv = uv;

            //here is the conversion from worldspace to screenspace
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `,
    /*
        fragment shaders are also known as pixel shaders
    */
   // glsl function references https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/fract.xhtml
    fragmentShader: /* glsl */ `
        

		uniform sampler2D tDiffuse;
        uniform sampler2D distort_tex;

		varying vec2 vUv;

        uniform float time;
        uniform float time_dialation;
        uniform float size;			// should be turned into a constant once you're happy with the setting
        uniform float strength;		// should be turned into a constant once you're happy with the setting

        uniform float show_result;	// debug only. remove this and related lines inside the objects events

        // main idea: make strength dependant on distance from camera

		void main() {

            // grab distortion off the distortion texture
            vec2 distort;
            
            // BUG: pretty sure the distorted vertical and horizontal bars are caused by some float rounding issue, maybe has to do with fract?
            // rewrite logic?
            distort.x = texture2D( distort_tex, fract(vUv * size		+ vec2(0.0, time * -0.1 * time_dialation))).r	* strength;
            distort.y = texture2D( distort_tex, fract(vUv * size * 3.0	+ vec2(0.0, time * -1.6 * time_dialation))).g	* strength * 1.3; // make y component of distort bigger, & move slower

            //// grab the base colour at the distorted texture coordinate:
			gl_FragColor = texture2D( tDiffuse, vUv + distort);

            // debug only. remove this:
            gl_FragColor.rgb = mix(vec3(distort/max(strength,0.0001), 0.0), gl_FragColor.rgb, show_result);
		}
        
    `
};

export { AtmosphereShader };