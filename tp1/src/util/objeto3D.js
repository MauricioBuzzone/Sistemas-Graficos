var mat4=glMatrix.mat4;
var mat3=glMatrix.mat3;
var vec3=glMatrix.vec3;
var vec4=glMatrix.vec4;

export class Objeto3D {
    constructor() {
        this.positionBuffer = null;
        this.normalBuffer = null;
        this.indexBuffer = null;
        this.color = [0.5,0.5,0.5]
        this.hijos = [];
        

        this.posición = vec3.fromValues(0,0,0);
        this.rotación = [0,vec3.fromValues(1,0,0)];
        this.escala = vec3.fromValues(1,1,1);

        this.matrizModelado = mat4.identity(mat4.create());
        this.matrizModeladoSinEscala = mat4.identity(mat4.create());
    }
  
    actualizarMatrizModelado() {
        // Método privado para actualizar la matriz de modelado según los atributos posición, rotación y escala
        mat4.identity(this.matrizModelado);
        mat4.translate(this.matrizModelado,this.matrizModelado,this.posición)
        mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotación[0],this.rotación[1])
        mat4.scale(this.matrizModelado,this.matrizModelado,this.escala)
    }

    actualizarMatrizModeladoSinEscala() {
        // Método privado para actualizar la matriz de modelado según los atributos posición, rotación
        mat4.identity(this.matrizModeladoSinEscala);
        mat4.translate(this.matrizModeladoSinEscala,this.matrizModeladoSinEscala,this.posición)
        mat4.rotate(this.matrizModeladoSinEscala,this.matrizModeladoSinEscala,this.rotación[0],this.rotación[1])
    }
  
    dibujar(matPadre, gl,shaderProgram, normal) {
        // Método público para dibujar el objeto en pantalla, se recibe la matriz del padre
        // En este método se llamaría a las funciones pertinentes de WebGL para dibujar el objeto
        // aplicando la matriz de transformación final (matPadre * matrizModelado)
        this.actualizarMatrizModelado()
        let m=mat4.create();
        mat4.multiply(m,matPadre,this.matrizModelado);
  
        if (this.positionBuffer &&  this.normalBuffer && this.indexBuffer){
            
            this.actualizarMatrizModeladoSinEscala()
           
            let m1 = mat4.create();
            mat4.multiply(m1,matPadre,this.matrizModeladoSinEscala);
            
            var normalMatrix = mat4.create();
            mat4.invert(normalMatrix,m1)
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

            const vcolor  = gl.getUniformLocation(shaderProgram, "vColor");
            gl.uniform3f(vcolor, this.color[0],this.color[1],this.color[2]);

            gl.drawElements( gl.TRIANGLE_STRIP, trianglesIndexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);    
            
            if(normal){
                this.dibujarNormales(matPadre, gl, shaderProgram)
            }
        }

        for (var i=0;i<this.hijos.length;i++) this.hijos[i].dibujar(m,gl,shaderProgram, normal);
    }

    dibujarNormales(matPadre, gl, shaderProgram){
        // Creo el buffer de vertices
        if (this.positionBuffer &&  this.normalBuffer && this.indexBuffer){
            var vertices = []
            let escala = this.escala
            for(let i=0; i < this.positionBuffer.length;i +=3){
                var pointNormal = vec3.create()


                var normal = vec3.fromValues(
                    this.normalBuffer[i],
                    this.normalBuffer[i+1],
                    this.normalBuffer[i+2])

                var source = vec3.fromValues(
                        this.positionBuffer[i]*escala[0],
                        this.positionBuffer[i+1]*escala[1],
                        this.positionBuffer[i+2]*escala[2])

                vec3.add(pointNormal,source,normal)
            
                vertices.push(this.positionBuffer[i]*escala[0])
                vertices.push(this.positionBuffer[i+1]*escala[1])
                vertices.push(this.positionBuffer[i+2]*escala[2])

                vertices.push(pointNormal[0])
                vertices.push(pointNormal[1])
                vertices.push(pointNormal[2])
            }

            mat4.identity(this.matrizModelado)
            mat4.translate(this.matrizModelado,this.matrizModelado,this.posición)
            mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotación[0],this.rotación[1])

            let m = mat4.create();
            mat4.multiply(m,matPadre,this.matrizModelado);

            var modelMatrixUniform = gl.getUniformLocation(shaderProgram, "modelMatrix");
            var normalMatrixUniform  = gl.getUniformLocation(shaderProgram, "normalMatrix");

            gl.uniformMatrix4fv(modelMatrixUniform, false,m);
            gl.uniformMatrix4fv(normalMatrixUniform, false,  mat4.identity(mat4.create()));



            const trianglesVerticeBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);    


            const vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
            gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.drawArrays( gl.LINES, 0, vertices.length/3 );
        }
    }
    
    setColor(r,g,b){
        this.color = [r,g,b]
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

    getMatrizModelado(){
        this.actualizarMatrizModelado()
        return this.matrizModelado
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
  