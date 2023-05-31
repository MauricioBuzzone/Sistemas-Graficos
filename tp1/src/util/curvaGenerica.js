import {Curva} from './curva.js'

export class CurvaGenerica {
    constructor(curvas){
        this.curvas = curvas
    }

    setBiNormal(biNormal){
        for(let i=0; i < this.curvas.length; i++){
            this.curvas[i].setBiNormal(biNormal)
        }
    }

    getDiscretizacion(step){
        let discr = []
        for(let i=0; i < this.curvas.length; i++){
            var discrCurvai= this.curvas[i].getDiscretizacion(step)
            discr = discr.concat(discrCurvai)
        }
        return discr
    }

    concat(curva){
        this.curvas.push(curva)
    }
}