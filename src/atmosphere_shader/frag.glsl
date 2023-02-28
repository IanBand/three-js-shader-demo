uniform sampler2D tDiffuse;
uniform sampler2D distort_tex;

varying vec2 vUv;

uniform float time;
uniform float time_dialation;
uniform float size;			// should be turned into a constant once you're happy with the setting
uniform float strength;		// should be turned into a constant once you're happy with the setting

uniform float show_result;	// debug only. remove this and related lines inside the objects events

// main idea: make strength dependant on distance from camera, for this we need camera position and woorld coordinate as uniforms


// The following functions (other than main) were taken from tuxalin: https://github.com/tuxalin/procedural-tileable-shaders/blob/master
uvec4 ihash1D(uvec4 q)
{
    // hash by Hugo Elias, Integer Hash - I, 2017
    q = q * 747796405u + 2891336453u;
    q = (q << 13u) ^ q;
    return q * (q * q * 15731u + 789221u) + 1376312589u;
}
// generates 2 random numbers for each of the 4 cell corners
void betterHash2D(vec4 cell, out vec4 hashX, out vec4 hashY)
{
    uvec4 i = uvec4(cell);
    uvec4 hash0 = ihash1D(ihash1D(i.xzxz) + i.yyww);
    uvec4 hash1 = ihash1D(hash0 ^ 1933247u);
    hashX = vec4(hash0) * (1.0 / float(0xffffffffu));
    hashY = vec4(hash1) * (1.0 / float(0xffffffffu));
}

# define multiHash2D betterHash2D

// 2D Perlin noise.
// @param scale Number of tiles, must be  integer for tileable results, range: [2, inf]
// @param seed Seed to randomize result, range: [0, inf], default: 0.0
// @return Value of the noise, range: [-1, 1]
float perlinNoise(vec2 pos, vec2 scale, float seed)
{
    // based on Modifications to Classic Perlin Noise by Brian Sharpe: https://archive.is/cJtlS
    pos *= scale;
    vec4 i = floor(pos).xyxy + vec2(0.0, 1.0).xxyy;
    vec4 f = (pos.xyxy - i.xyxy) - vec2(0.0, 1.0).xxyy;
    i = mod(i, scale.xyxy) + seed;

    // grid gradients
    vec4 gradientX, gradientY;
    multiHash2D(i, gradientX, gradientY);
    gradientX -= 0.49999;
    gradientY -= 0.49999;

    // perlin surflet
    vec4 gradients = inversesqrt(gradientX * gradientX + gradientY * gradientY) * (gradientX * f.xzxz + gradientY * f.yyww);
    // normalize: 1.0 / 0.75^3
    gradients *= 2.3703703703703703703703703703704;
    vec4 lengthSq = f * f;
    lengthSq = lengthSq.xzxz + lengthSq.yyww;
    vec4 xSq = 1.0 - min(vec4(1.0), lengthSq); 
    xSq = xSq * xSq * xSq;
    return dot(xSq, gradients);
}

void main() {

    // grab distortion value from the distortion texture
    vec2 distort;
    
    // old method of using an image for the offset map
    // BUG: pretty sure the distorted vertical and horizontal bars are caused by some float rounding issue, maybe has to do with fract?
    // distort.x = texture2D( distort_tex, fract(vUv * size		    + vec2(0.0, time * -0.1 * time_dialation))).r   * strength;
    // distort.y = texture2D( distort_tex, fract(vUv * size * 3.0	+ vec2(0.0, time * -1.6 * time_dialation))).g   * strength * 1.3; // make y component of distort bigger, & move slower

    vec2 scale = vec2(size, size);
    float seed = 1.0;

    distort.x = perlinNoise(
        vUv + vec2(0.0, time * -0.1  * time_dialation),
        scale,
        seed
    ) * strength;

    distort.y = perlinNoise(
        vUv + vec2(0.0, time * -0.17 * time_dialation),
        scale * 3.0,
        seed + 1.0
    ) * strength * 1.3;

    // grab the base colour at the distorted texture coordinate:
    gl_FragColor = texture2D( tDiffuse, vUv + distort);

    // show the distortion map 
    gl_FragColor.rgb = mix(vec3(distort/max(strength,0.0001), 0.0), gl_FragColor.rgb, show_result);
}