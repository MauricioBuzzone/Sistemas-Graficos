import { Phong2 } from "./shaderProgram.js"


var vertexShaderSource = 
` precision highp float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTexcoord;

uniform mat4 modelMatrix;            
uniform mat4 viewMatrix;
uniform mat4 projMatrix;

uniform mat4 normalMatrix;

varying vec3 vNormal;    
varying vec3 vPosWorld;  
varying vec2 vTexcoord;

void main(void) {
    gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(aVertexPosition, 1.0);

    vPosWorld=(modelMatrix*vec4(aVertexPosition,1.0)).xyz;    //la posicion en coordenadas de mundo
    vNormal=(normalMatrix*vec4(aVertexNormal,1.0)).xyz;       //la normal en coordenadas de mundo                

    // Pass the texcoord to the fragment shader.
    vTexcoord = aTexcoord;  
}`

var fragmentShaderSource = 
`precision highp float;

// Passed in from the vertex shader.
varying highp vec2 vTexcoord;
 
// The texture.
uniform sampler2D u_texture;
 
void main() {
  vec3 color = texture2D(u_texture, vTexcoord).xyz;
  gl_FragColor = vec4(color,1.0);
}` 

export class Textured extends Phong2{
  constructor(gl,texture_file){
    super(gl)
    this.gl = gl
    this.shaderProgram = this.initShaders(gl,vertexShaderSource,fragmentShaderSource)
    
    this.image =  new Image();
    this.image.onload = () => {
      this.texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.texture);

      // Configura los parámetros de la textura
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      // Carga la imagen en la textura
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
      
      // Limpia los recursos
      gl.bindTexture(gl.TEXTURE_2D, null);

    };
    this.image.src = texture_file;
  }

  setMatrixUniforms(gl,viewMatrix,projMatrix,modelMatrix){

    // Obtén la ubicación de la variable uniforme en el fragment shader
    var textureLocation = gl.getUniformLocation(this.shaderProgram, 'u_texture');

    // Activa la textura en una unidad de textura específica (por ejemplo, unidad 0)
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    // Asigna la unidad de textura al uniforme del fragment shader
    gl.uniform1i(textureLocation, 0);
  
    super.setMatrixUniforms(gl,viewMatrix,projMatrix,modelMatrix)
  
  }
}


export class Textured2 extends Phong2{
  constructor(gl,texture_file){
    super(gl)
    this.gl = gl
    this.shaderProgram = this.initShaders(gl,vertexShaderSource,fragmentShaderSource)
    
    this.image =  new Image();
    this.image.onload = () => {
      this.texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.texture);

      // Configura los parámetros de la textura
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      // Carga la imagen en la textura
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
      
      // Limpia los recursos
      gl.bindTexture(gl.TEXTURE_2D, null);

    };
    this.image.src = texture_file;
  }

  setMatrixUniforms(gl,viewMatrix,projMatrix,modelMatrix){

    // Obtén la ubicación de la variable uniforme en el fragment shader
    var textureLocation = gl.getUniformLocation(this.shaderProgram, 'u_texture');

    // Activa la textura en una unidad de textura específica (por ejemplo, unidad 0)
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    // Asigna la unidad de textura al uniforme del fragment shader
    gl.uniform1i(textureLocation, 0);
  
    super.setMatrixUniforms(gl,viewMatrix,projMatrix,modelMatrix)
  
  }
}