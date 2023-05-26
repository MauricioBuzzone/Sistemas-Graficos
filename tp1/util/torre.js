
import {Curva} from './curvas.js'
var vec3=glMatrix.vec3;
var mat4=glMatrix.mat4;
var radio = 0.5 
export class Torre{

    constructor(){
        this.perfil = new Curva("bezier2",[
            vec3.fromValues(-5,radio,0),
            vec3.fromValues(-2,radio,0),
            vec3.fromValues(0,radio,0),
        ])

        this.perfil.concat( new Curva("bezier3",[
            vec3.fromValues(0,radio,0),
            vec3.fromValues(1,radio,0),
            vec3.fromValues(1,radio*0.33,0),
            vec3.fromValues(2,radio*0.33,0)
        ]))

        this.perfil.concat( new Curva("bezier2",[
            vec3.fromValues(2,radio*0.33,0),
            vec3.fromValues(5,radio*0.33,0),
            vec3.fromValues(7,radio*0.33,0)
        ]))

        this.perfil.concat( new Curva("bezier3",[
            vec3.fromValues(7,radio*0.33,0),
            vec3.fromValues(8,radio*0.33,0),
            vec3.fromValues(8,radio*0.05,0),
            vec3.fromValues(9,radio*0.05,0)
        ]))

        this.perfil.concat( new Curva("bezier2",[
            vec3.fromValues(9,radio*0.05,0),
            vec3.fromValues(11,radio*0.05,0),
            vec3.fromValues(14,radio*0.05,0)
        ]))


        this.recorrido = new Curva("bezier2",[
            vec3.fromValues(0,0.5,0),  
            vec3.fromValues(0.5,0.5,0),
            vec3.fromValues(0.5,0,0),
        ])

        this.recorrido.concat( new Curva("bezier2",[
            vec3.fromValues(0.5,0,0),
            vec3.fromValues(0.5,-0.5,0), 
            vec3.fromValues(0,-0.5,0), 
        ]))
       
        this.recorrido.concat( new Curva("bezier2",[
            vec3.fromValues(0,-0.5,0), 
            vec3.fromValues(-0.5,-0.5,0), 
            vec3.fromValues(-0.5,0,0), 
        ]))

        this.recorrido.concat( new Curva("bezier2",[
            vec3.fromValues(-0.5,0,0), 
            vec3.fromValues(-0.5,0.5,0), 
            vec3.fromValues(0,0.5,0), 
        ]))

    }

    getPerfil(step){
        var discr = this.perfil.getDiscretizacion(step)
        return discr
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


}