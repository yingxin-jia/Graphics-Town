/* a simple procedural texture for exercise 5-1 */
/* the student should change this to implement a checkerboard */

/* pass interpolated variables to from the vertex */
varying vec2 v_uv;
#extension GL_OES_standard_derivatives : enable
/* colors for the checkerboard */
uniform vec3 light;
uniform vec3 dark;

/* number of checks over the UV range */

void main()
{
    // float x = v_uv.x * checks;
    // float y = v_uv.y * checks;

    // float xc = floor(x);
    // float yc = floor(y);

    // float dx = x-xc-.5;
    // float dy = y-yc-.5;


    // float d = sqrt(dx*dx + dy*dy);
    // float blur = -1.0;
    // float a = blur > -.5 ? blur: fwidth(d);
    // // float a =  fwidth(d);
    //     // float dc = 1.0-smoothstep(radius-a,radius+a,d);

    // float dd = 0.0;
    // if(step(dx, 0.05)==0.0)
    //     dd = 1.0 - smoothstep(0.05-a,0.05+a, dy) ;
    // else
    //     dd = smoothstep(0.05-a,0.05+a,dy) ;


    // gl_FragColor = vec4(mix(light,dark,dd), 1.);
    float x = v_uv.x * 5.0;
    float y = v_uv.y * 5.0;

    float xc = floor(x);
    float yc = floor(y);

    float dx = x-xc-.5;
    float dy = y-yc-.5;

    
    float dd = 0.0;
    if(step(dx, 0.02)==0.0)
        dd = step(dy*.8+.8*dx*dx, 0.05) ;
    else
        dd = .5-step(dy*.8+0.8*dx*dx, 0.05) ;


    gl_FragColor = vec4(mix(light,dark,dd), 1.);
}