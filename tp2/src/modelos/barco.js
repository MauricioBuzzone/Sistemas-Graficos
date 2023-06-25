import { Objeto3D } from '../util/objeto3D.js';
import { CascoBarco } from './cascoBarco.js';
import { Cubo } from './cubo.js';
import { Plano } from './plano.js';
import {PhongConTextura} from '../materiales/phongConTextura.js'
import {PhongConNormalMap} from '../materiales/phongConNormalMap.js'


var vec3=glMatrix.vec3;
var mat4=glMatrix.mat4;

const CANT_CONTAINER = 8
const CANT_FILAS = 5
const CANT_COL = 2


export class Barco extends Objeto3D{
    constructor(gl){
        super()

        this.cascoBarco = new CascoBarco(gl)
        this.agregarHijo(this.cascoBarco)

        this.piso = new Plano(12,8)
        let matpiso = new PhongConNormalMap(gl,'./maps/pisobarco.jpg','./maps/pisobarco-normalmap.jpg')
        this.piso.setMaterial(matpiso)
        this.piso.uFactor = 3
        this.piso.vFactor = 3
        this.piso.setRotacion([-Math.PI/2,vec3.fromValues(0,0,1)])
        this.piso.setPosicion(vec3.fromValues(0,2,0))
        this.agregarHijo(this.piso)

        this.cabina = new Cubo(5,3,2)
        let materialCasco = new PhongConNormalMap(gl,'./maps/chapas.jpg','./maps/chapas-normal map.png')
        this.cabina.setMaterial(materialCasco)
        this.agregarHijo(this.cabina)
        this.cabina.setPosicion(vec3.fromValues(0,3,4))
        

        this.techoCabina = new Cubo(6,1,3)
        this.techoCabina.tapaDelantera.uFactor=1/2
        this.techoCabina.tapaTrasera.uFactor=1/2
        this.techoCabina.setMaterial(materialCasco)
        this.agregarHijo(this.techoCabina)
        this.techoCabina.setPosicion(vec3.fromValues(0,5,4))
        
        let cantContainer = 0
        const materialesContainers = [
            new PhongConTextura(gl,'./maps/container-verde.jpg'),
            new PhongConTextura(gl,'./maps/container-celeste.jpg',),
            new PhongConTextura(gl,'./maps/container-naranja.jpg',),
        
        ]
        let posPrimerFila = Math.floor(CANT_FILAS/2)
        let postUlt = CANT_FILAS - posPrimerFila
        this.containers = []



        for(let i=0; i < CANT_COL; i++){
            for(let j=-posPrimerFila; j < postUlt; j++){
                if( cantContainer < CANT_CONTAINER){
                    let container = new Cubo(1,1,3)
                    this.containers.push(container)
                    this.agregarHijo(container)
                
                    container.vFactor=3
                    container.setPosicion(vec3.fromValues(j*1.1,2.5+i*1.1,0))
                    
                    let size = materialesContainers.length
                    let materialElegido = (i+Math.abs(j))% size
                    
                    container.setMaterial(materialesContainers[materialElegido])
                    cantContainer+=1
                }
            }
        }
    }
}
