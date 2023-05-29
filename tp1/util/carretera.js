import {Curva, Bases} from './curva.js'
import {CurvaGenerica} from './curvaGenerica.js'
var vec3=glMatrix.vec3;
var mat4=glMatrix.mat4;

export class Carretera{
    constructor(altura){

        this.perfil = new CurvaGenerica([
            new Curva(Bases.Bezier2,[
                vec3.fromValues(-10,-1,0),
                vec3.fromValues(0,-1,0),
                vec3.fromValues(10,-1,0),
            ]),
            new Curva(Bases.Bezier2,[
                vec3.fromValues(10,-1,0),
                vec3.fromValues(10,0,0),
                vec3.fromValues(10,0,0)
            ]),
            new Curva(Bases.Bezier2,[
                vec3.fromValues(10,0,0),
                vec3.fromValues(9,0,0),
                vec3.fromValues(8,0,0)
            ]),
            new Curva(Bases.Bezier3,[
                vec3.fromValues(8,0,0),
                vec3.fromValues(7.8,0,0),
                vec3.fromValues(7.8,-0.2,0),
                vec3.fromValues(7.6,-0.2,0)
            ]),
            new Curva(Bases.Bezier2,[
                vec3.fromValues(7.6,-0.2,0),
                vec3.fromValues(-7.6,-0.2,0),
                vec3.fromValues(-7.6,-0.2,0)
            ]),
            new Curva(Bases.Bezier3,[
                vec3.fromValues(-7.6,-0.2,0),
                vec3.fromValues(-7.8,-0.2,0),
                vec3.fromValues(-7.8,0,0),
                vec3.fromValues(-8,0,0),
            ]),
            new Curva(Bases.Bezier2,[
                vec3.fromValues(-8,0,0),  
                vec3.fromValues(-9,0,0),
                vec3.fromValues(-10,0,0),
            ]),
            new Curva(Bases.Bezier2,[
                vec3.fromValues(-10,0,0), 
                vec3.fromValues(-10,0,0), 
                vec3.fromValues(-10,-1,0), 
            ])
        ])

        this.recorrido = new CurvaGenerica([
            new Curva(Bases.Bezier2,[
                vec3.fromValues(0,0,-20),  
                vec3.fromValues(0,0,-12),
                vec3.fromValues(0,0,-10)
            ]),
            new Curva(Bases.Bezier2,[
                vec3.fromValues(0,0,-10), 
                vec3.fromValues(0,altura,0), 
                vec3.fromValues(0,0,10)
            ]),
            new Curva(Bases.Bezier2,[
                vec3.fromValues(0,0,10), 
                vec3.fromValues(0,0,15), 
                vec3.fromValues(0,0,20), 
            ])
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