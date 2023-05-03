var mat4=glMatrix.mat4;
var vec3=glMatrix.vec3;
var vec4=glMatrix.vec4;

export class SuperficieBarrido {
    constructor(poligono, recorrido) {
        this.poligono = poligono 
        this.recorrido = recorrido
    }

    getPositionBuffer() {
        let positionBuffer = [];

        for (let i = 0; i < this.recorrido.length; i++) {
          let matrizDeNivel = this.recorrido[i];
          console.log("Matriz de nivel",i,matrizDeNivel)

          for (let j = 0; j < this.poligono.length; j++) {
            let vertice = this.poligono[j];     
            let verticeNiveli = vec4.create()
            
            console.log(glMatrix.vec4.transformMat4(
              verticeNiveli,
              vec4.fromValues(vertice[0],vertice[1],vertice[2],1.0),
              matrizDeNivel))
            
            console.log("Vertice convertido",verticeNiveli)
            positionBuffer.push(verticeNiveli[0])
            positionBuffer.push(verticeNiveli[1])
            positionBuffer.push(verticeNiveli[2])
          }

        }
        return positionBuffer;
      }


    getNormalBuffer() {
        let normalBuffer = [];
        let sizePoligono = this.poligono.length;
   

        for (let i = 0; i < this.recorrido.length; i++) {

          for (let j = 0; j < sizePoligono; j++) {
            let vertice = this.poligono[j];
            let siguiente = this.poligono[(j + 1) % sizePoligono];

            
            let tangente = glMatrix.vec3.sub(
              glMatrix.vec3.create(),
              vertice,
              siguiente
            );

            let normal = glMatrix.vec3.cross(
              glMatrix.vec3.create(),
              tangente,
              vec3.fromValues(0,0,-1)
            );
            normal = glMatrix.vec3.normalize(glMatrix.vec3.create(), normal);

            normalBuffer.push(normal[0])
            normalBuffer.push(normal[1])
            normalBuffer.push(normal[2])
          }

        }
        return normalBuffer;
      }

    getIndexBuffer(){

      var indexBuffer=[];  
      var filas_vertices = this.recorrido.length
      var columnas_vertices =  this.poligono.length
        
        
      for (let i=0; i < filas_vertices - 1 ; i++) {
        for (let j=0; j < columnas_vertices ; j++) {

          index_vert_sup = j + i  * columnas_vertices
          index_vert_inf = j + (i + 1) * columnas_vertices

          indexBuffer.push(index_vert_sup)
          indexBuffer.push(index_vert_inf)
        }

        if (i < filas_vertices - 2){
          indexBuffer.push((i + 2)* columnas_vertices - 1)
          indexBuffer.push((i + 1)* columnas_vertices)
        }
      }
      return indexBuffer;
    }
}