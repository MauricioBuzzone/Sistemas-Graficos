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
    `precision mediump float;

    varying vec3 vPosWorld;
    varying vec3 vNormal;
    varying highp vec2 vTexcoord;

    
    uniform sampler2D uSampler0;
    uniform sampler2D uSampler1;
    uniform sampler2D uSampler2;
    
    // Perlin Noise						
                
    vec3 mod289(vec3 x)
    {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 mod289(vec4 x)
    {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 permute(vec4 x)
    {
      return mod289(((x*34.0)+1.0)*x);
    }

    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

    vec3 fade(vec3 t) {
      return t*t*t*(t*(t*6.0-15.0)+10.0);
    }

    // Classic Perlin noise
    float cnoise(vec3 P)
    {
      vec3 Pi0 = floor(P); // Integer part for indexing
      vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
      Pi0 = mod289(Pi0);
      Pi1 = mod289(Pi1);
      vec3 Pf0 = fract(P); // Fractional part for interpolation
      vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = Pi0.zzzz;
      vec4 iz1 = Pi1.zzzz;

      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);

      vec4 gx0 = ixy0 * (1.0 / 7.0);
      vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
      gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5);
      gy0 -= sz0 * (step(0.0, gy0) - 0.5);

      vec4 gx1 = ixy1 * (1.0 / 7.0);
      vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
      gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(0.0, gx1) - 0.5);
      gy1 -= sz1 * (step(0.0, gy1) - 0.5);

      vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
      vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
      vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
      vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
      vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
      vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
      vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
      vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

      vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
      g000 *= norm0.x;
      g010 *= norm0.y;
      g100 *= norm0.z;
      g110 *= norm0.w;
      vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
      g001 *= norm1.x;
      g011 *= norm1.y;
      g101 *= norm1.z;
      g111 *= norm1.w;

      float n000 = dot(g000, Pf0);
      float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
      float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
      float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
      float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
      float n111 = dot(g111, Pf1);

      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
      return 2.2 * n_xyz;
    }

    
    
    // ***************************************************************************
    
    
    
    void main(void) {

        // uSampler0: tierra
        // uSampler1: roca
        // uSampler2: pasto
    
        float scale1 = 3.0;
		float low = -0.5;
	    float high = -0.5;
       
       // sampleo el pasto a diferentes escalas
       vec3 pasto1=texture2D(uSampler2,vTexcoord).xyz;
       vec3 pasto2=texture2D(uSampler2,vTexcoord*3.77*scale1).xyz;
       vec3 pasto3=texture2D(uSampler2,vTexcoord*2.11*scale1).xyz;
       
       // sampleo la tierra a diferentes escalas
       vec3 tierra1=texture2D(uSampler0,vTexcoord*4.0*scale1).xyz;
       vec3 tierra2=texture2D(uSampler0,vTexcoord*2.77*scale1).xyz;
       
       // sampleo la roca
       vec3 roca=texture2D(uSampler1,vTexcoord*2.77*scale1).xyz;
       
       // combino los 3 sampleos del pasto con la funcion de mezcla
       vec3 color1=mix(mix(pasto1,pasto2,0.5),pasto3,0.3);
       vec3 pasto = mix(mix(pasto1,pasto2,0.5),pasto3,0.3);


       // genero una mascara 1 a partir de ruido perlin
       float noise1=cnoise(vTexcoord.xyx*8.23*scale1+23.11);
       float noise2=cnoise(vTexcoord.xyx*11.77*scale1+9.45);
       float noise3=cnoise(vTexcoord.xyx*14.8*scale1+21.2);
       
       float mask1=mix(mix(noise1,noise2,0.5),noise3,0.3);		
       mask1=smoothstep(-0.3,0.5,mask1);
       
       // combino tierra y roca usando la mascara 1
       vec3 color2=mix(mix(tierra1,tierra2,0.5),roca,mask1);
       
       // genero la mascara 2 a partir del ruido perlin
       float noise4=cnoise(vTexcoord.xyx*8.23*scale1);
       float noise5=cnoise(vTexcoord.xyx*11.77*scale1);
       float noise6=cnoise(vTexcoord.xyx*14.8*scale1);
       
       float mask2=mix(mix(noise4,noise5,0.5),noise6,0.3);			   
       mask2=smoothstep(low,high,mask2);
       
       // combino color1 (tierra y rocas) con color2 a partir de la mascara2
       vec3 color=mix(color1,color2,mask2);			   
                      
        if (vPosWorld.y > -1.4){
            gl_FragColor = vec4(pasto,1.0);
        }

        else if (-1.5 < vPosWorld.y && vPosWorld.y < -1.4){
            float procentaje = 1.0-(vPosWorld.y + 1.5)/(-1.4+1.5);

            vec3 mixPascoRoca=mix(mix(pasto1,pasto2,0.5),roca,procentaje);
            gl_FragColor = vec4(mixPascoRoca,1.0);
        }
        
        else if (-2.0 < vPosWorld.y && vPosWorld.y < -1.5){
            gl_FragColor = vec4(roca,1.0);
        }
        else if (-3.0 < vPosWorld.y && vPosWorld.y < -2.0){
            float procentaje = 1.0-(vPosWorld.y + 3.0)/(-2.0+3.0);

            vec3 mixTierraRoca=mix(roca,color2,procentaje);
            gl_FragColor = vec4(mixTierraRoca,1.0);
        }
        else if (-4.0 < vPosWorld.y && vPosWorld.y < -3.0){
            gl_FragColor = vec4(color2,1.0);
        }

        else if (-5.0 < vPosWorld.y && vPosWorld.y < -4.0){
            float procentaje = 1.0-(vPosWorld.y + 5.0)/(-4.0+5.0);

            vec3 mixTierraRoca=mix(color2,tierra1,procentaje);
            gl_FragColor = vec4(mixTierraRoca,1.0);
        }
        else {
            gl_FragColor = vec4(tierra1,1.0);
        }

      

       //gl_FragColor = vec4(mask1,mask1,mask1,1.0);			   
       
       
    }
` 


export class PhongTerreno extends Phong{
    constructor(gl,){
        super(gl)

        var grass_file = './maps/pasto1.jpg'
        var rock_file = './maps/rocas2.jpg'
        var dirt_file = './maps/tierra1.jpg'
        this.grass =  new Image();
        this.grass.onload = () => {
          this.grasstexture = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, this.grasstexture);
    
          // Configura los parámetros de la textura
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
          // Carga la imagen en la textura
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.grass);
          
          // Limpia los recursos
          gl.bindTexture(gl.TEXTURE_2D, null);
    
        };
        this.grass.src = grass_file;

        this.rock =  new Image();
        this.rock.onload = () => {
          this.rocktexture = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, this.rocktexture);
    
          // Configura los parámetros de la textura
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
          // Carga la imagen en la textura
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.rock);
          
          // Limpia los recursos
          gl.bindTexture(gl.TEXTURE_2D, null);
    
        };
        this.rock.src = rock_file;

        this.dirt =  new Image();
        this.dirt.onload = () => {
          this.dirttexture = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, this.dirttexture);
    
          // Configura los parámetros de la textura
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
          // Carga la imagen en la textura
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.dirt);
          
          // Limpia los recursos
          gl.bindTexture(gl.TEXTURE_2D, null);
    
        };
        this.dirt.src = dirt_file;

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
    }


    setPhongComponent(eyePos){
        super.setPhongComponent(eyePos)
        var gl = this.gl

        var grass = gl.getUniformLocation(this.shaderProgram, 'uSampler2');

        // Activa la textura en una unidad de textura específica (por ejemplo, unidad 0)
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.grasstexture);

        // Asigna la unidad de textura al uniforme del fragment shader
        gl.uniform1i(grass, 2);

        var rock = gl.getUniformLocation(this.shaderProgram, 'uSampler1');

        // Activa la textura en una unidad de textura específica (por ejemplo, unidad 0)
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.rocktexture);

        // Asigna la unidad de textura al uniforme del fragment shader
        gl.uniform1i(rock, 1);


        var dirt = gl.getUniformLocation(this.shaderProgram, 'uSampler0');

        // Activa la textura en una unidad de textura específica (por ejemplo, unidad 0)
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.dirttexture);

        // Asigna la unidad de textura al uniforme del fragment shader
        gl.uniform1i(dirt, 0);
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