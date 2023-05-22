
import {Curva} from '../curvas.js'
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
        var [discretizacion,
            discretizacionTang,
            discretizacionNor,
            discretizacionBiNor] = this.perfil.getDiscretizacion(step)
        return discretizacion
    }


    getRecorrido(step){
        var [disc,
            discTang,
            discNor,
            discBiNor] = this.recorrido.getDiscretizacion(step)

        var recorrido = []
        for(var i=0; i< disc.length; i++){
            var matrizLvli = mat4.fromValues(
                discBiNor[i][0],discBiNor[i][1],discBiNor[i][2],0,
                discNor[i][0],discNor[i][1],discNor[i][2],0,
                discTang[i][0],discTang[i][1],discTang[i][2],0,
                disc[i][0],disc[i][1],disc[i][2],1)
            
            recorrido.push(matrizLvli)
            

            console.log("Normal",discNor[i])

        }
        return recorrido
    }


}