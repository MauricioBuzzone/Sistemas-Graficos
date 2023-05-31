import { Objeto3D } from '../util/objeto3D.js';
import { CascoBarco } from './cascoBarco.js';
import { Cubo } from './cubo.js';

var vec3=glMatrix.vec3;
var mat4=glMatrix.mat4;

const CANT_CONTAINER = 8
const CANT_FILAS = 5
const CANT_COL = 2
export class Barco extends Objeto3D{
    constructor(){
        super()

        this.cascoBarco = new CascoBarco()
        this.agregarHijo(this.cascoBarco)

        this.cabina = new Cubo()
        this.agregarHijo(this.cabina)
        this.cabina.setPosicion(vec3.fromValues(0,3,4))
        this.cabina.setEscala(vec3.fromValues(2.5,1,1))

        this.techoCabina = new Cubo()
        this.agregarHijo(this.techoCabina)
        this.techoCabina.setPosicion(vec3.fromValues(0,4,4))
        this.techoCabina.setEscala(vec3.fromValues(3,0.5,1.5))

        let cantContainer = 0
        let posPrimerFila = Math.floor(CANT_FILAS/2)
        let postUlt = CANT_FILAS - posPrimerFila
        for(let i=0; i < CANT_COL; i++){
            for(let j=-posPrimerFila; j < postUlt; j++){
                if( cantContainer < CANT_CONTAINER){
                    let container = new Cubo()
                    this.agregarHijo(container)
                    container.setEscala(vec3.fromValues(0.5,0.5,1))  
                    container.setPosicion(vec3.fromValues(j*1.1,2.5+i*1.1,0))
                    cantContainer+=1
                }
            }
        }
    }

}
