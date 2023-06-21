
import {Curva, Bases} from '../util/curva.js'
import { CurvaGenerica } from '../util/curvaGenerica.js';
import {Modelo} from './modelo.js'

var vec3=glMatrix.vec3;
var mat4=glMatrix.mat4;
export class Cilindro extends Modelo{

    constructor(){
        super()
        this.stepPerfil = 0.1
        this.stepRecorrido = 0.1

    
        this.setPerfil()
        this.setRecorridoDef()
    }
   
    setRecorridoDef(){
        let puntosDeControl = [
            vec3.fromValues(0,0,0),
            vec3.fromValues(0,0,0),
            vec3.fromValues(0,0,1),
        ]

        this.recorrido = new CurvaGenerica([
            new Curva(Bases.Bezier2,[
                puntosDeControl[0],
                puntosDeControl[1],
                puntosDeControl[2],
            ]),
        ])

        this.recorrido.setBiNormal(vec3.fromValues(-1,0,0))
    }

    setPerfil(){
        let puntosDeControl = [
            vec3.fromValues(0.1,0,0),
            vec3.fromValues(0.1,0.1,0),
            vec3.fromValues(0,0.1,0),
            vec3.fromValues(-0.1,0.1,0),
            vec3.fromValues(-0.1,0,0),

            vec3.fromValues(-0.1,-0.1,0),
            vec3.fromValues(0,-0.1,0),
            vec3.fromValues(0.1,-0.1,0),
            vec3.fromValues(0.1,0,0),
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
        ])

    }
    setRecorrido(recorrido){
        this.recorrido = recorrido
    }
}