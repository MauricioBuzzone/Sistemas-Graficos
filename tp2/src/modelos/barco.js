import { Objeto3D } from '../util/objeto3D.js';
import { CascoBarco } from './cascoBarco.js';
import { Cubo } from './cubo.js';

var vec3=glMatrix.vec3;
var mat4=glMatrix.mat4;

const CANT_CONTAINER = 8
const CANT_FILAS = 5
const CANT_COL = 2

const colores = [
    [240/255,60/255,60/255],
    [60/255,60/255,240/255],
    [240/255,240/255,60/255],
    [240/255,60/255,240/255],
]
export class Barco extends Objeto3D{
    constructor(){
        super()

        this.cascoBarco = new CascoBarco()
        this.agregarHijo(this.cascoBarco)
        this.cascoBarco.setColor(colores[0][0],colores[0][1],colores[0][2])


        this.cabina = new Cubo(5,3,2)
        this.agregarHijo(this.cabina)
        this.cabina.setPosicion(vec3.fromValues(0,3,4))
        this.cabina.setColor(colores[0][0],colores[0][1],colores[0][2])
        

        this.techoCabina = new Cubo(6,1,3)
        this.agregarHijo(this.techoCabina)
        this.techoCabina.setPosicion(vec3.fromValues(0,5,4))
        this.techoCabina.setColor(colores[0][0],colores[0][1],colores[0][2])
        
        let cantContainer = 0
        let posPrimerFila = Math.floor(CANT_FILAS/2)
        let postUlt = CANT_FILAS - posPrimerFila
        this.containers = []
        for(let i=0; i < CANT_COL; i++){
            for(let j=-posPrimerFila; j < postUlt; j++){
                if( cantContainer < CANT_CONTAINER){
                    let container = new Cubo(1,1,3)
                    this.containers.push(container)
                    this.agregarHijo(container)
                   
                    container.setPosicion(vec3.fromValues(j*1.1,2.5+i*1.1,0))
                    
                    let coloresSize = colores.length
                    let colorElegido = (i+Math.abs(j))% coloresSize
                    
                    container.setColor(colores[colorElegido][0],colores[colorElegido][1],colores[colorElegido][2])
                    cantContainer+=1
                }
            }
        }
    }

    setMaterial(material){
        this.cascoBarco.setMaterial(material)
        this.cabina.setMaterial(material)
        this.techoCabina.setMaterial(material)
        
        for(let i=0; i<this.containers.length;i++){
            this.containers[i].setMaterial(material)
        }
    }

}
