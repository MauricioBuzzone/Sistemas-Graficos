
import { Objeto3D } from '../util/objeto3D.js';
import {Curva, Bases} from '../util/curva.js'
import { CurvaGenerica } from '../util/curvaGenerica.js';
import {SuperficieBarrido} from '../util/superficieBarrido.js'
import { Modelo } from './modelo.js';
var vec3=glMatrix.vec3;
var mat4=glMatrix.mat4;
export class Torre extends Modelo{

    constructor(altura){
        super()
        this.stepPerfil = 0.1
        this.stepRecorrido = 0.1
        this.setColor(240/255,60/255,60/255)
        this.setPerfil(altura)
        this.setRecorrido()
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