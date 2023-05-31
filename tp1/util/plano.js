import {Curva, Bases} from './curva.js'
import { CurvaGenerica } from './curvaGenerica.js';
import { Objeto3D } from '../objeto3D.js';
import {SuperficieBarrido} from './superficieBarrido.js'
var vec3=glMatrix.vec3;
var mat4=glMatrix.mat4;

export class Plano extends Objeto3D{
    constructor(){
        super()
        this.perfil = null
        this.recorrido = null
        this.stepPerfil = 0.5
        this.stepRecorrido = 0.5
        this.buffers = null
        this.supBarrido = new SuperficieBarrido()
    
        this.setPerfil()
        this.setRecorrido()
    }

    setPerfil(){
        let puntosDeControl = [
            vec3.fromValues(1,-1,0),
            vec3.fromValues(1,0,0),
            vec3.fromValues(1,1,0),
        ]
        this.perfil = new CurvaGenerica([
            new Curva(Bases.Bezier2,[
                puntosDeControl[0],
                puntosDeControl[1],
                puntosDeControl[2],
            ]),
        ])
    }

    setRecorrido(){
        let puntosDeControl = [
            vec3.fromValues(0,0,-1),
            vec3.fromValues(0,0,0),
            vec3.fromValues(0,0,1),
        ]

        this.recorrido = new CurvaGenerica([
            new Curva(Bases.Bezier2,[
                puntosDeControl[0],
                puntosDeControl[1],
                puntosDeControl[2],
            ])
        ])
        this.recorrido.setBiNormal(vec3.fromValues(-1,0,0))
    }
    dibujar(matPadre, gl, viewMatrix, projMatrix) {
        if (this.buffers == null ){
            this.buffers = this.supBarrido.getBuffers(
                this.getPerfil(this.stepPerfil),
                this.getRecorrido(this.stepRecorrido)
            )

            this.setGeometria(
                this.buffers[0], // positionBuffer
                this.buffers[1], // normalBuffer
                this.buffers[2], // indexBuffer
            )
    
        }
        super.dibujar(matPadre, gl, viewMatrix, projMatrix)
    }

    getPerfil(step){
        return this.perfil.getDiscretizacion(step)
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