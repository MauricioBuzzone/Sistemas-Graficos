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

    getDistancia(punto){
        let x = Math.pow(this.coords[0] - punto.coords[0],2)
        let y = Math.pow(this.coords[1] - punto.coords[1],2)
        let z = Math.pow(this.coords[2] - punto.coords[2],2)
        return  Math.sqrt(x+y+z)
    }
}