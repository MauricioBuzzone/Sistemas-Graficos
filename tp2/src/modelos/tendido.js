import { Objeto3D } from "../util/objeto3D.js";
import { Punto } from '../util/punto.js'
import { Curva, Bases} from "../util/curva.js"
import { CurvaGenerica } from "../util/curvaGenerica.js"
import {PhongConTextura} from '../materiales/phongConTextura.js'
import {PhongConNormalMap} from '../materiales/phongConNormalMap.js'
import { Cilindro } from './cilindro.js'
import { Tensor } from "./tensor.js";

var vec3=glMatrix.vec3;
export class Tendido extends Objeto3D{
    constructor(carretera, parametros,gl){
        super()

        

        let camino = carretera.recorridoDisc
        let inicio = camino[12].getCoords()
        let fin = camino[20].getCoords()

        let puntosDeControl = [
            vec3.fromValues(0,inicio[1],inicio[2]),
            vec3.fromValues(0,(parametros.torres.alturaTorre-8)*1/3,inicio[2]*2/3),
            vec3.fromValues(0,parametros.torres.alturaTorre-8,-parametros.torres.separacionTorres/2),

            vec3.fromValues(0,parametros.torres.alturaTorre-10,-parametros.torres.separacionTorres/4),
            vec3.fromValues(0,parametros.torres.alturaTorre-10,0),
            vec3.fromValues(0,parametros.torres.alturaTorre-10,parametros.torres.separacionTorres/4),

            vec3.fromValues(0,parametros.torres.alturaTorre-8,parametros.torres.separacionTorres/2),
            vec3.fromValues(0,(parametros.torres.alturaTorre-8)*1/3,fin[2]*2/3),
            vec3.fromValues(0,fin[1],fin[2]),
        ]

        let recorridoCable = new CurvaGenerica([
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
        recorridoCable.setBiNormal(vec3.fromValues(-1,0,0))
        this.cable = new Cilindro()


        this.cable.setRecorrido(recorridoCable)
        this.cable.setRotacion([Math.PI/2,vec3.fromValues(0,1,0)])
        this.cable.setColor(240/255,60/255,60/255)
        let material =  new PhongConNormalMap(gl,'./maps/alambres.jpg','./maps/alambres-mormalmap.jpg')
        this.cable.setMaterial(material)

        super.agregarHijo(this.cable)

        let puente = new Curva(Bases.Bezier2,[
            vec3.fromValues(0,inicio[1],inicio[2]),
            vec3.fromValues(0,parametros.puente.alturaAct*0.9,0), 
            vec3.fromValues(0,fin[1],fin[2]),
        ])
        puente.setBiNormal(vec3.fromValues(-1,0,0))

        let cantTensores = Math.floor((fin[2] - inicio[2])/parametros.tensores.separacionTensores)
        let step = 1/(cantTensores)
        this.tensores = []
        
        let materialTensor =  new PhongConTextura(gl,'./maps/alambres.jpg')
        materialTensor.setConfig([20,40,20],[0,0,0],[0.1,0.1,0.1],[0.0,0.0,0.0], [0,0,0],16)
        for(let i=0; i<1;i+=step){  
            
            let tope = recorridoCable.getPunto(i*4).getCoords()
            let u = getUforZ(puente,tope[2])
            let piso = puente.getPunto(u).getCoords()

            let tensor = new Tensor()
            tensor.setMaterial(materialTensor)
            
            this.tensores.push(tensor)
            tensor.setRotacion([-Math.PI/2,[1,0,0]])
            tensor.setPosicion(vec3.fromValues(piso[2],piso[1],0))
            tensor.setEscala(vec3.fromValues(0.5,0.5,tope[1]-piso[1]))
            tensor.setColor(1,1,1)
            super.agregarHijo(tensor)
            
        }
        
        function  getUforZ(curva,z){    
            let x1 = curva.puntosDeControl[0][2]
            let x2 = curva.puntosDeControl[1][2]
            return (z-x1)/(-2*x1+2*x2)
        }
    }

    setMaterial(material){
        this.cable.setMaterial(material)
        for(let i=0;i<this.tensores.length;i++){
            this.tensores[i].setMaterial(material)
        }
    }
}