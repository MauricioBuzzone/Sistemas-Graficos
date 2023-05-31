import { Objeto3D } from "../objeto3D.js"
import { Bases, Curva } from "./curva.js";
import {SuperficieBarrido} from './superficieBarrido.js'
import { CurvaGenerica } from "./curvaGenerica.js";
var vec3=glMatrix.vec3;
var mat4=glMatrix.mat4;

export const VarienteArbol = {
    Pino: Symbol('Pino'),
    Default: Symbol('Default')
}

export class CopaArbol extends Objeto3D{
    constructor(variente = VarienteArbol.Default){
        super()

        this.recorrido = null
        this.buffers = null
        this.stepPerfil = 0.1
        this.stepRecorrido = 0.1
        this.supBarrido = new SuperficieBarrido()

        this.setPerfil(variente)
        this.setRecorrido()
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

    setRecorrido(){
        let puntosDeControl = [
            vec3.fromValues(0,0,0.00001),
            vec3.fromValues(0,0.00001,0.00001),
            vec3.fromValues(0,0.00001,0),
            vec3.fromValues(0,0.00001,-0.00001),
            vec3.fromValues(0,0,-0.00001),
        ]

        this.recorrido = new CurvaGenerica([
            new Curva(Bases.Bezier2,[
                puntosDeControl[0],
                puntosDeControl[1],
                puntosDeControl[2],
            ]),
            new Curva(Bases.Bezier2,[
                puntosDeControl[2],
                puntosDeControl[3],
                puntosDeControl[4],
            ])
        ])
        this.recorrido.setBiNormal(vec3.fromValues(-1,0,0))
    }

    setPerfil(variente){
        if(variente == VarienteArbol.Pino){
            this.setPerfilPino()
        }
        if(variente == VarienteArbol.Default){
            this.setPerfilDef()
        }
    }

    setPerfilPino(){
        let puntosDeControl = [
            vec3.fromValues(1,0,0),
            vec3.fromValues(0.5,-0.5,0),
            vec3.fromValues(0,-1,0),
            vec3.fromValues(0.9,-0.25,0),
            vec3.fromValues(2,0,0),
            vec3.fromValues(1.4,-0.4,0),
            vec3.fromValues(1.07,-0.87,0),
            vec3.fromValues(1.98,-0.29,0),
            vec3.fromValues(3,0,0),
            vec3.fromValues(2.43,-0.47,0),
            vec3.fromValues(2.4,-0.8,0),
            vec3.fromValues(2.96,-0.21,0),
            vec3.fromValues(5,0,0),
            vec3.fromValues(2.96,0.21,0),
            vec3.fromValues(2.4,0.8,0),
            vec3.fromValues(2.43,0.47,0),
            vec3.fromValues(3,0,0),
            vec3.fromValues(1.98,0.29,0),
            vec3.fromValues(1.07,0.87,0),
            vec3.fromValues(1.4,0.4,0),
            vec3.fromValues(2,0,0),
            vec3.fromValues(0.9,0.25,0),
            vec3.fromValues(0,1,0),
            vec3.fromValues(0.5,0.5,0),
            vec3.fromValues(1,0,0),
        ]

        this.perfil = new CurvaGenerica([
            new Curva(Bases.Bezier2,[
                puntosDeControl[0],
                puntosDeControl[1],
                puntosDeControl[2],
            ]),
            new Curva(Bases.Bezier2,[
                puntosDeControl[2],
                puntosDeControl[3],
                puntosDeControl[4],
            ]),
            new Curva(Bases.Bezier2,[
                puntosDeControl[4],
                puntosDeControl[5],
                puntosDeControl[6],
            ]),
            new Curva(Bases.Bezier2,[
                puntosDeControl[6],
                puntosDeControl[7],
                puntosDeControl[8],
            ]),
            new Curva(Bases.Bezier2,[
                puntosDeControl[8],
                puntosDeControl[9],
                puntosDeControl[10],
            ]),
            new Curva(Bases.Bezier2,[
                puntosDeControl[10],
                puntosDeControl[11],
                puntosDeControl[12],
            ]),
            new Curva(Bases.Bezier2,[
                puntosDeControl[12],
                puntosDeControl[13],
                puntosDeControl[14],
            ]),
            new Curva(Bases.Bezier2,[
                puntosDeControl[14],
                puntosDeControl[15],
                puntosDeControl[16],
            ]),
            new Curva(Bases.Bezier2,[
                puntosDeControl[16],
                puntosDeControl[17],
                puntosDeControl[18],
            ]),
            new Curva(Bases.Bezier2,[
                puntosDeControl[18],
                puntosDeControl[19],
                puntosDeControl[20],
            ]),
            new Curva(Bases.Bezier2,[
                puntosDeControl[20],
                puntosDeControl[21],
                puntosDeControl[22],
            ]),
            new Curva(Bases.Bezier2,[
                puntosDeControl[22],
                puntosDeControl[23],
                puntosDeControl[24],
            ]),
        ])
    }

    setPerfilDef(){
        let puntosDeControl = [
            vec3.fromValues(0,0,0),
            vec3.fromValues(1,-4,0),
            vec3.fromValues(2,0,0),
            vec3.fromValues(3,-1,0),
            vec3.fromValues(4,-2,0),
            vec3.fromValues(4.5,-1,0),
            vec3.fromValues(5,0,0),
            vec3.fromValues(4.5,1,0),
            vec3.fromValues(4,2,0),
            vec3.fromValues(3,1,0),
            vec3.fromValues(2,0,0),
            vec3.fromValues(1,4,0),
            vec3.fromValues(0,0,0),
        ]

        this.perfil = new CurvaGenerica([
            new Curva(Bases.Bezier3,[
                puntosDeControl[0],
                puntosDeControl[1],
                puntosDeControl[2],
                puntosDeControl[3],
            ]),
            new Curva(Bases.Bezier3,[
                puntosDeControl[3],
                puntosDeControl[4],
                puntosDeControl[5],
                puntosDeControl[6],
            ]),
            new Curva(Bases.Bezier3,[
                puntosDeControl[6],
                puntosDeControl[7],
                puntosDeControl[8],
                puntosDeControl[9],
            ]),
            new Curva(Bases.Bezier3,[
                puntosDeControl[9],
                puntosDeControl[10],
                puntosDeControl[11],
                puntosDeControl[12],
            ]),
        ])
    }
}