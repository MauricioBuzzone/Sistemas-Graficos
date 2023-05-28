
import {Curva, Bases} from './curva.js'
import { CurvaGenerica } from './curvaGenerica.js';
var vec3=glMatrix.vec3;
var mat4=glMatrix.mat4;
export class Torre{

    constructor(altura){
        let tramo1 = altura/3
        let tramo2 = 2*altura/3
        let tramo3 = altura
        let radio = 0.5
        
        this.perfil = new CurvaGenerica([
            
            new Curva(Bases.Bezier2,[
                vec3.fromValues(0,0,0),
                vec3.fromValues(0,-radio/2,0),
                vec3.fromValues(0,-radio,0),
            ]),
            new Curva(Bases.Bezier3,[
                vec3.fromValues(tramo1-2,-radio,0),
                vec3.fromValues(tramo1+2,-radio,0),
                vec3.fromValues(tramo1-2,-radio*2/3,0),
                vec3.fromValues(tramo1+2,-radio*2/3,0),
            ]),
            new Curva(Bases.Bezier3,[
                vec3.fromValues(tramo2-2,-radio*2/3,0),
                vec3.fromValues(tramo2+2,-radio*2/3,0),
                vec3.fromValues(tramo2-2,-radio/3,0),
                vec3.fromValues(tramo2+2,-radio/3,0),
            ]),
            new Curva(Bases.Bezier2,[
                vec3.fromValues(tramo2+2,-radio/3,0),
                vec3.fromValues(tramo3/2,-radio/3,0),
                vec3.fromValues(tramo3,-radio/3,0),
            ]),
            new Curva(Bases.Bezier2,[
                vec3.fromValues(tramo3,-radio/3,0),
                vec3.fromValues(tramo3,-radio/6,0),
                vec3.fromValues(tramo3,0,0),
            ]),
            new Curva(Bases.Bezier2,[
                vec3.fromValues(tramo3,0,0),
                vec3.fromValues(tramo3,radio/6,0),
                vec3.fromValues(tramo3,radio/3,0),
            ]),
            
            new Curva(Bases.Bezier2,[
                vec3.fromValues(tramo3,radio/3,0),
                vec3.fromValues(tramo3/2,radio/3,0),
                vec3.fromValues(tramo2+2,radio/3,0),
            ]),
            new Curva(Bases.Bezier3,[
                vec3.fromValues(tramo2+2,radio/3,0),
                vec3.fromValues(tramo2-2,radio/3,0),
                vec3.fromValues(tramo2+2,radio*2/3,0),
                vec3.fromValues(tramo2-2,radio*2/3,0),
            ]),
            new Curva(Bases.Bezier3,[
                vec3.fromValues(tramo1+2,radio*2/3,0),
                vec3.fromValues(tramo1-2,radio*2/3,0),
                vec3.fromValues(tramo1+2,radio,0),
                vec3.fromValues(tramo1-2,radio,0),
            ]),
            new Curva(Bases.Bezier2,[
                vec3.fromValues(0,radio,0),
                vec3.fromValues(0,radio/2,0),
                vec3.fromValues(0,0,0),
            ]),
        ])

        this.recorrido = new CurvaGenerica([
            new Curva(Bases.Bezier2,[
                vec3.fromValues(0,0,0.00001),
                vec3.fromValues(0,0.00001,0.00001),
                vec3.fromValues(0,0.00001,0),
            ]),
            new Curva(Bases.Bezier2,[
                vec3.fromValues(0,0.00001,0),
                vec3.fromValues(0,0.00001,-0.00001),
                vec3.fromValues(0,0,-0.00001),


            ]),
        
        ])
        this.recorrido.setBiNormal(vec3.fromValues(-1,0,0))
}

    getPerfil(step){
        return this.perfil.getDiscretizacion(step)


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