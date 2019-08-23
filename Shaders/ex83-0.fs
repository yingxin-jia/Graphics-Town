/* a simple procedural texture for exercise 5-1 */
/* the student should change this to implement a checkerboard */

/* pass interpolated variables to from the vertex */
varying vec2 v_uv;
uniform sampler2D texture;
/* colors for the checkerboard */
uniform vec3 light;
uniform vec3 dark;
/* number of checks over the UV range */
uniform float checks;
uniform vec3 pointLightColor;
uniform vec3 pointLightPosition;
varying vec3 vPosition;
varying vec3 v_normal;
uniform float radius;
const vec3 lightDirWorld1 = vec3(2,1,0.5);
const vec3 lightDirWorld2 = vec3(-2,1,0.5);
void main()
{
    // we need to renormalize the normal since it was interpolated
    vec3 nhat = normalize(v_normal);
    // get the lighting vector in the view coordinates
    // warning: this is REALLY wasteful!
    vec3 lightDir1 = normalize( viewMatrix * vec4(lightDirWorld1,0) ).xyz;
    vec3 lightDir2 = normalize( viewMatrix * vec4(lightDirWorld2,0) ).xyz;
    // deal with two sided lighting
    float lights1 = abs(dot(nhat, lightDir1));
    float lights2 = abs(dot(nhat, lightDir2));
    // lights1.rgb = (1.,0.,0.);
//   vec4 lights = vec4(0.0, 0.0, 0.0, 1.0);
//   for(int i = 0; i < 3; i++) {
//         vec3 lightVector = normalize(vPosition - pointLightPosition);
//         lights.rgb += clamp(dot(-lightVector, v_normal), 0.0, 1.0) *(0.,0.,1.);
//         lights.rgb += clamp(dot(-lightVector, v_normal), 0.0, 1.0) *(1.,0.,0.);
//    }

    float x = v_uv.x * checks;
    float y = v_uv.y * checks;
    float xc = floor(x);
    float yc = floor(y);
    float dx = x-xc-.5;
    float dy = y-yc-.5;
    
    float d = sqrt(dx*dx + dy*dy);
    float dd = step(d,radius);


    vec3 baseColor = vec3(mix(light,dark,dd));
    // gl_FragColor = vec4(lights * baseColor, 1.);
    //
    //gl_FragColor = vec4(baseColor, 1.)*lights ;
    //gl_FragColor = vec4( lights1*baseColor, 1.) *lights ;


    // gl_FragColor = vec4( lights1*baseColor+(0.,1.,0.), 1.) ;

    vec4 lookupColor = texture2D(texture,v_uv);
    gl_FragColor = lookupColor;

}