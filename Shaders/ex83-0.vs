/*
 * Simple Shader for exercise 8-3
 * The student should make this more interesting, but the interesting parts
 * might be the fragment shader.
  */

/* pass interpolated variables to the fragment */
varying vec2 v_uv;
// varying vec3 v_normal;

uniform sampler2D texture;
uniform float fire_height;
// varying float displacement;
// varying vec3 vPosition;

/* the vertex shader just passes stuff to the fragment shader after doing the
 * appropriate transformations of the vertex information
 */
void main() {
    // // pass the texture coordinate to the fragment
    // v_uv = uv;
    // v_normal = normalMatrix * normal;

    // float height = texture2D(texture,uv).;    // get the green value
    // vec3 pos = position + height*normal *.4;
    // // the main output of the shader (the vertex position)
    // gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );



    float height = texture2D(texture,uv).r;    // get the green value

    vec3 pos = position + height*normal *fire_height;

    // the main output of the shader (the vertex position)
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

    v_uv = uv;
}
