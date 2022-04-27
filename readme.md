## What's this?
This project is a proof of concept for using an atmosphere shader with Three.js

I'm using [this shadertoy](https://www.shadertoy.com/view/XsVSRd) as a starting point for the atmospheric effect I want to acheive.

Videos of high zoom cameras with the effect:
- https://www.youtube.com/watch?v=O2G2IDji4Lw
- https://www.youtube.com/watch?v=3kKdZjximy4


## Finding out what I need to find out

The effect I want is applied over everything as a function of how much air is between it and the camera. This leads me to believe it should be a shader that is applied to data in screenspace. This leads me to search google for "screen space shader three js". I eventually come across this [three js example](https://threejs.org/examples/#webgl_postprocessing_ssao). Looking at the source it uses the EffectComposer, which looks like it handles what I want, based on [the examples](https://threejs.org/docs/#examples/en/postprocessing/EffectComposer). Looking through the examples, I see that the [Depth of Field example](https://threejs.org/examples/#webgl_postprocessing_dof) is actually kind of close to what I want: objects farther away have more atmosphere inbetween them and the camera, where as objects farther away in the example are more blurred.

https://en.wikipedia.org/wiki/Graphics_pipeline

need to port a [displacement shader](https://www.youtube.com/watch?v=dJUPz11LKm4) to a [ThreeJS Shader](https://github.com/mrdoob/three.js/tree/master/examples/jsm/shaders)


