uniform vec3 uColorSurface;
uniform vec3 uColorDepth;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

void main(){
    float strength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uColorDepth, uColorSurface,vElevation);
    gl_FragColor = vec4(color,1.0);
}