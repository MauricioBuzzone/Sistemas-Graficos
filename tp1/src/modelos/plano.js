import {Curva, Bases} from '../util/curva.js'
import { CurvaGenerica } from '../util/curvaGenerica.js';
import { Modelo } from './modelo.js';
var vec3=glMatrix.vec3;
var mat4=glMatrix.mat4;

export class Plano extends Modelo{
    constructor(){
        super()
        this.stepPerfil = 0.5
        this.stepRecorrido = 0.5

    
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
}