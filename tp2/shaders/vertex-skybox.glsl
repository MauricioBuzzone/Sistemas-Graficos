 precision highp float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 a_texcoord;

uniform mat4 modelMatrix;            
uniform mat4 viewMatrix;
uniform mat4 projMatrix;

uniform mat4 normalMatrix;

varying vec3 vNormal;    
varying vec3 vPosWorld;  
varying vec2 v_texcoord;

void main(void) {
    gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(aVertexPosition, 1.0);

    vPosWorld=(modelMatrix*vec4(aVertexPosition,1.0)).xyz;    //la posicion en coordenadas de mundo
    vNormal=(normalMatrix*vec4(aVertexNormal,1.0)).xyz;       //la normal en coordenadas de mundo                

    // Pass the texcoord to the fragment shader.
    v_texcoord = a_texcoord;  
}