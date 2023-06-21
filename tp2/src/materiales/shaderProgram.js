var mat4=glMatrix.mat4;

export class Phong {
    constructor(gl){
      this.vertexShaderSource =   
      `precision highp float;

      attribute vec3 aVertexPosition;
      attribute vec3 aVertexNormal;
      
      uniform mat4 modelMatrix;            
      uniform mat4 viewMatrix;
      uniform mat4 projMatrix;
      
      uniform mat4 normalMatrix;
      
      varying vec3 vNormal;    
      varying vec3 vPosWorld;  
      
      void main(void) {
          gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(aVertexPosition, 1.0);
      
          vPosWorld=(modelMatrix*vec4(aVertexPosition,1.0)).xyz;    //la posicion en coordenadas de mundo
          vNormal=(normalMatrix*vec4(aVertexNormal,1.0)).xyz;       //la normal en coordenadas de mundo                
          
      }`

      this.fragmentShaderSource =  
      `precision highp float;
      varying vec3 vNormal;
      varying vec3 vPosWorld;
      
      uniform vec3 vColor;
      
      void main(void) {
      
          vec3 lightVec=normalize(vec3(10.0,40.0,10.0)-vPosWorld);
          vec3 diffColor=mix(vec3(0.7,0.7,0.7),vNormal,0.4);
          vec3 color=dot(lightVec,vNormal)*vColor+vec3(0.2,0.2,0.2);
      
          gl_FragColor = vec4(color,1.0);
      }`
      this.gl = gl
      this.shaderProgram = this.initShaders(gl,this.vertexShaderSource,this.fragmentShaderSource)
    }

    getShaderProgram(){
      return this.shaderProgram
    }

    setUpConfing(gl,viewMatrix,projMatrix,modelMatrix){
      this.gl.useProgram(this.shaderProgram)
      this.setMatrixUniforms(gl,viewMatrix,projMatrix,modelMatrix)
    }

    setMatrixUniforms(gl,viewMatrix,projMatrix,modelMatrix){
                      
      var normalMatrix = mat4.create();
      mat4.invert(normalMatrix,modelMatrix)
      mat4.transpose(normalMatrix,normalMatrix)

      var modelMatrixUniform = gl.getUniformLocation(this.shaderProgram, "modelMatrix");
      var normalMatrixUniform  = gl.getUniformLocation(this.shaderProgram, "normalMatrix");
      var viewMatrixUniform  = gl.getUniformLocation(this.shaderProgram, "viewMatrix");
      var projMatrixUniform  = gl.getUniformLocation(this.shaderProgram, "projMatrix");

      gl.uniformMatrix4fv(modelMatrixUniform, false,modelMatrix);
      gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
      gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
      gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    }

    initShaders(gl,vertexShaderSource,fragmentShaderSource) {

      var fragmentShader= getShader(gl, vertexShaderSource,"vertex");
      var vertexShader= getShader(gl, fragmentShaderSource,"fragment");
    
      var shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);
    
      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
          alert("Could not initialise shaders");
      }
    
      return shaderProgram
    }
}

function getShader(gl,code,type) {

  var shader;

  if (type == "fragment") 
      shader = gl.createShader(gl.FRAGMENT_SHADER);
  else // "vertex"
      shader = gl.createShader(gl.VERTEX_SHADER);

  gl.shaderSource(shader, code);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      return null;
  }    
  return shader;
}