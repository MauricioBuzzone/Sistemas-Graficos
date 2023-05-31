import {Curva, Bases} from '../util/curva.js'
import { CurvaGenerica } from '../util/curvaGenerica.js';
import {Plano} from './plano.js'
import { Modelo } from './modelo.js';
var vec3=glMatrix.vec3;
var mat4=glMatrix.mat4;

export class Cubo extends Modelo{
    constructor(){
        super()
        this.stepPerfil = 1
        this.stepRecorrido = 1

        this.tapaDelantera = new Plano()
        this.tapaTrasera = new Plano()
        this.tapaDelantera.setRotacion([Math.PI/2,vec3.fromValues(0,1,0)])
        this.tapaTrasera.setRotacion([-Math.PI/2,vec3.fromValues(0,1,0)])
        this.agregarHijo(this.tapaDelantera)
        this.agregarHijo(this.tapaTrasera)

        this.setPerfil()
        this.setRecorrido()
    }

    setPerfil(){
        let puntosDeControl = [
            vec3.fromValues(1,-1,0),
            vec3.fromValues(1,0,0),
            vec3.fromValues(1,1,0),
            vec3.fromValues(0,1,0),
            vec3.fromValues(-1,1,0),
            vec3.fromValues(-1,0,0),
            vec3.fromValues(-1,-1,0),
            vec3.fromValues(0,-1,0),
            vec3.fromValues(1,-1,0)
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