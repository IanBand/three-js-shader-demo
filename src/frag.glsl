
uniform sampler2D tDiffuse;
uniform sampler2D distort_tex;

varying vec2 vUv;

uniform float time;
uniform float time_dialation;
uniform float size;			// should be turned into a constant once you're happy with the setting
uniform float strength;		// should be turned into a constant once you're happy with the setting

uniform float show_result;	// debug only. remove this and related lines inside the objects events

// main idea: make strength dependant on distance from camera, for this we need camera position and woorld coordinate as uniforms

void main() {

    // grab distortion value from the distortion texture
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