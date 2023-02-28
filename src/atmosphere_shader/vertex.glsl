varying vec2 vUv;
        
void main() {

    // save screen coordinate of pixel to be used in frag shader
    vUv = uv;

    //here is the conversion from worldspace to screenspace
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}