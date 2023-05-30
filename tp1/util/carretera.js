import {Curva, Bases} from './curva.js'
import {CurvaGenerica} from './curvaGenerica.js'
import {Objeto3D} from '../objeto3D.js'
import {SuperficieBarrido} from './superficieBarrido.js'

var vec3=glMatrix.vec3;
var mat4=glMatrix.mat4;

export class Carretera extends Objeto3D{ 
    constructor(altura){
        super()
        this.perfil = null
        this.recorrido = null
        this.stepPerfil = 0.1
        this.stepRecorrido = 0.1
        this.buffers = null
        this.supBarrido = new SuperficieBarrido()

        this.setPerfil()
        this.setRecorrido(altura)
    }
    
    dibujar(matPadre, gl, viewMatrix, projMatrix) {
        if (this.buffers == null ){
            this.buffers = this.supBarrido.getBuffers(
                this.getPerfil(this.stepPerfil),
                this.getRecorrido(this.stepRecorrido)
            )
        }
    
        this.setGeometria(
            this.buffers[0], // positionBuffer
            this.buffers[1], // normalBuffer
            this.buffers[2], // indexBuffer
        )
        super.dibujar(matPadre, gl, viewMatrix, projMatrix)
    }

    getPerfil(step){
        return this.perfil.getDiscretizacion(step)
    }

    getRecorridoDisc(step){
        return this.recorrido.getDiscretizacion(step)
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