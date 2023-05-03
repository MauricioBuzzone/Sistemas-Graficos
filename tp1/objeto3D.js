var mat4=glMatrix.mat4;
var vec3=glMatrix.vec3;


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
        mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotación[0],this.rotación[1])
        mat4.translate(this.matrizModelado,this.matrizModelado,this.posición)
        mat4.scale(this.matrizModelado,this.matrizModelado,this.escala)
    }
  
    dibujar(matPadre, gl, glProgram) {
        // Método público para dibujar el objeto en pantalla, se recibe la matriz del padre
        // En este método se llamaría a las funciones pertinentes de WebGL para dibujar el objeto
        // aplicando la matriz de transformación final (matPadre * matrizModelado)
        this.actualizarMatrizModelado()
        let m=mat4.create();
        mat4.multiply(m,matPadre,this.matrizModelado);
  
        if (this.positionBuffer &&  this.normalBuffer && this.indexBuffer){

            var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
            var normalMatrixUniform  = gl.getUniformLocation(glProgram, "normalMatrix");

            var normalMatrix = mat4.create();
            mat4.invert(normalMatrix,m)
            mat4.transpose(normalMatrix,normalMatrix)

            gl.uniformMatrix4fv(modelMatrixUniform, false,m);
            gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);


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


        
            const vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
            gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            const vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
            gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesIndexBuffer);


        
            gl.drawElements( gl.TRIANGLE_STRIP, trianglesIndexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);    
            
        }

        for (var i=0;i<this.hijos.length;i++) this.hijos[i].dibujar(m,gl, glProgram);
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
}
  