var mat4=glMatrix.mat4;
var vec3=glMatrix.vec3;
var vec4=glMatrix.vec4;

export class Objeto3D {
    constructor() {
        this.positionBuffer = null;
        this.normalBuffer = null;
        this.indexBuffer = null;

        this.hijos = [];
        

        this.posición = vec3.fromValues(0,0,0);
        this.rotación = [0,vec3.fromValues(1,0,0)];
        this.escala = vec3.fromValues(1,1,1);

        this.matrizModelado = mat4.identity(mat4.create());
    }
  
    actualizarMatrizModelado() {
        // Método privado para actualizar la matriz de modelado según los atributos posición, rotación y escala
        mat4.identity(this.matrizModelado);
        mat4.translate(this.matrizModelado,this.matrizModelado,this.posición)
        mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotación[0],this.rotación[1])
        mat4.scale(this.matrizModelado,this.matrizModelado,this.escala)
    }
  
    dibujar(matPadre, gl, viewMatrix, projMatrix) {
        // Método público para dibujar el objeto en pantalla, se recibe la matriz del padre
        // En este método se llamaría a las funciones pertinentes de WebGL para dibujar el objeto
        // aplicando la matriz de transformación final (matPadre * matrizModelado)
        this.actualizarMatrizModelado()
        let m=mat4.create();
        mat4.multiply(m,matPadre,this.matrizModelado);
  
        if (this.positionBuffer &&  this.normalBuffer && this.indexBuffer){

 
            var vertCode = 
            `precision highp float;`+
            `attribute vec3 aVertexPosition;`+
            `attribute vec3 aVertexNormal;`+
            `uniform mat4 modelMatrix;`+            
            `uniform mat4 viewMatrix;`+
            `uniform mat4 projMatrix;`+
            `uniform mat4 normalMatrix;`+
            `varying vec3 vNormal;`+
            `varying vec3 vPosWorld;`+

            `void main(void)`+
            `{`+
                `gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(aVertexPosition, 1.0);`+
                `vPosWorld=(modelMatrix*vec4(aVertexPosition,1.0)).xyz;`+
                `vNormal=(normalMatrix*vec4(aVertexNormal,1.0)).xyz;`+                
                
                `}`;
            var vertShader = gl.createShader( gl.VERTEX_SHADER );
            gl.shaderSource( vertShader, vertCode );        
            gl.compileShader( vertShader );
            if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
                alert("Error compiling shader: " + gl.getShaderInfoLog(vertShader));
            }


            var fragCode = 
                `precision highp float;`+
                `varying vec3 vNormal;`+
                `varying vec3 vPosWorld;`+
                `void main(void)`+
                `{`+
                    `vec3 lightVec=normalize(vec3(10.0,30.0,10.0)-vPosWorld);`+
                    `vec3 diffColor=mix(vec3(0.7,0.7,0.7),vNormal,0.4);`+
                    `vec3 color=dot(lightVec,vNormal)*diffColor+vec3(0.2,0.2,0.2);`+
                    `gl_FragColor = vec4(color,1.0);`+
                `}`;

            var fragShader = gl.createShader( gl.FRAGMENT_SHADER );
            gl.shaderSource( fragShader, fragCode );
            gl.compileShader( fragShader );
            if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
                alert("Error compiling shader: " + gl.getShaderInfoLog(fragShader));
            }

            var shaderProgram = gl.createProgram( );
            gl.attachShader( shaderProgram, vertShader );
            gl.attachShader( shaderProgram, fragShader );
            gl.linkProgram( shaderProgram );

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                alert("Unable to initialize the shader program.");
            }
            
            gl.useProgram(shaderProgram);


            var normalMatrix = mat4.create();
            mat4.invert(normalMatrix,m)
            mat4.transpose(normalMatrix,normalMatrix)


            const trianglesVerticeBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positionBuffer), gl.STATIC_DRAW);    
        
            const trianglesNormalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalBuffer), gl.STATIC_DRAW);

            const trianglesIndexBuffer = gl.createBuffer();
            trianglesIndexBuffer.number_vertex_point = this.indexBuffer.length;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexBuffer), gl.STATIC_DRAW);


        
            const vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
            gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            const vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
            gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesIndexBuffer);
            

            var modelMatrixUniform = gl.getUniformLocation(shaderProgram, "modelMatrix");
            var normalMatrixUniform  = gl.getUniformLocation(shaderProgram, "normalMatrix");
            gl.uniformMatrix4fv(modelMatrixUniform, false,m);
            gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);


            var viewMatrixUniform  = gl.getUniformLocation(shaderProgram, "viewMatrix");
            var projMatrixUniform  = gl.getUniformLocation(shaderProgram, "projMatrix");
            gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
            gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);


            gl.drawElements( gl.TRIANGLE_STRIP, trianglesIndexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);    
            
            //this.dibujarNormales(gl)
        }

        for (var i=0;i<this.hijos.length;i++) this.hijos[i].dibujar(m,gl,viewMatrix,projMatrix);
    }

    dibujarNormales(gl){
        // Creo el buffer de vertices
        var vertices = []

        for(let i=0; i < this.positionBuffer.length;i +=3){
            var pointNormal = vec3.create()
            
            var normal = vec3.fromValues(
                this.normalBuffer[i],
                this.normalBuffer[i+1],
                this.normalBuffer[i+2])

            var source = vec3.fromValues(
                    this.positionBuffer[i],
                    this.positionBuffer[i+1],
                    this.positionBuffer[i+2])

            vec3.add(pointNormal,source,normal)
        
            vertices.push(this.positionBuffer[i])
            vertices.push(this.positionBuffer[i+1])
            vertices.push(this.positionBuffer[i+2])

            vertices.push(pointNormal[0])
            vertices.push(pointNormal[1])
            vertices.push(pointNormal[2])
        }

        var vertex_buffer = gl.createBuffer( );
        gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );
        gl.bindBuffer( gl.ARRAY_BUFFER, null );

        var vertCode = 
            'attribute vec3 coordinates;' +

            'void main(void)' +

            '{' +

                ' gl_Position = vec4(coordinates, 1.0);' +

            '}';

        var vertShader = gl.createShader( gl.VERTEX_SHADER );
        gl.shaderSource( vertShader, vertCode );

        gl.compileShader( vertShader );

        var fragCode = 
            'void main(void)' +
            '{' +
                ' gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
            '}';

        var fragShader = gl.createShader( gl.FRAGMENT_SHADER );
        gl.shaderSource( fragShader, fragCode );
        gl.compileShader( fragShader );

        var shaderProgram = gl.createProgram( );
        gl.attachShader( shaderProgram, vertShader );
        gl.attachShader( shaderProgram, fragShader );
        gl.linkProgram( shaderProgram );

        gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer );

        var coord = gl.getAttribLocation( shaderProgram, "coordinates" );

        gl.vertexAttribPointer( coord, 3, gl.FLOAT, false, 0, 0 );

        gl.enableVertexAttribArray( coord );

        gl.drawArrays( gl.LINES, 0, vertices.length/3 );
    }
  
    setGeometria(posBuffer, nrmBuffer, indexBuffer) {
        // Método público para establecer los buffers de posición, normal e índice
        this.positionBuffer = posBuffer;
        this.normalBuffer = nrmBuffer;
        this.indexBuffer = indexBuffer;
    }

    setPosicion(posición) {
        this.posición = posición
    }
     
    getPosicion(){
        return this.posición
    }

    setEscala(escala) {
        this.escala = escala
    }
    
    setRotacion(rotación) {
        this.rotación = rotación
    }
  
    agregarHijo(hijo) {
        // Método público para agregar un hijo al objeto
        this.hijos.push(hijo);
    }
  
    quitarHijo(hijo) {
        // Método público para quitar un hijo del objeto
        const index = this.hijos.indexOf(hijo);
        if (index !== -1) {
            this.hijos.splice(index, 1);
        }
    }

    localToWorld(pos){
        let worldPost = vec4.create()
        this.actualizarMatrizModelado()
        vec4.transformMat4(
            worldPost,
            vec4.fromValues(pos[0],pos[1],pos[2],1.0),
            this.matrizModelado)
        
        return worldPost
    }
}
  