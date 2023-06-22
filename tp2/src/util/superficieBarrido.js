import { Punto } from "./punto.js";
var mat4=glMatrix.mat4;
var vec3=glMatrix.vec3;
var vec4=glMatrix.vec4;

export class SuperficieBarrido {
  constructor(poligono, recorrido) {
      this.poligono = poligono 
      this.recorrido = recorrido
  }

  getBuffers(poligono,recorrido,uFactor=1,vFactor=1) {
    this.poligono = poligono 
    this.recorrido = recorrido
    let positionBuffer = this.getPositionBuffer()
    let normalBuffer = this.getNormalBuffer()
    let indexBuffer = this.getIndexBuffer()
    let uvBuffer = recorrido ? this.getUVBuffer(uFactor,vFactor) : this.getUVBufferTapa(uFactor,vFactor)

    return [positionBuffer,normalBuffer,indexBuffer,uvBuffer]
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

  getUVBuffer(uFactor,vFactor){
    var uvBuffer = []

    var cant_niveles = this.recorrido.length
    var vertices_poligono =  this.poligono.length

    var perimetroPoligono = []
    for (let i=0; i < vertices_poligono; i++) {
      if(i == 0){
        perimetroPoligono[i] = 0
      }
      else{
        perimetroPoligono[i] =  perimetroPoligono[i-1] + this.poligono[i].getDistancia(this.poligono[i-1])
      }


    }

    var distanciaRecorrida = []
    for (let i=0; i < cant_niveles ; i++) {
      if(i == 0){
        distanciaRecorrida[i] = 0
      }
      else{
        let vertice = this.poligono[0].getCoords(); 

        let verticeNivelAnt = vec4.create()
        vec4.transformMat4(
          verticeNivelAnt,
          vec4.fromValues(vertice[0],vertice[1],vertice[2],1.0),
          this.recorrido[i-1]) 

        let verticeNiveli = vec4.create()
        vec4.transformMat4(
          verticeNiveli,
          vec4.fromValues(vertice[0],vertice[1],vertice[2],1.0),
          this.recorrido[i]) 


        distanciaRecorrida[i] = distanciaRecorrida[i-1] + Math.sqrt(
          Math.pow(verticeNivelAnt[0]-verticeNiveli[0],2)+
          Math.pow(verticeNivelAnt[1]-verticeNiveli[1],2)+
          Math.pow(verticeNivelAnt[2]-verticeNiveli[2],2))
      }
    }
    for (let i = 0; i < this.recorrido.length; i++) {
      for (let j = 0; j < this.poligono.length; j++) {
    
        uvBuffer.push(uFactor*perimetroPoligono[j]/perimetroPoligono[this.poligono.length-1])
        uvBuffer.push(vFactor*distanciaRecorrida[i]/distanciaRecorrida[this.recorrido.length-1])
      }
    }
    return uvBuffer
  }

  getUVBufferTapa(uFactor,vFactor,normal,centerX,centerY){
    let uvBuffer= []
    let sizePoligono = this.poligono.length;
    let Umax = -Math.pow(10, 1000)
    let Umin =  Math.pow(10, 1000)
    let Vmax = -Math.pow(10, 1000)
    let Vmin =  Math.pow(10, 1000)
    let Ucenter = 0
    let Vcenter = 0
    for (let j = 0; j < sizePoligono; j++) {
      let coords = this.poligono[j].getCoords()
      
      if (coords[0] < Umin) Umin = coords[0]
      if (coords[0] > Umax) Umax = coords[0]

      if (coords[1] < Vmin) Vmin = coords[1]
      if (coords[1] > Vmax) Vmax = coords[1]

      Ucenter+=coords[0]
      Vcenter+=coords[1]
    }
    Ucenter = Ucenter/sizePoligono
    Vcenter = Vcenter/sizePoligono
    console.log(Vmax,Vmin,Umax,Umin,Ucenter,Vcenter)

    if (normal == 1){
      for (let j = 0; j < sizePoligono; j++) {
        uvBuffer.push((centerX-Umin)/(Umax-Umin))
        uvBuffer.push((centerY-Vmin)/(Vmax-Vmin))
      }
  
      for (let j = 0; j < sizePoligono; j++) {
        let coords = this.poligono[j].getCoords()
        uvBuffer.push((coords[0]-Umin)/(Umax-Umin))
        uvBuffer.push((coords[1]-Vmin)/(Vmax-Vmin))
      }
    }else{  
      for (let j = 0; j < sizePoligono; j++) {
        let coords = this.poligono[j].getCoords()
        uvBuffer.push((coords[0]-Umin)/(Umax-Umin))
        uvBuffer.push((coords[1]-Vmin)/(Vmax-Vmin))
      }

      for (let j = 0; j < sizePoligono; j++) {
        uvBuffer.push((0-Umin)/(Umax-Umin))
        uvBuffer.push((-1-Vmin)/(Vmax-Vmin))
      }
    }
    return uvBuffer
  }

  getNormalBufferTapa(normal){
    let normalBuffer = [];
    let sizePoligono = this.poligono.length;
    for (let j = 0; j < 2*sizePoligono; j++) {
  
      normalBuffer.push(0)
      normalBuffer.push(0)
      normalBuffer.push(normal)
    }
    
    return normalBuffer
  }

  getBuffersTapas(poligono,recorrido,uFactor=1,vFactor=1,normal,centerX,centerY) {
    this.poligono = poligono 
    this.recorrido = recorrido
    let positionBuffer = this.getPositionBuffer()
    let normalBuffer = this.getNormalBufferTapa(normal)
    let indexBuffer = this.getIndexBuffer()
    let uvBuffer = this.getUVBufferTapa(uFactor,vFactor,normal,centerX,centerY)

    return [positionBuffer,normalBuffer,indexBuffer,uvBuffer]
  }

}