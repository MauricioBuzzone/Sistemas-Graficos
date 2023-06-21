import {Curva, Bases} from '../util/curva.js'
import {CurvaGenerica} from '../util/curvaGenerica.js'
import { Modelo } from './modelo.js';

var vec3=glMatrix.vec3;
var mat4=glMatrix.mat4;

export class Carretera extends Modelo{ 
    constructor(altura){
        super()
        this.stepPerfil = 0.1
        this.stepRecorrido = 0.1
        this.setColor(183/255,187/255,186/255)
        this.setPerfil()
        this.setRecorrido(altura)
    }

    dibujar(matPadre, gl,shaderProgram, viewMatrix, projMatrix, normal) {
        if (this.buffers == null ){
            this.buffers = this.supBarrido.getBuffers(
                this.getPerfil(this.stepPerfil),
                this.getRecorrido(this.stepRecorrido)
            )
            let cantCurvas = this.perfil.curvas.length
            let disc = 1/this.stepPerfil +1
            let sizeBuffer = this.buffers[1].length
            
            for(let i=0; i< cantCurvas*disc*3*2 ;i+=3){
                this.buffers[1][i] = 0
                this.buffers[1][i+1] = 0
                this.buffers[1][i+2] = -1


                this.buffers[1][(sizeBuffer -1) - i] = 1
                this.buffers[1][(sizeBuffer -1) - i -1] = 0
                this.buffers[1][(sizeBuffer -1) - i -2] = 0

            }
            
            this.setGeometria(
                this.buffers[0], // positionBuffer
                this.buffers[1], // normalBuffer
                this.buffers[2], // indexBuffer
            )
        }
        super.dibujar(matPadre, gl, shaderProgram, viewMatrix, projMatrix,normal)
    }
    getRecorrido(step){
        var puntos = this.recorrido.getDiscretizacion(step)
        var recorrido = []
        
        let inicio = puntos[0].getCoords()[2]
        let fin = puntos[puntos.length-1].getCoords()[2]

        let tapa1 = mat4.fromValues(
            0,0,0,0,
            0,0,0,-1,
            0,0,0,inicio,
            0,0,0,1,
        )
        mat4.transpose(tapa1,tapa1)
        recorrido.push(tapa1)
 
        tapa1 = mat4.fromValues(
            -1,0,0,0,
            0,1,0,0,
            0,0,1,inicio,
            0,0,0,1,
        )
        mat4.transpose(tapa1,tapa1)
        recorrido.push(tapa1)
       
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
        
        let tapa2 = mat4.fromValues(
            -1,0,0,0,
            0,1,0,0,
            0,0,1,fin,
            0,0,0,1,
        )
        mat4.transpose(tapa2,tapa2)
        recorrido.push(tapa2)

        tapa2 = mat4.fromValues(
            0,0,0,0,
            0,0,0,-1,
            0,0,0,fin,
            0,0,0,1,
        )
        mat4.transpose(tapa2,tapa2)
        recorrido.push(tapa2)
        
        return recorrido
    }

    setRecorrido(altura){
        let puntosDeControl = [
            vec3.fromValues(0,0,-50),  
            vec3.fromValues(0,0,-37.5),
            vec3.fromValues(0,0,-30), 
            vec3.fromValues(0,altura,0), 
            vec3.fromValues(0,0,30), 
            vec3.fromValues(0,0,37.5), 
            vec3.fromValues(0,0,50), 
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
            vec3.fromValues(-2.5,-1,0),
            vec3.fromValues(0,-1,0),
            vec3.fromValues(2.5,-1,0),
            vec3.fromValues(2.5,0,0),
            vec3.fromValues(2.5,0,0),
            vec3.fromValues(2.25,0,0),
            vec3.fromValues(2,0,0),
            vec3.fromValues(1.95,0,0),
            vec3.fromValues(1.95,-0.2,0),
            vec3.fromValues(1.9,-0.2,0),
            vec3.fromValues(-1.9,-0.2,0),
            vec3.fromValues(-1.9,-0.2,0),
            vec3.fromValues(-1.95,-0.2,0),
            vec3.fromValues(-1.95,0,0),
            vec3.fromValues(-2,0,0),
            vec3.fromValues(-2.25,0,0),
            vec3.fromValues(-2.5,0,0),
            vec3.fromValues(-2.5,0,0), 
            vec3.fromValues(-2.5,-1,0), 
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