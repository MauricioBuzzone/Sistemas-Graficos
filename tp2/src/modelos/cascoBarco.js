import { Modelo } from './modelo.js';
import {Curva, Bases} from '../util/curva.js'
import { Objeto3D } from '../util/objeto3D.js';
import { CurvaGenerica } from '../util/curvaGenerica.js';
import {SuperficieBarrido} from '../util/superficieBarrido.js'
import {PhongConTextura} from '../materiales/phongConTextura.js'
var vec3=glMatrix.vec3;
var mat4=glMatrix.mat4;

export class CascoBarco extends Modelo{
    constructor(gl){
        super()
        this.stepPerfil = 0.1
        this.stepRecorrido = 1
        this.setPerfil()
        this.setRecorrido()
        this.setTapas(gl)
        let mat = new PhongConTextura(gl,'./maps/oxido.jpg')
        this.tapa1.setMaterial(mat)
        this.tapa2.setMaterial(mat)
        this.material = mat
    }



    setTapas(gl){
        let supBarrido = new SuperficieBarrido()
        var puntos = this.recorrido.getDiscretizacion(this.stepRecorrido)
        var recorridoTapa = []
        let inicio = puntos[0].getCoords()[2]
        let fin = puntos[puntos.length-1].getCoords()[2]

        let puntosDeControl = [
            vec3.fromValues(4,2,0),
            vec3.fromValues(0,2,0),
            vec3.fromValues(-4,2,0),  
            vec3.fromValues(-4,-2,0),
            vec3.fromValues(4,-2,0),
            vec3.fromValues(4,2,0),
        ]
        let perfilTapa = new CurvaGenerica([
            
            new Curva(Bases.Bezier2,[
                puntosDeControl[0],
                puntosDeControl[1],
                puntosDeControl[2],
            ]),
            
            new Curva(Bases.Bezier3,[
                puntosDeControl[2],
                puntosDeControl[3],
                puntosDeControl[4],
                puntosDeControl[5],
            ]),
        ])

        let tapa1 = mat4.fromValues(
            0,0,0,0,
            0,0,0,-1,
            0,0,0,inicio,
            0,0,0,1,
        )
        mat4.transpose(tapa1,tapa1)
        recorridoTapa.push(tapa1)
 
        tapa1 = mat4.fromValues(
            -1,0,0,0,
            0,1,0,0,
            0,0,1,inicio,
            0,0,0,1,
        )
        mat4.transpose(tapa1,tapa1)
        recorridoTapa.push(tapa1)

        this.tapa1 = new Objeto3D()
        let tapaBuffers = supBarrido.getBuffersTapas(
            perfilTapa.getDiscretizacion(this.stepPerfil),
            recorridoTapa,2,2,1,0,-1)
        this.tapa1.setGeometria(
            tapaBuffers[0], // positionBuffer
            tapaBuffers[1], // normalBuffer
            tapaBuffers[2], // indexBuffer
            tapaBuffers[3], // uvBuffer
        )
        this.agregarHijo(this.tapa1)


        recorridoTapa = []
        let tapa2 = mat4.fromValues(
            -1,0,0,0,
            0,1,0,0,
            0,0,1,fin,
            0,0,0,1,
        )
        mat4.transpose(tapa2,tapa2)
        recorridoTapa.push(tapa2)

        tapa2 = mat4.fromValues(
            0,0,0,0,
            0,0,0,-1,
            0,0,0,fin,
            0,0,0,1,
        )
        mat4.transpose(tapa2,tapa2)
        recorridoTapa.push(tapa2)

        this.tapa2 = new Objeto3D()
        tapaBuffers = supBarrido.getBuffersTapas(
            perfilTapa.getDiscretizacion(this.stepPerfil),
            recorridoTapa,1,1,-1)
        this.tapa2.setGeometria(
            tapaBuffers[0], // positionBuffer
            tapaBuffers[1], // normalBuffer
            tapaBuffers[2], // indexBuffer
            tapaBuffers[3], // uvBuffer
        )
        this.agregarHijo(this.tapa2)
    }
    setPerfil(){
        let puntosDeControl = [
            vec3.fromValues(4,2,0),
            vec3.fromValues(0,2,0),
            vec3.fromValues(-4,2,0),  
            vec3.fromValues(-4,-2,0),
            vec3.fromValues(4,-2,0),
            vec3.fromValues(4,2,0),
        ]
        this.perfil = new CurvaGenerica([
            new Curva(Bases.Bezier3,[
                puntosDeControl[2],
                puntosDeControl[3],
                puntosDeControl[4],
                puntosDeControl[5],
            ]),
        ])
    }

    setRecorrido(){
        let puntosDeControl = [
            vec3.fromValues(0,0,-6),
            vec3.fromValues(0,0,0),
            vec3.fromValues(0,0,6),
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
 

    getRecorrido(step){
       
        var puntos = this.recorrido.getDiscretizacion(step)
        var recorrido = []
         /*
        let inicioBarco = puntos[0].getCoords()[2]
        let finBarco = puntos[puntos.length-1].getCoords()[2]

        let tapa1 = mat4.fromValues(
            0,0,0,0,
            0,0,0,0,
            0,0,0,inicioBarco,
            0,0,0,1,
        )
        mat4.transpose(tapa1,tapa1)
        recorrido.push(tapa1)

        tapa1 = mat4.fromValues(
            -1,0,0,0,
            0,1,0,0,
            0,0,1,inicioBarco,
            0,0,0,1,
        )
        mat4.transpose(tapa1,tapa1)
        recorrido.push(tapa1)
            */
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
        /*
        let tapa2 = mat4.fromValues(
            -1,0,0,0,
            0,1,0,0,
            0,0,1,finBarco,
            0,0,0,1,
        )
        mat4.transpose(tapa2,tapa2)
        recorrido.push(tapa2)

        tapa2 = mat4.fromValues(
            0,0,0,0,
            0,0,0,0,
            0,0,0,finBarco,
            0,0,0,1,
        )
        mat4.transpose(tapa2,tapa2)
        recorrido.push(tapa2)
            */
        return recorrido
    }
}