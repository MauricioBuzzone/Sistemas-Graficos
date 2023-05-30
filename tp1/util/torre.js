
import { Objeto3D } from '../objeto3D.js';
import {Curva, Bases} from './curva.js'
import { CurvaGenerica } from './curvaGenerica.js';
import {SuperficieBarrido} from './superficieBarrido.js'
var vec3=glMatrix.vec3;
var mat4=glMatrix.mat4;
export class Torre extends Objeto3D{

    constructor(altura){
        super()
        this.perfil = null
        this.recorrido = null
        this.buffers = null
        this.stepPerfil = 0.1
        this.stepRecorrido = 0.1
        this.supBarrido = new SuperficieBarrido()

        this.setPerfil(altura)
        this.setRecorrido()
    }


    dibujar(matPadre, gl, viewMatrix, projMatrix) {
        if (this.buffers == null ){
            this.buffers = this.supBarrido.getBuffers(
                this.getPerfil(this.stepPerfil),
                this.getRecorrido(this.stepRecorrido)
            )
        }
        this.setGeometria(
            this.buffers[0], // positionBuffer
            this.buffers[1], // normalBuffer
            this.buffers[2], // indexBuffer
        )
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

    setPerfil(altura){
        let tramo1 = altura/3
        let tramo2 = 2*altura/3
        let tramo3 = altura
        let radio = 0.5

        let puntosDeControl = [
            vec3.fromValues(0,0,0),
            vec3.fromValues(0,-radio/2,0),
            vec3.fromValues(0,-radio,0),
            vec3.fromValues(tramo1-2,-radio,0),
            vec3.fromValues(tramo1+2,-radio,0),
            vec3.fromValues(tramo1-2,-radio*2/3,0),
            vec3.fromValues(tramo1+2,-radio*2/3,0),
            vec3.fromValues(tramo2-2,-radio*2/3,0),
            vec3.fromValues(tramo2+2,-radio*2/3,0),
            vec3.fromValues(tramo2-2,-radio/3,0),
            vec3.fromValues(tramo2+2,-radio/3,0),
            vec3.fromValues(tramo3/2,-radio/3,0),
            vec3.fromValues(tramo3,-radio/3,0),
            vec3.fromValues(tramo3,0,0),
            vec3.fromValues(tramo3,radio/3,0),
            vec3.fromValues(tramo3/2,radio/3,0),
            vec3.fromValues(tramo2+2,radio/3,0),
            vec3.fromValues(tramo2-2,radio/3,0),
            vec3.fromValues(tramo2+2,radio*2/3,0),
            vec3.fromValues(tramo2-2,radio*2/3,0),
            vec3.fromValues(tramo1+2,radio*2/3,0),
            vec3.fromValues(tramo1-2,radio*2/3,0),
            vec3.fromValues(tramo1+2,radio,0),
            vec3.fromValues(tramo1-2,radio,0),
            vec3.fromValues(0,radio,0),
            vec3.fromValues(0,radio/2,0),
            vec3.fromValues(0,0,0),
        ]

        this.perfil = new CurvaGenerica([
            new Curva(Bases.Bezier2,[
                puntosDeControl[0],
                puntosDeControl[1],
                puntosDeControl[2],
            ]),
            new Curva(Bases.Bezier3,[
                puntosDeControl[3],
                puntosDeControl[4],
                puntosDeControl[5],
                puntosDeControl[6],
            ]),

            new Curva(Bases.Bezier3,[
                puntosDeControl[7],
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
            new Curva(Bases.Bezier3,[
                puntosDeControl[16],
                puntosDeControl[17],
                puntosDeControl[18],
                puntosDeControl[19],
            ]),
            new Curva(Bases.Bezier3,[
                puntosDeControl[20],
                puntosDeControl[21],
                puntosDeControl[22],
                puntosDeControl[23],
            ]),
            new Curva(Bases.Bezier2,[
                puntosDeControl[24],
                puntosDeControl[25],
                puntosDeControl[26],
            ]),
        ])
    }
}