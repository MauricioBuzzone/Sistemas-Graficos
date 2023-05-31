import { Objeto3D } from "../util/objeto3D.js";
import { Cilindro } from "./cilindro.js";
import { CopaArbol } from "./copaArbol.js";

var vec3=glMatrix.vec3;

export const VarienteArbol = {
    Pino: Symbol('Pino'),
    Default: Symbol('Default')
}

export class Arbol extends Objeto3D{
    constructor(variante = VarienteArbol.Default){
        super()

        this.tronco = new Cilindro()
        this.tronco.setRotacion([-Math.PI/2,vec3.fromValues(1,0,0)])
        this.tronco.setEscala(vec3.fromValues(2,2,2))
        this.tronco.setPosicion(vec3.fromValues(0,0,0))

        this.copa = new CopaArbol(variante)
        this.copa.setRotacion([-Math.PI/2,vec3.fromValues(0,0,1)])
        this.copa.setEscala(vec3.fromValues(0.75,0.8,0.8))
        this.copa.setPosicion(vec3.fromValues(0,1,0))

        super.agregarHijo(this.tronco)
        super.agregarHijo(this.copa)
    }
}