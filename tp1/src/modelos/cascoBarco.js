import {Curva, Bases} from '../util/curva.js'
import { CurvaGenerica } from '../util/curvaGenerica.js';
import { Modelo } from './modelo.js';

var vec3=glMatrix.vec3;
var mat4=glMatrix.mat4;

export class CascoBarco extends Modelo{
    constructor(){
        super()
        this.stepPerfil = 0.1
        this.stepRecorrido = 1
        
        this.setPerfil()
        this.setRecorrido()
    }

    setPerfil(){
        let puntosDeControl = [
            vec3.fromValues(4,2,0),
            vec3.fromValues(0,2,0),
            vec3.fromValues(-4,2,0),
            vec3.fromValues(-4,-2,0),
            vec3.fromValues(4,-2,0),
            vec3.fromValues(4,2,0),
        ]
        this.perfil = new CurvaGenerica([
            new Curva(Bases.Bezier2,[
                puntosDeControl[0],
                puntosDeControl[1],
                puntosDeControl[2],
            ]),
            
            new Curva(Bases.Bezier3,[
                puntosDeControl[2],
                puntosDeControl[3],
                puntosDeControl[4],
                puntosDeControl[5],
            ]),
        ])
    }

    setRecorrido(){
        let puntosDeControl = [
            vec3.fromValues(0,0,-6),
            vec3.fromValues(0,0,0),
            vec3.fromValues(0,0,6),
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
    dibujar(matPadre, gl, shaderProgram, normal) {
        if (this.buffers == null ){
            this.buffers = this.supBarrido.getBuffers(
                this.getPerfil(this.stepPerfil),
                this.getRecorrido(this.stepRecorrido)
            )
            let cantCurvas = this.perfil.curvas.length
            let disc = 1/this.stepPerfil +1
            let sizeBuffer = this.buffers[1].length
            for(let i=0; i< cantCurvas*disc*3*2 ;i+=3){
                this.buffers[1][i] = 0
                this.buffers[1][i+1] = 0
                this.buffers[1][i+2] = -1


                this.buffers[1][(sizeBuffer -1) - i] = 1
                this.buffers[1][(sizeBuffer -1) - i -1] = 0
                this.buffers[1][(sizeBuffer -1) - i -2] = 0

            }
            this.setGeometria(
                this.buffers[0], // positionBuffer
                this.buffers[1], // normalBuffer
                this.buffers[2], // indexBuffer
            )
        }
        super.dibujar(matPadre, gl, shaderProgram, normal)
    }

    getRecorrido(step){
        var puntos = this.recorrido.getDiscretizacion(step)
        var recorrido = []
        
        let inicioBarco = puntos[0].getCoords()[2]
        let finBarco = puntos[puntos.length-1].getCoords()[2]

        let tapa1 = mat4.fromValues(
            0,0,0,0,
            0,0,0,0,
            0,0,0,inicioBarco,
            0,0,0,1,
        )
        mat4.transpose(tapa1,tapa1)
        recorrido.push(tapa1)

        tapa1 = mat4.fromValues(
            -1,0,0,0,
            0,1,0,0,
            0,0,1,inicioBarco,
            0,0,0,1,
        )
        mat4.transpose(tapa1,tapa1)
        recorrido.push(tapa1)

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

        let tapa2 = mat4.fromValues(
            -1,0,0,0,
            0,1,0,0,
            0,0,1,finBarco,
            0,0,0,1,
        )
        mat4.transpose(tapa2,tapa2)
        recorrido.push(tapa2)

        tapa2 = mat4.fromValues(
            0,0,0,0,
            0,0,0,0,
            0,0,0,finBarco,
            0,0,0,1,
        )
        mat4.transpose(tapa2,tapa2)
        recorrido.push(tapa2)

        return recorrido
    }
}