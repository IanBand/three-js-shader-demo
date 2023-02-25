## What's this?
A project exploring post processing in Three.js. It can be used as a guide for using post processing, with either custom or built in shaders.
This project doubles as a proof of concept for using an atmosphere shader with Three.js

[DEMO](https://ianband.github.io/three-js-shader-demo/root/index.html)


Videos of high zoom cameras with the effect we are trying to recreate:
- https://www.youtube.com/watch?v=O2G2IDji4Lw
- https://www.youtube.com/watch?v=3kKdZjximy4

## Resources:
- [Graphics Pipeline Wikipedia](https://en.wikipedia.org/wiki/Graphics_pipeline) - For resolving ambiguity around the term "shader"
- [Three Post Processing Documentation](https://threejs.org/docs/#manual/en/introduction/How-to-use-post-processing)
- [Displacement Shader](https://www.youtube.com/watch?v=dJUPz11LKm4)

## Notes on translating shader code
Different guides, documentation, and applications will have different naming conventions for the same variables, this can be one source of pain for porting shader code. For instance, ThreeJS docs call the screen texture uniform "tDiffuse" (at least in their copy shader example) and the uv coordinate vUv where those are called v_vTextcoord and gm_BaseTexture in the tutorial that I ported the shader from.

## Finding out what I need to find out

The effect I want is applied over everything as a function of how much air is between it and the camera. This leads me to believe it should be a shader that is applied to data in screenspace. This leads me to search google for "screen space shader three js". I eventually come across this [three js example](https://threejs.org/examples/#webgl_postprocessing_ssao). Looking at the source it uses the EffectComposer, which looks like it handles what I want, based on [the examples](https://threejs.org/docs/#examples/en/postprocessing/EffectComposer). Looking through the examples, I see that the [Depth of Field example](https://threejs.org/examples/#webgl_postprocessing_dof) is actually kind of close to what I want: objects farther away have more atmosphere inbetween them and the camera, where as objects farther away in the example are more blurred.

https://en.wikipedia.org/wiki/Graphics_pipeline

need to port a [displacement shader](https://www.youtube.com/watch?v=dJUPz11LKm4) to a [ThreeJS Shader](https://github.com/mrdoob/three.js/tree/master/examples/jsm/shaders)

To use the shader I need to create a post-processing module known as a "pass" that uses the shader. I finally found some fairly high level [documentation](https://threejs.org/docs/#manual/en/introduction/How-to-use-post-processing) outlining how to do what I want and where to start.

Post processing is done using the EffectComposer to compose processing Passes. 

## Future:

https://github.com/mrdoob/three.js/blob/master/examples/webgl_framebuffer_texture.html

create tileable perlin noise on a seperate channel and use it as a texture?


