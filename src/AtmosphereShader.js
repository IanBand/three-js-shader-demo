import {
	Vector2, ImageUtils
} from 'three';

const AtmosphereShader = {
    defines:{  /*Our definitions/constants*/

    },
    uniforms: { /* these are essentially the arguments supplied to the shader */
        'time': {value: 0},
        'size': {value: 1},
        'strength': {value: 1},
        'show_result': {value: 1},
        // https://threejs.org/docs/#api/en/loaders/TextureLoader
        'distort_tex': {value: new ImageUtils.TextureLoader.load("distortion_map.png")}, //may have to import texture via js 'import'
    },
    /* 
        distorts & transforms vertecies of the world, 
        most of the time (in most shaders) we will only be converting from worldspace to screenspace
    */
    vertexShader: /* glsl */ `
        
        varying vec2 vUv;
        
        void main() {

            vUv = uv;
            # here is the conversion from worldspace to screenspace
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `,
    /*
        fragment shaders are also known as pixel shaders
    */
   // glsl function references https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/fract.xhtml
    fragmentShader: /* glsl */ `
        
        varying vec2 v_vTexcoord;
        varying vec4 v_vColour;
        
        uniform sampler2D distort_tex; //distorting texture, the texture used for the heat distortion.
        
        uniform float time;
        uniform float size;			// should be turned into a constant once you're happy with the setting
        uniform float strength;		// should be turned into a constant once you're happy with the setting
        
        uniform float show_result;	// debug only. remove this and related lines inside the objects events
        
        
        void main() {	
            // grab distortion off the distorion texture
            vec2 distort;
            distort.x = texture2D( distort_tex, fract(v_vTexcoord * size		+ vec2(0.0, time))).r		* strength;
            distort.y = texture2D( distort_tex, fract(v_vTexcoord * size * 3.4	+ vec2(0.0, time * 1.6))).g	* strength * 1.3;
            
            //// grab the base colour at the distorted texture coordinate:
            gl_FragColor = v_vColour * texture2D( gm_BaseTexture, v_vTexcoord + distort);
            
             // debug only. remove this:
            gl_FragColor.rgb = mix(vec3(distort/max(strength,0.0001), 0.0), gl_FragColor.rgb, show_result);
        }
        
    `
};

export { AtmosphereShader };