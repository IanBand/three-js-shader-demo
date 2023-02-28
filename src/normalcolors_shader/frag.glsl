varying mediump vec3 vNormal;

uniform mediump vec3 color_x;
uniform mediump vec3 color_y;
uniform mediump vec3 color_z;

mediump vec3 axis_x = vec3(1.0,0.0,0.0);
mediump vec3 axis_y = vec3(0.0,1.0,0.0);
mediump vec3 axis_z = vec3(0.0,0.0,1.0);


// assuming vectors are normalized, a dot b = 1 iff theta = 0

void main() {

    mediump float portion_x = abs(dot(vNormal, axis_x));
    mediump float portion_y = abs(dot(vNormal, axis_y));
    mediump float portion_z = abs(dot(vNormal, axis_z));


    // color_a.x = color_a.r
    // color_a.y = color_a.g
    // color_a.z = color_a.b
    mediump vec3 final_rgb =  vec3(
        portion_x * color_x.x + 
        portion_y * color_y.x + 
        portion_z * color_z.x, // R

        portion_x * color_x.y + 
        portion_y * color_y.y + 
        portion_z * color_z.y, // G

        portion_x * color_x.z + 
        portion_y * color_y.z + 
        portion_z * color_z.z  // B
    );


    gl_FragColor = vec4(final_rgb.x, final_rgb.y, final_rgb.z, 1.0);
}