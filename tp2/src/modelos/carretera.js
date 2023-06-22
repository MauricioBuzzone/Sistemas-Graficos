import {Curva, Bases} from '../util/curva.js'
import {CurvaGenerica} from '../util/curvaGenerica.js'
import { Objeto3D } from '../util/objeto3D.js';
import {SuperficieBarrido} from '../util/superficieBarrido.js'
import {PhongConTextura} from '../materiales/phongConTextura.js'

var vec3=glMatrix.vec3;
var mat4=glMatrix.mat4;

export class Carretera extends Objeto3D{ 
    constructor(gl,altura){
        super()
        let stepPerfil = 0.1
        let stepRecorrido = 0.1
        let supBarrido = new SuperficieBarrido()
        this.recorridoDisc = this.recorrido(altura).getDiscretizacion(stepPerfil)

        this.vereda = new Objeto3D()
        let perfilVereda = this.perfilVereda()
        let recorrido = this.recorrido(altura)
        let veredaBuffers = supBarrido.getBuffers(
                                perfilVereda.getDiscretizacion(stepPerfil),
                                this.getRecorrido(recorrido,stepRecorrido),1,10)
        this.vereda.setGeometria(
            veredaBuffers[0], // positionBuffer
            veredaBuffers[1], // normalBuffer
            veredaBuffers[2], // indexBuffer
            veredaBuffers[3], // uvBuffer
        )
        this.vereda.setMaterial(new PhongConTextura(gl,'./maps/concrete_wall_008_diff_1k.jpg'))
        this.agregarHijo(this.vereda)


        this.ruta = new Objeto3D()
        let perfilRuta = this.perfilRuta()
        let rutaBuffers = supBarrido.getBuffers(
                                perfilRuta.getDiscretizacion(1),
                                this.getRecorrido(recorrido,stepRecorrido),1,10)
        this.ruta.setGeometria(
            rutaBuffers[0], // positionBuffer
            rutaBuffers[1], // normalBuffer
            rutaBuffers[2], // indexBuffer
            rutaBuffers[3], // uvBuffer
        )
        this.ruta.setMaterial(new PhongConTextura(gl,'./maps/tramo-doblemarilla.jpg'))
        this.ruta.setPosicion(vec3.fromValues(0,-0.19,0))
        this.agregarHijo(this.ruta)

       
        var puntos = recorrido.getDiscretizacion(stepRecorrido)
        var recorridoTapa = []
        let inicio = puntos[0].getCoords()[2]
        let fin = puntos[puntos.length-1].getCoords()[2]

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
            perfilVereda.getDiscretizacion(stepPerfil),
            recorridoTapa,2,2,1,0,-1)
        this.tapa1.setGeometria(
            tapaBuffers[0], // positionBuffer
            tapaBuffers[1], // normalBuffer
            tapaBuffers[2], // indexBuffer
            tapaBuffers[3], // uvBuffer
        )
        this.tapa1.setMaterial(new PhongConTextura(gl,'./maps/tramo-doblemarilla.jpg'))
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
            perfilVereda.getDiscretizacion(stepPerfil),
            recorridoTapa,1,1,-1)
        this.tapa2.setGeometria(
            tapaBuffers[0], // positionBuffer
            tapaBuffers[1], // normalBuffer
            tapaBuffers[2], // indexBuffer
            tapaBuffers[3], // uvBuffer
        )
        this.tapa2.setMaterial(new PhongConTextura(gl,'./maps/tramo-doblemarilla.jpg'))
        this.agregarHijo(this.tapa2)
    }

    getRecorrido(recorrido,step){
        var puntos = recorrido.getDiscretizacion(step)
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

    recorrido(altura){
        let puntosDeControl = [
            vec3.fromValues(0,0,-50),  
            vec3.fromValues(0,0,-37.5),
            vec3.fromValues(0,0,-30), 
            vec3.fromValues(0,altura,0), 
            vec3.fromValues(0,0,30), 
            vec3.fromValues(0,0,37.5), 
            vec3.fromValues(0,0,50), 
        ]

        var recorrido = new CurvaGenerica([
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
        recorrido.setBiNormal(vec3.fromValues(-1,0,0))

        return recorrido
    }

    perfilRuta(){
        let puntosDeControl = [
            vec3.fromValues(2,0,0),  
            vec3.fromValues(0,0,0),
            vec3.fromValues(-2,0,0), 
        ]
        return new CurvaGenerica([
            new Curva(Bases.Bezier2,[
                puntosDeControl[0],
                puntosDeControl[1],
                puntosDeControl[2],
            ])
        ])
    }
    perfilVereda(){
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
        return new CurvaGenerica([
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