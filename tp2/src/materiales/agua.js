import { Phong } from "./phong.js";
var mat4=glMatrix.mat4;

var vertexShaderSource = 
    `precision highp float;

    attribute vec3 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec3 aVertexTang;
    attribute vec3 aVertexBiNormal;

    attribute vec2 aTexcoord;

    uniform mat4 modelMatrix;            
    uniform mat4 viewMatrix;
    uniform mat4 projMatrix;
    uniform mat4 normalMatrix;

    varying vec3 vPosWorld;
    varying vec3 vNormal;
    varying vec3 vTang;
    varying vec3 vBiNormal;

    varying vec2 vTexcoord;
    void main() {

        gl_Position = projMatrix * viewMatrix * modelMatrix  * vec4(aVertexPosition, 1.0);

        vPosWorld = (modelMatrix*vec4(aVertexPosition,1.0)).xyz;    //la posicion en coordenadas de mundo
        vNormal = (normalMatrix*vec4(aVertexNormal,1.0)).xyz;       //la normal en coordenadas de mundo
        vTang = (normalMatrix*vec4(aVertexTang,1.0)).xyz;           //la tangente en coordenadas de mundo
        vBiNormal = (normalMatrix*vec4(aVertexBiNormal,1.0)).xyz;   //la binormal en coordenadas de mundo 

        vTexcoord = aTexcoord;
    }
`

var fragmentShaderSource = 
    `precision highp float;

    varying vec3 vPosWorld;
    varying vec3 vNormal;
    varying vec3 vTang;
    varying vec3 vBiNormal;
    
    varying highp vec2 vTexcoord;
    
    uniform samplerCube u_texture;
    uniform sampler2D u_normalMap;

    uniform vec3 u_eyePos;
    uniform vec3 u_lightPos;
    uniform vec3 u_lightColor;
    uniform vec3 u_ambientColor;
    uniform vec3 u_diffuseColor;
    uniform vec3 u_specularColor;
    uniform float u_shininess;

    void main() {


        // Calculo Normal
        vec3 localNormal = texture2D(u_normalMap, vTexcoord).xyz;

        /* Transform */
        vec3 normal = normalize ( localNormal.rgb * 2.0 - 1.0);;
        normal = normalize( mat3 (vTang, vBiNormal, vNormal)* normal);

        
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

        // SOLO REFLEJO
        // normal = normalize(vNormal);

        vec3 reflection = reflect(-viewDir, normal); 
        vec3 color = textureCube(u_texture, reflection).xyz;
    
        vec3 diffuseColor = color * diffuse * u_lightColor;
        vec3 specularColor = u_specularColor * specular * u_lightColor;

        vec3 finalColor =  diffuseColor +specularColor;
   


        gl_FragColor = vec4(finalColor, 0.6);

        //gl_FragColor = vec4(color,0.6);
    

    }
` 


export class Agua extends Phong{
    constructor(gl,texture_file,normal_texture_file){
        super(gl)


    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    
    const faceInfos = [
    {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, 
        url: './maps/px.png',
    },
    {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
        url: './maps/nx.png',
    },
    {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 
        url: './maps/py.png',
    },
    {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
        url: './maps/ny.png',
    },
    {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 
        url: './maps/pz.png',
    },
    {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 
        url: './maps/nz.png',
    },
    ];
    faceInfos.forEach((faceInfo) => {
        const {target, url} = faceInfo;
       
        // Upload the canvas to the cubemap face.
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 512;
        const height = 512;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
       
        // setup each face so it's immediately renderable
        gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);
       
        // Asynchronously load an image
        const image = new Image();
        image.src = url;
        image.addEventListener('load', function() {
          // Now that the image has loaded upload it to the texture.
          gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
          gl.texImage2D(target, level, internalFormat, format, type, image);
          gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        });
      });
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    this.texture = texture

    this.normalMap =  new Image();
    this.normalMap.onload = () => {
        this.normaltexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.normaltexture);

        // Configura los parámetros de la textura
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // Carga la imagen en la textura
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.normalMap);
        
        // Limpia los recursos
        gl.bindTexture(gl.TEXTURE_2D, null);

    };
    this.normalMap.src = normal_texture_file;


    this.initShaders(gl)
    }

    setUpConfing(gl,viewMatrix,projMatrix,modelMatrix,eyePos){
        this.gl.useProgram(this.shaderProgram)
        this.setMatrixUniforms(gl,viewMatrix,projMatrix,modelMatrix)
        this.setPhongComponent(eyePos)
    }

    setBuffers(positionBuffer,normalBuffer,indexBuffer,uvBuffer,tangBuffer,binBuffer){
        const gl = this.gl
        const shaderProgram = this.shaderProgram

        const trianglesVerticeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);    
    
        const trianglesNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);

        const trianglesIndexBuffer = gl.createBuffer();
        trianglesIndexBuffer.number_vertex_point = indexBuffer.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);

        this.trianglesIndexBuffer = trianglesIndexBuffer

        const vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        const vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        gl.enableVertexAttribArray(vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
        gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesIndexBuffer);

        const trianglesUVBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesUVBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);

        const vertexUVAttribute = gl.getAttribLocation(shaderProgram, "aTexcoord");
        gl.enableVertexAttribArray(vertexUVAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesUVBuffer);
        gl.vertexAttribPointer(vertexUVAttribute, 2, gl.FLOAT, false, 0, 0);

        const trianglesTangBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesTangBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangBuffer), gl.STATIC_DRAW);    
    
        const trianglesBiNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesBiNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(binBuffer), gl.STATIC_DRAW);


        const vertexTangAttribute = gl.getAttribLocation(shaderProgram, "aVertexTang");
        gl.enableVertexAttribArray(vertexTangAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesTangBuffer);
        gl.vertexAttribPointer(vertexTangAttribute, 3, gl.FLOAT, false, 0, 0);

        const vertexBiNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexBiNormal");
        gl.enableVertexAttribArray(vertexBiNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesBiNormalBuffer);
        gl.vertexAttribPointer(vertexBiNormalAttribute, 3, gl.FLOAT, false, 0, 0);
    }

    setPhongComponent(eyePos){
        super.setPhongComponent(eyePos)
        var gl = this.gl

        var textureLocation = gl.getUniformLocation(this.shaderProgram, 'u_texture');

        // Activa la textura en una unidad de textura específica (por ejemplo, unidad 0)
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);

        // Asigna la unidad de textura al uniforme del fragment shader
        gl.uniform1i(textureLocation, 0);


        var normalTextureLocation = gl.getUniformLocation(this.shaderProgram, 'u_normalMap');
        
        // Activa la textura en una unidad de textura específica
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.normaltexture);

        // Asigna la unidad de textura al uniforme del fragment shader
        gl.uniform1i(normalTextureLocation, 1);
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