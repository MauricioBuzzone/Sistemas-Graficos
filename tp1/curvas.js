var vec3=glMatrix.vec3;

export class Curva {
    constructor(tipo, puntosDeControl){
        this.bases = []
        this.basesder = []
        this.puntosDeControl= []
        this.curvas = []

        this.setBases(tipo)
        this.setPuntosDeControl(puntosDeControl)
    }


    setBases(tipo){
        if(tipo == "bezier3"){
            this.bases[0] = function(u) { return (1-u)*(1-u)*(1-u);}  // 1*(1-u) - u*(1-u) = 1-2u+u2  ,  (1-2u+u2) - u +2u2- u3 ,  1 - 3u +3u2 -u3
            this.bases[1] = function(u) { return 3*(1-u)*(1-u)*u; }   // 3*(1-u)*(u-u2) , 3*(u-u2-u2+u3), 3u -6u2+2u3
            this.bases[2] = function(u) { return 3*(1-u)*u*u;}        //3u2-3u3
            this.bases[3] = function(u) { return u*u*u; }             // u^3


            this.basesder[0] = function(u) { return -3*u*u+6*u-3;}    //-3u2 +6u -3
            this.basesder[1] = function(u) { return 9*u*u-12*u+3; }   // 9u2 -12u +3
            this.basesder[2] = function(u) { return -9*u*u+6*u;}	  // -9u2 +6u
            this.basesder[3] = function(u) { return 3*u*u; }	      // 3u2
        }

        if(tipo == "bezier2"){
            this.bases[0] = function(u) { return (1-u)*(1-u);} 	      // (1-u)^2
            this.bases[1] = function(u) { return 2*u*(1-u); }	      // 2*u*(1-u)
            this.bases[2] = function(u) { return u*u;}			      // u^2

            this.basesder[0] = function(u) { return -2+2*u; } 
            this.basesder[1] = function(u) { return 2-4*u; }  
            this.basesder[2] = function(u) { return 2*u; }	
        }

        if(tipo == "bspline3"){
            this.bases[0] = function(u) { return (1-3*u+3*u*u-u*u*u)*1/6;}  // (1 -3u +3u2 -u3)/6
            this.bases[1] = function(u) { return (4-6*u*u+3*u*u*u)*1/6; }   // (4  -6u2 +3u3)/6
            this.bases[2] = function(u) { return (1+3*u+3*u*u-3*u*u*u)*1/6} // (1 -3u +3u2 -3u3)/6
            this.bases[3] = function(u) { return (u*u*u)*1/6; }             //  u3/6
 
            this.basesder[0] = function(u) { return (-3 +6*u -3*u*u)/6 }    // (-3 +6u -3u2)/6
            this.basesder[1] = function(u) { return (-12*u+9*u*u)/6 }       // (-12u +9u2)  /6
            this.basesder[2] = function(u) { return (3+6*u-9*u*u)/6;}	    // (-3 +6u -9u2)/6
            this.basesder[3] = function(u) { return (3*u*u)*1/6; }	
        }


        if(tipo == "bspline2"){
            this.bases[0] = function(u) { return 0.5*(1-u)*(1-u);}           // 0.5*(1-u)^2
            this.bases[1] = function(u) { return 0.5+u*(1-u);} 		         // 0.5+ u*(1-u)
            this.bases[2] = function(u) { return 0.5*u*u; } 			     // 0.5*u^2
    
            this.basesder[0] = function(u) { return -1+u;} 
            this.basesder[1] = function(u) { return  1-2*u;} 
            this.basesder[2] = function(u) { return  u;}
        }

    }

    setPuntosDeControl(puntosDeControl){
        this.puntosDeControl = puntosDeControl
    }

    concat(curva){
        this.curvas.push(curva)
    }
    getDiscretizacion(step){
        var discretizacion = []
        var discretizacionTang = []
        var discretizacionNor = []
        var discretizacionBiNor = []


        for(let u=0; u<=1; u+=step){
            var x = 0, y = 0, z = 0
            var xt = 0, yt = 0, zt = 0

            for(let i=0; i < this.puntosDeControl.length; i++){
                x += this.bases[i](u)*this.puntosDeControl[i][0]
                y += this.bases[i](u)*this.puntosDeControl[i][1]

                xt += this.basesder[i](u)*this.puntosDeControl[i][0]
                yt += this.basesder[i](u)*this.puntosDeControl[i][1]
            }

            var tangente = vec3.fromValues(xt,yt,zt)
            var binormal = vec3.fromValues(0,0,1)
            var normal = vec3.create()
            vec3.cross(normal, binormal, tangente);
            vec3.normalize(normal, normal);


            discretizacion.push(vec3.fromValues(x,y,z))
            discretizacionTang.push(tangente)
            discretizacionNor.push(normal)
            discretizacionBiNor.push(binormal)
        }

        for(let i = 0; i < this.curvas.length; i++){
            var [discSig, discTangSig, discNorSig, discBiNorSig] = this.curvas[i].getDiscretizacion(step)

            discretizacion = discretizacion.concat(discSig)
            discretizacionTang = discretizacionTang.concat(discTangSig)
            discretizacionNor = discretizacionNor.concat(discNorSig)
            discretizacionBiNor = discretizacionBiNor.concat(discBiNorSig)
        }

        return [discretizacion,discretizacionTang,discretizacionNor,discretizacionBiNor]
    }
}

