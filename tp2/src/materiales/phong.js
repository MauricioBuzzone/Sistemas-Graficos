var mat4=glMatrix.mat4;

var vertexShaderSource = 
    `precision highp float;

    attribute vec3 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec3 aTexcoord;

    uniform mat4 modelMatrix;            
    uniform mat4 viewMatrix;
    uniform mat4 projMatrix;
    uniform mat4 normalMatrix;

    varying vec3 vPosWorld;
    varying vec3 vNormal;

    void main() {

        gl_Position = projMatrix * viewMatrix * modelMatrix  * vec4(aVertexPosition, 1.0);

        vPosWorld=(modelMatrix*vec4(aVertexPosition,1.0)).xyz;    //la posicion en coordenadas de mundo
        vNormal=(normalMatrix*vec4(aVertexNormal,1.0)).xyz;       //la normal en coordenadas de mundo       
    }
`

var fragmentShaderSource = 
    `precision highp float;

    varying vec3 vPosWorld;
    varying vec3 vNormal;

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
        vec3 diffuseColor = u_diffuseColor * diffuse * u_lightColor;
        vec3 specularColor = u_specularColor * specular * u_lightColor;

        vec3 finalColor = ambient + diffuseColor + specularColor ;

        gl_FragColor = vec4(finalColor, 1.0);
    }
` 


export class Phong {
    constructor(gl){
        this.gl = gl
        this.shaderProgram = this.initShaders(gl)

        this.lightPos = [20,70,20]
        this.lightColor = [1,1,1]
        this.ambientColor = [0.25,0.25,0.25]
        this.diffuseColor = [0.15,0.15,0.15]
        this.specularColor = [0.5,0.5,0.5]
        this.shininess = 36
    }

    setUpConfing(gl,viewMatrix,projMatrix,modelMatrix,eyePos){
        this.gl.useProgram(this.shaderProgram)
        this.setMatrixUniforms(gl,viewMatrix,projMatrix,modelMatrix)
        this.setPhongComponent(eyePos)
    }

    draw(){
        const gl = this.gl
        gl.drawElements( gl.TRIANGLE_STRIP, this.trianglesIndexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);  
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
    }

    setConfig(lightPos,lightColor,ambientColor,diffuseColor,specularColor,shininess){
        this.lightPos = lightPos
        this.lightColor = lightColor
        this.ambientColor = ambientColor
        this.diffuseColor = diffuseColor
        this.specularColor = specularColor
        this.shininess = shininess
    }

    getShaderProgram(){
        return this.shaderProgram
    }

    setPhongComponent(eyePos){
        var gl = this.gl
        var shaderProgram = this.shaderProgram

        const lightPos  = gl.getUniformLocation(shaderProgram, "u_lightPos");
        gl.uniform3f(lightPos, this.lightPos[0],this.lightPos[1],this.lightPos[2]);

        const lightColor  = gl.getUniformLocation(shaderProgram, "u_lightColor");
        gl.uniform3f(lightColor, this.lightColor[0],this.lightColor[1],this.lightColor[2]);

        const ambientColor  = gl.getUniformLocation(shaderProgram, "u_ambientColor");
        gl.uniform3f(ambientColor, this.ambientColor[0],this.ambientColor[1],this.ambientColor[2]);

        const diffuseColor  = gl.getUniformLocation(shaderProgram, "u_diffuseColor");
        gl.uniform3f(diffuseColor, this.diffuseColor[0],this.diffuseColor[1],this.diffuseColor[2]);

        const specularColor  = gl.getUniformLocation(shaderProgram, "u_specularColor");
        gl.uniform3f(specularColor, this.specularColor[0],this.specularColor[1],this.specularColor[2]);

        const shininess  = gl.getUniformLocation(shaderProgram, "u_shininess");
        gl.uniform1f(shininess, this.shininess);

        const eyePosition  = gl.getUniformLocation(shaderProgram, "u_eyePos");
        gl.uniform3f(eyePosition, eyePos[0],eyePos[1],eyePos[2]);
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