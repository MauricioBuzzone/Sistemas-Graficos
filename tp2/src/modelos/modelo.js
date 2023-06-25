import { Objeto3D } from '../util/objeto3D.js';
import {SuperficieBarrido} from '../util/superficieBarrido.js'

var mat4=glMatrix.mat4;

export class Modelo extends Objeto3D{
    constructor(){
        super()
        this.perfil = null
        this.recorrido = null
        this.buffers = null
        this.stepPerfil = 0.1
        this.stepRecorrido = 0.1
        this.uFactor = 10
        this.vFactor = 10
        this.supBarrido = new SuperficieBarrido()
    }

    dibujar(matPadre, gl, shaderProgram, viewMatrix, projMatrix,eyePos, normal) {
        if (this.buffers == null ){
            this.buffers = this.supBarrido.getBuffers(
                this.getPerfil(this.stepPerfil),
                this.getRecorrido(this.stepRecorrido),
                this.uFactor,
                this.vFactor
            )

            this.setGeometria(
                this.buffers[0], // positionBuffer
                this.buffers[1], // normalBuffer
                this.buffers[2], // indexBuffer
                this.buffers[3], // uvBuffer
                this.buffers[4], // TangBuffer
                this.buffers[5]  // BinBuffer
            )
        }
        super.dibujar(matPadre, gl, shaderProgram, viewMatrix, projMatrix,eyePos, normal)
    }


    getPerfil(step){
        return this.perfil.getDiscretizacion(step)
    }

    getRecorridoPuntos(step){
        return this.recorrido.getDiscretizacion(step)
    }

    getRecorrido(step){
        var puntos = this.recorrido.getDiscretizacion(step)
        var recorrido = []
 
        for(var i=0; i< puntos.length; i++){

            var biNormal = puntos[i].getBiNormal()
            var normal = puntos[i].getNormal()
            var tang = puntos[i].getTang()
            var coords = puntos[i].getCoords()
            
            var matrizLvli = mat4.fromValues(
                biNormal[0],biNormal[1],biNormal[2],0,
                normal[0],normal[1],normal[2],0,
                tang[0],tang[1],tang[2],0,
                coords[0],coords[1],coords[2],1)
        
            recorrido.push(matrizLvli)
        }
        return recorrido
    }
}