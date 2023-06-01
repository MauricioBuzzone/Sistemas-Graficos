import { Objeto3D } from '../util/objeto3D.js';
import {Curva, Bases} from '../util/curva.js'
import {CurvaGenerica} from '../util/curvaGenerica.js'
import { SuperficieBarrido } from '../util/superficieBarrido.js';

var vec3=glMatrix.vec3;
var mat4=glMatrix.mat4;

export class Terreno{
    
    constructor(perfilStep,recorridoStep){
        this.amplitud = 4
        this.despOsilatorio = null
        this.puntosDeCotrol = [
            vec3.fromValues(30,0,0),
            vec3.fromValues(10,0,0),
            vec3.fromValues(5,-6,0),
            vec3.fromValues(1,-7,0),
            vec3.fromValues(-5,-6,0),
            vec3.fromValues(-10,0,0),
            vec3.fromValues(-30,0,0),
        ]
        this.recorrido = null
        this.objeto3d = new Objeto3D()

        this.crearRecorrido()
        this.crearDespOsilatorio()
        this.discretizar(perfilStep,recorridoStep)
    }

    dibujar(modelMatrix,gl,shaderProgram,normal){
        this.objeto3d.dibujar(modelMatrix,gl,shaderProgram, normal)
    }

    discretizar(perfilStep,recorridoStep){
        let offset = this.despOsilatorio.getDiscretizacion(recorridoStep*4)
        let matrizlvl = this.getRecorrido(recorridoStep)

        let positionBuffer = []
        let normalBuffer = []
        let indexBuffer = []

        for(let i=0; i < matrizlvl.length; i++){
            let polLvli = []
            //Corro todo los puntos de control hacia un lado.
            for(let j=0; j< this.puntosDeCotrol.length; j++){

                let x = this.puntosDeCotrol[j][0] + offset[i].getCoords()[0]
                let y = this.puntosDeCotrol[j][1] 
                let z = this.puntosDeCotrol[j][2] 
     
                polLvli.push(vec3.fromValues(x,y,z))

            }
            //Reacomodo el ultimo y el primero para que comienza simpre en el mismo lugar.
            polLvli[0][0] = polLvli[0][0] - 2 * offset[i].getCoords()[0]
            polLvli[this.puntosDeCotrol.length-1][0] = polLvli[this.puntosDeCotrol.length-1][0] - 2 * offset[i].getCoords()[0]
            

            // Ahora con los puntos de control modificados creo una curva y creo una superficie
            // de nivel para calcular el position y normal buffer para este nivel.
            let curvalvli = new CurvaGenerica([])
            for(let j=0; j<this.puntosDeCotrol.length-2; j++){
                curvalvli.concat(
                    new Curva(Bases.Bspline2,[
                        polLvli[j],
                        polLvli[j+1],
                        polLvli[j+2]
                    ])
                )
            }
            let discrtizacionPerfil = curvalvli.getDiscretizacion(perfilStep) 
            let supBarrido = new SuperficieBarrido(discrtizacionPerfil,[matrizlvl[i]])
            let posBuf = supBarrido.getPositionBuffer()
            let norBuf = supBarrido.getNormalBuffer()
            positionBuffer = positionBuffer.concat(posBuf)
            normalBuffer = normalBuffer.concat(norBuf)
        }

        // Para el indexbuffer solo necesito saber tamaño de la discretizacion del perfil y del recorrido.
        let curva = new CurvaGenerica([])
            for(let j=0; j<this.puntosDeCotrol.length-2; j++){
                curva.concat(
                    new Curva(Bases.Bspline2,[
                        this.puntosDeCotrol[j],
                        this.puntosDeCotrol[j+1],
                        this.puntosDeCotrol[j+2]
                    ])
                )
            }
        let discrtizacionPerfil = curva.getDiscretizacion(perfilStep) 
        let supBarrido = new SuperficieBarrido(discrtizacionPerfil,matrizlvl)
        indexBuffer = supBarrido.getIndexBuffer()


        this.objeto3d.setGeometria(
            positionBuffer,
            normalBuffer,
            indexBuffer,
        )
    }

    getRecorrido(step){
        var puntos = this.recorrido.getDiscretizacion(step)
        var recorrido = []
 
        for(var i=0; i< puntos.length; i++){

            var biNormal = puntos[i].getBiNormal()
            var normal = puntos[i].getNormal()
            var tang = puntos[i].getTang()
            var coords = puntos[i].getCoords()
            var matrizLvli = mat4.fromValues(
                    biNormal[0],biNormal[1],biNormal[2],0,
                    normal[0],normal[1],normal[2],0,
                    tang[0],tang[1],tang[2],0,
                    coords[0],coords[1],coords[2],1)
    
            recorrido.push(matrizLvli)
        }
        return recorrido
    }

    setPosicion(posición) {
        this.objeto3d.setPosicion(posición)
    }

    setEscala(escala) {
        this.objeto3d.setEscala(escala)
    }
    
    setRotacion(rotación) {
        this.objeto3d.setRotacion(rotación)
    }
    

    crearRecorrido(){
        let recorrido = new CurvaGenerica([
            new Curva(Bases.Bezier2,[
                vec3.fromValues(0,0,-40),  
                vec3.fromValues(0,0,0),
                vec3.fromValues(0,0,40)
            ]),
        ])
        recorrido.setBiNormal(vec3.fromValues(-1,0,0))
        this.recorrido= recorrido
    }

    crearDespOsilatorio(){
       
        this.despOsilatorio = new CurvaGenerica([
            new Curva(Bases.Bspline2,[
                vec3.fromValues(this.amplitud,0,0),
                vec3.fromValues(-this.amplitud,2,0),
                vec3.fromValues(this.amplitud,4,0),
            ]),
            new Curva(Bases.Bspline2,[
                vec3.fromValues(-this.amplitud,2,0),
                vec3.fromValues(this.amplitud,4,0),
                vec3.fromValues(-this.amplitud,6,0),
            ]),
            new Curva(Bases.Bspline2,[
                vec3.fromValues(this.amplitud,4,0),
                vec3.fromValues(-this.amplitud,6,0),
                vec3.fromValues(this.amplitud,8,0),
            ]),
            new Curva(Bases.Bspline2,[
                vec3.fromValues(-this.amplitud,6,0),
                vec3.fromValues(this.amplitud,8,0),
                vec3.fromValues(-this.amplitud,10,0)
            ]),
            new Curva(Bases.Bspline2,[
                vec3.fromValues(this.amplitud,8,0),
                vec3.fromValues(-this.amplitud,10,0),
                vec3.fromValues(this.amplitud,12,0),
            ]),

            new Curva(Bases.Bspline2,[
                vec3.fromValues(-this.amplitud,10,0),
                vec3.fromValues(this.amplitud,12,0),
                vec3.fromValues(-this.amplitud,14,0),
            ]),

            new Curva(Bases.Bspline2,[
                vec3.fromValues(this.amplitud,12,0),
                vec3.fromValues(-this.amplitud,14,0),
                vec3.fromValues(this.amplitud,16,0),
            ]),
        ])
    }
}