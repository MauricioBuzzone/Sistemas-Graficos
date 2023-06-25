import {Curva, Bases} from '../util/curva.js'
import { CurvaGenerica } from '../util/curvaGenerica.js';
import {Plano} from './plano.js'
import { Modelo } from './modelo.js';
var vec3=glMatrix.vec3;
var mat4=glMatrix.mat4;

export class Cubo extends Modelo{
    constructor(l1=1,l2=1,l3=1){
        super()
        this.stepPerfil = 1
        this.stepRecorrido = 1
        this.uFactor = 4
        this.vFactor = 1
        this.l1 = l1
        this.l2 = l2
        this.l3 = l3
        this.tapaDelantera = new Plano(l1,l2)
        this.tapaTrasera = new Plano(l1,l2)
        this.tapaDelantera.setRotacion([Math.PI/2,vec3.fromValues(0,1,0)])
        this.tapaDelantera.setPosicion(vec3.fromValues(0,0,this.l3/2))
        this.tapaTrasera.setRotacion([-Math.PI/2,vec3.fromValues(0,1,0)])
        this.tapaTrasera.setPosicion(vec3.fromValues(0,0,-this.l3/2))
        this.agregarHijo(this.tapaDelantera)
        this.agregarHijo(this.tapaTrasera)

        this.setPerfil()
        this.setRecorrido()
    }
    setColor(r,g,b){
        this.tapaDelantera.setColor(r,g,b)
        this.tapaTrasera.setColor(r,g,b)
        super.setColor(r,g,b)
    }

    setMaterial(material){
        this.tapaDelantera.setMaterial(material)
        this.tapaTrasera.setMaterial(material)
        this.material=material
    }
    setPerfil(){
        let puntosDeControl = [
            vec3.fromValues(this.l1/2,-this.l2/2,0),
            vec3.fromValues(this.l1/2,0,0),
            vec3.fromValues(this.l1/2,this.l2/2,0),
            vec3.fromValues(0,this.l2/2,0),
            vec3.fromValues(-this.l1/2,this.l2/2,0),
            vec3.fromValues(-this.l1/2,0,0),
            vec3.fromValues(-this.l1/2,-this.l2/2,0),
            vec3.fromValues(0,-this.l2/2,0),
            vec3.fromValues(this.l1/2,-this.l2/2,0)
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
            vec3.fromValues(0,0,-this.l3/2),
            vec3.fromValues(0,0,0),
            vec3.fromValues(0,0,this.l3/2),
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