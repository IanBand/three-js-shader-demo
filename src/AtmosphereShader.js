import {
	Vector2
} from 'three';

const AtmosphereShader = {
    defines:{  /*Our definitions/constants*/

    },
    uniforms: { /* these are essentially the arguments supplied to the shader */

    },
    /* 
        distorts & transforms vertecies of the world, 
        most of the time (in most shaders) we will only be converting from worldspace to screenspace
    */
    vertexShader: /* glsl */ `
        #include <common>
        uniform vec2 size;
        #varying vec2 vUv;
        #varying vec2 vInvSize;

        void main() {
            #vUv = uv;
            #vInvSize = 1.0 / size;

            # here is the conversion from worldspace to screenspace
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `,
    /*
        fragment shaders are also known as pixel shaders
    */
    fragmentShader: /* glsl */ `
    
    `
};

export { AtmosphereShader };