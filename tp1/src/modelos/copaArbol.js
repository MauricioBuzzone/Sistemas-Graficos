import { Bases, Curva } from "../util/curva.js";
import { CurvaGenerica } from "../util/curvaGenerica.js";
import { VarienteArbol } from "./arbol.js";
import { Modelo } from "./modelo.js";

var vec3=glMatrix.vec3;


export class CopaArbol extends Modelo{
    constructor(variente = VarienteArbol.Default){
        super()
        this.stepPerfil = 0.1
        this.stepRecorrido = 0.1

        this.setPerfil(variente)
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