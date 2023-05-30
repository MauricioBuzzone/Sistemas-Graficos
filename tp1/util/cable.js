
import {Curva, Bases} from './curva.js'
import { CurvaGenerica } from './curvaGenerica.js';
var vec3=glMatrix.vec3;
var mat4=glMatrix.mat4;
export class Cable{

    constructor(){
        
        this.perfil = new CurvaGenerica([
            new Curva(Bases.Bezier2,[
                vec3.fromValues(0.1,0,0),
                vec3.fromValues(0.1,0.1,0),
                vec3.fromValues(0,0.1,0),
            ]),
            new Curva(Bases.Bezier2,[
                vec3.fromValues(0,0.1,0),
                vec3.fromValues(-0.1,0.1,0),
                vec3.fromValues(-0.1,0,0),
            ]),
            new Curva(Bases.Bezier2,[
                vec3.fromValues(-0.1,0,0),
                vec3.fromValues(-0.1,-0.1,0),
                vec3.fromValues(0,-0.1,0),
            ]),
            new Curva(Bases.Bezier2,[
                vec3.fromValues(0,-0.1,0),
                vec3.fromValues(0.1,-0.1,0),
                vec3.fromValues(0.1,0,0),
            ]),
        ])

        this.recorrido = new CurvaGenerica([
            new Curva(Bases.Bezier2,[
                vec3.fromValues(0,0,-25),
                vec3.fromValues(0,2,-15),
                vec3.fromValues(0,10,-10),

            ]),
            new Curva(Bases.Bezier2,[
                vec3.fromValues(0,10,-10),
                vec3.fromValues(0,0,0),
                vec3.fromValues(0,10,10),
            ]),
            new Curva(Bases.Bezier2,[
                vec3.fromValues(0,10,10),
                vec3.fromValues(0,2,15),
                vec3.fromValues(0,0,25),
            ]),
        ])
        this.recorrido.setBiNormal(vec3.fromValues(-1,0,0))
}

    getPerfil(step){
        return this.perfil.getDiscretizacion(step)
    }
    
    setRecorrido(recorrido){
        this.recorrido = recorrido
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