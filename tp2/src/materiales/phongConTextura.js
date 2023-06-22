import { Phong } from "./phong.js";
var mat4=glMatrix.mat4;

var vertexShaderSource = 
    `precision highp float;

    attribute vec3 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTexcoord;

    uniform mat4 modelMatrix;            
    uniform mat4 viewMatrix;
    uniform mat4 projMatrix;
    uniform mat4 normalMatrix;

    varying vec3 vPosWorld;
    varying vec3 vNormal;
    varying vec2 vTexcoord;
    void main() {

        gl_Position = projMatrix * viewMatrix * modelMatrix  * vec4(aVertexPosition, 1.0);

        vPosWorld=(modelMatrix*vec4(aVertexPosition,1.0)).xyz;    //la posicion en coordenadas de mundo
        vNormal=(normalMatrix*vec4(aVertexNormal,1.0)).xyz;       //la normal en coordenadas de mundo       
        vTexcoord = aTexcoord;
    }
`

var fragmentShaderSource = 
    `precision highp float;

    varying vec3 vPosWorld;
    varying vec3 vNormal;
    
    varying highp vec2 vTexcoord;
    uniform sampler2D u_texture;

    uniform vec3 u_eyePos;
    uniform vec3 u_lightPos;
    uniform vec3 u_lightColor;
    uniform vec3 u_ambientColor;
    uniform vec3 u_diffuseColor;
    uniform vec3 u_specularColor;
    uniform float u_shininess;

    void main() {
        vec3 normal = normalize(vNormal);
        vec3 lightVec = normalize(u_lightPos - vPosWorld);
        vec3 viewDir = normalize(u_eyePos - vPosWorld);

        // Compute the diffuse term
        float diffuse = max(dot(normal,lightVec), 0.0);

        // Compute the specular term
        vec3 reflectDir = reflect(-lightVec, normal);
        float specAngle = max(dot(reflectDir, viewDir), 0.0);
        float specular = pow(specAngle, u_shininess);
        
        //float viewAngle = max(dot(normal,lightVec), 0.0);
        //vec3 reflection = normalize(2.0*viewAngle*normal - lightVec);
        //float specular = pow(max(dot(reflection, viewDir), 0.0), u_shininess);

        // Compute the final color
        vec3 ambient = u_ambientColor;

        vec3 color = texture2D(u_texture, vTexcoord).xyz;
        vec3 diffuseColor = color * diffuse * u_lightColor;
        vec3 specularColor = u_specularColor * specular * u_lightColor;

        vec3 finalColor = ambient + diffuseColor + specularColor ;

        gl_FragColor = vec4(finalColor, 1.0);
    }
` 


export class PhongConTextura extends Phong{
    constructor(gl,texture_file){
        super(gl)

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
        this.initShaders(gl)
    }

    setUpConfing(gl,viewMatrix,projMatrix,modelMatrix,eyePos){
        this.gl.useProgram(this.shaderProgram)
        this.setMatrixUniforms(gl,viewMatrix,projMatrix,modelMatrix)
        this.setPhongComponent(eyePos)
    }


    setPhongComponent(eyePos){
        super.setPhongComponent(eyePos)
        var gl = this.gl

        var textureLocation = gl.getUniformLocation(this.shaderProgram, 'u_texture');

        // Activa la textura en una unidad de textura específica (por ejemplo, unidad 0)
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        // Asigna la unidad de textura al uniforme del fragment shader
        gl.uniform1i(textureLocation, 0);
    }

    initShaders(gl) {
        var vertexShader= getShader(gl, vertexShaderSource,"vertex");
        var fragmentShader = getShader(gl, fragmentShaderSource,"fragment");
      
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
        alert(gl.getShaderInfoLog(shader));
        return null;
    }    
    return shader;
  }