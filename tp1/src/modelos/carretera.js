import {Curva, Bases} from '../util/curva.js'
import {CurvaGenerica} from '../util/curvaGenerica.js'
import { Modelo } from './modelo.js';

var vec3=glMatrix.vec3;

export class Carretera extends Modelo{ 
    constructor(altura){
        super()
        this.stepPerfil = 0.1
        this.stepRecorrido = 0.1

        this.setPerfil()
        this.setRecorrido(altura)
    }
    
    setRecorrido(altura){
        let puntosDeControl = [
            vec3.fromValues(0,0,-20),  
            vec3.fromValues(0,0,-15),
            vec3.fromValues(0,0,-12), 
            vec3.fromValues(0,altura,0), 
            vec3.fromValues(0,0,12), 
            vec3.fromValues(0,0,15), 
            vec3.fromValues(0,0,20), 
        ]

        this.recorrido = new CurvaGenerica([
            new Curva(Bases.Bezier2,[
                puntosDeControl[0],
                puntosDeControl[1],
                puntosDeControl[2]
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
            ])
        ])
        this.recorrido.setBiNormal(vec3.fromValues(-1,0,0))
    }
    setPerfil(){
        let puntosDeControl = [
            vec3.fromValues(-10,-1,0),
            vec3.fromValues(0,-1,0),
            vec3.fromValues(10,-1,0),
            vec3.fromValues(10,0,0),
            vec3.fromValues(10,0,0),
            vec3.fromValues(9,0,0),
            vec3.fromValues(8,0,0),
            vec3.fromValues(7.8,0,0),
            vec3.fromValues(7.8,-0.2,0),
            vec3.fromValues(7.6,-0.2,0),
            vec3.fromValues(-7.6,-0.2,0),
            vec3.fromValues(-7.6,-0.2,0),
            vec3.fromValues(-7.8,-0.2,0),
            vec3.fromValues(-7.8,0,0),
            vec3.fromValues(-8,0,0),
            vec3.fromValues(-9,0,0),
            vec3.fromValues(-10,0,0),
            vec3.fromValues(-10,0,0), 
            vec3.fromValues(-10,-1,0), 
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
                puntosDeControl[4]
            ]),
            new Curva(Bases.Bezier2,[
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
            new Curva(Bases.Bezier2,[
                puntosDeControl[9],
                puntosDeControl[10],
                puntosDeControl[11],
            ]),
            new Curva(Bases.Bezier3,[
                puntosDeControl[11],
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
            ])
        ])
    }
}