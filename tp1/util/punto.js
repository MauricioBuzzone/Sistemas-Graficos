export class Punto {
    constructor(coords, tangente, normal, biNormal){
        this.coords = coords;
        this.tangente = tangente;
        this.normal = normal;
        this.biNormal = biNormal;
    }

    getCoords(){
        return this.coords
    }

    getTang(){
        return this.tangente
    }

    getNormal(){
        return this.normal
    }
    
    getBiNormal(){
        return this.biNormal
    }
}