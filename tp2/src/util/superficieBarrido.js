import { Punto } from "./punto.js";
var mat4=glMatrix.mat4;
var vec3=glMatrix.vec3;
var vec4=glMatrix.vec4;

export class SuperficieBarrido {
    constructor(poligono, recorrido) {
        this.poligono = poligono 
        this.recorrido = recorrido
    }

    getBuffers(poligono,recorrido) {
      this.poligono = poligono 
      this.recorrido = recorrido
      let positionBuffer = this.getPositionBuffer()
      let normalBuffer = this.getNormalBuffer()
      let indexBuffer = this.getIndexBuffer()

      return [positionBuffer,normalBuffer,indexBuffer]
    }

    getPositionBuffer() {
        let positionBuffer = [];
    
        for (let i = 0; i < this.recorrido.length; i++) {
          let matrizDeNivel = this.recorrido[i];
   
          for (let j = 0; j < this.poligono.length; j++) {
            let vertice = this.poligono[j].getCoords();    

            let verticeNiveli = vec4.create()
            
            vec4.transformMat4(
              verticeNiveli,
              vec4.fromValues(vertice[0],vertice[1],vertice[2],1.0),
              matrizDeNivel)
            
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
          let matrizDeNivel = this.recorrido[i];
          var normalMatrix = mat4.create();
          mat4.invert(normalMatrix,matrizDeNivel)
          mat4.transpose(normalMatrix,normalMatrix)



          for (let j = 0; j < sizePoligono; j++) {

            let normalpol = this.poligono[j].getNormal();
            let normal = vec4.create()
            vec4.transformMat4(
              normal,
              vec4.fromValues(normalpol[0],normalpol[1],normalpol[2],1.0),
              normalMatrix)

            vec3.normalize(normal, normal);
          
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

          let index_vert_sup = j + i  * columnas_vertices
          let index_vert_inf = j + (i + 1) * columnas_vertices

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

    getUVBuffer(){
      var uvBuffer = []
      
    }
}