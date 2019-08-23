/* simplest possible fragment shader - just a yellow color */

uniform sampler2D texture;
varying vec2 v_uv;

void main()
{
    vec4 lookupColor = texture2D(texture,v_uv);
    gl_FragColor = lookupColor;
}
