import { Objeto3D } from './objeto3D.js';

var vec3=glMatrix.vec3;

export const Estrategia = {
	Orbital: Symbol('Orbital'),
	Drone: Symbol('Drone'),
	Drone: Symbol('Barco'),
}
const orbitalId  = '1'
const droneId  = '2'
const barcoId  = '3'

export class Camara {
    constructor(){

        this.estrategias = [
            new Orbital(),
            new Drone(),
            new CamaraBarco(),
        ]
        this.camaraActual = this.estrategias[0]
    }

    setEstrategia(estrategia){
        if(estrategia == Estrategia.Orbital){
            this.camaraActual =  this.estrategias[0]
        }
        else if(estrategia == Estrategia.Drone){
            this.camaraActual = this.estrategias[1]
        }else{
            this.camaraActual = this.estrategias[2]
        }
    }

    handler(event){
        switch(event.key){
            case orbitalId:
               this.setEstrategia(Estrategia.Orbital)
            break
            case droneId:
                this.setEstrategia(Estrategia.Drone)
            break 
            case barcoId:
                this.setEstrategia(Estrategia.Barco)
            break
        }
        this.camaraActual.handler(event)
    }

    getViewParameters(){
        return this.camaraActual.getViewParameters()
    }

    setBarcoInfo(barco,padreBarco){
        this.estrategias[2].setInfo(barco,padreBarco)
    }
}

class CamaraBarco {
    constructor(){
        this.barco = null
        this.padreBarco = null
        this.posCamara = vec3.fromValues(0,5,20)
    }
    setInfo(barco,padreBarco){

        this.barco = barco
        this.padreBarco = padreBarco
    }
    handler(event){
        
    }

    getViewParameters(){
        let wordposBarco = this.padreBarco.localToWorld(this.barco.getPosicion())
        let wordposCamara = this.barco.localToWorld( this.posCamara)
        var viewParameters = {
            eye: wordposCamara,
            center: wordposBarco,
            up: [0,1,0]
        }      

        return viewParameters
    }
}

class Drone {
    constructor(){
        this.previousClientX;
        this.previousClientY;
        this.radio = 5;
        this.alfa = 0;
        this.beta = Math.PI/2;
        this.factorVelocidad = 0.01;
    
        this.isMouseDown = false;
    
    
        this.mouse = {x: 0, y: 0};
    
        this.angle = 0

        this.eye = new Objeto3D()
        this.eye.setPosicion(vec3.fromValues(0,0,-30))

        this.target = new Objeto3D()
        this.target.setPosicion(vec3.fromValues(0,0,30))

        this.eye.agregarHijo(this.target)

        this.adelante = vec3.fromValues(0,0,0.1);
        this.derecha =  vec3.fromValues(0.1,0,0);
        this.arriba = 0.1

    }

    handler(event){
        switch(event.type){
            case 'keydown':
                this.handlerKeydown(event)
            break
            
            case 'mousemove':
                if (this.isMouseDown){
                    this.mouse.x = event.clientX || event.pageX;
                    this.mouse.y = event.clientY || event.pageY;
                } else {
                    this.mouse.x = event.clientX || event.pageX;
                    this.mouse.y = event.clientY || event.pageY;    
                    this.previousClientX =  this.mouse.x;
                    this.previousClientY =  this.mouse.y;
                }
            break 

            case 'mousedown':
                this.isMouseDown = true;    
            break

            case 'mouseup':
                this.isMouseDown = false;    
            break
        }
    }
    handlerKeydown(event){
        let posActual = this.eye.getPosicion()
        switch(event.key){
            case "a":
                this.eye.setPosicion(
                    vec3.fromValues(
                        posActual[0]+this.derecha[0],
                        posActual[1],
                        posActual[2]+this.derecha[2],
                    )
                )
            break;
            case "d":
                this.eye.setPosicion(
                    vec3.fromValues(
                        posActual[0]-this.derecha[0],
                        posActual[1],
                        posActual[2]-this.derecha[2],
                    )
                )
            break;
            case "w":
                this.eye.setPosicion(
                    vec3.fromValues(
                        posActual[0]+this.adelante[0],
                        posActual[1],
                        posActual[2]+this.adelante[2],
                    )
                )
            break;  
            case "s":
                this.eye.setPosicion(
                    vec3.fromValues(
                        posActual[0]-this.adelante[0],
                        posActual[1],
                        posActual[2]-this.adelante[2],
                    )
                )
            break;
            case " ":
                this.eye.setPosicion(
                    vec3.fromValues(
                        posActual[0],
                        posActual[1]+this.arriba,
                        posActual[2],
                    )
                )
            break;
            case "c":
                this.eye.setPosicion(
                    vec3.fromValues(
                        posActual[0],
                        posActual[1]-this.arriba,
                        posActual[2],
                    )
                )
            break;

    
            case "q":
                this.angle +=0.1
                this.eye.setRotacion([this.angle,[0,1,0]])
 
            break; 
            case "e":
                this.angle -=0.1
                this.eye.setRotacion([this.angle,[0,1,0]])
            break;   
        }      
    }
    getViewParameters(){

        if (this.isMouseDown) {
            var deltaX=0;
            var deltaY=0;
    
            if (this.previousClientX) deltaX = this.mouse.x - this.previousClientX;
            if (this.previousClientY) deltaY = this.mouse.y - this.previousClientY;
    
            this.previousClientX = this.mouse.x;
            this.previousClientY = this.mouse.y;

            this.alfa = this.alfa + deltaX * this.factorVelocidad;
            this.beta = this.beta + deltaY * this.factorVelocidad;
    
            if (this.beta<0) this.beta=0;
            if (this.beta>Math.PI) this.beta=Math.PI;
    
        }


        this.adelante = vec3.fromValues(0,0,0.1);
        this.derecha =  vec3.fromValues(0.1,0,0);
        vec3.rotateY(this.adelante,this.adelante,[0,0,0],this.angle)
        vec3.rotateY(this.derecha,this.derecha,[0,0,0],this.angle)
        
        let x = this.radio * Math.sin(this.alfa) * Math.sin(this.beta)
        let y = this.radio * Math.cos(this.beta)
        let z = this.radio * Math.cos(this.alfa) * Math.sin(this.beta)
        this.target.setPosicion(vec3.fromValues(x,y,z))
        let target = this.eye.localToWorld(vec3.fromValues(x,y,z))

        var viewParameters = {
            eye: this.eye.getPosicion(),
            center: target,
            up: [0,1,0]
        }      

        return viewParameters
    }
}

class Orbital {
    constructor(){
        this.previousClientX = 0;
        this.previousClientY = 0;
        this.radio = 30;
        this.alfa = 0;
        this.beta = Math.PI/2;
        this.factorVelocidad = 0.01;
        this.isMouseDown = false;
	    this.mouse = {x: 0, y: 0};
    }

    handler(event){
        switch(event.type){
            case 'keydown':
            
            break
            case 'mousewheel':
                if (event.originalEvent.deltaY > 0){
                    this.radio +=this.factorVelocidad*150
                }else{
                    this.radio -=this.factorVelocidad*150
                }
    
            break 
            case 'mousemove':
                if (this.isMouseDown){
                    this.mouse.x = event.clientX || event.pageX;
                    this.mouse.y = event.clientY || event.pageY;
                } else {
                    this.mouse.x = event.clientX || event.pageX;
                    this.mouse.y = event.clientY || event.pageY;    
                    this.previousClientX =  this.mouse.x;
                    this.previousClientY =  this.mouse.y;
                }
            break 

            case 'mousedown':
                this.isMouseDown = true;    
            break

            case 'mouseup':
                this.isMouseDown = false;    
            break
        }
    }

    getViewParameters(){

        if (this.isMouseDown) {
            var deltaX=0;
            var deltaY=0;
    
            if (this.previousClientX) deltaX = this.mouse.x - this.previousClientX;
            if (this.previousClientY) deltaY = this.mouse.y - this.previousClientY;
    
            this.previousClientX = this.mouse.x;
            this.previousClientY = this.mouse.y;

            this.alfa = this.alfa + deltaX * this.factorVelocidad;
            this.beta = this.beta + deltaY * this.factorVelocidad;
    
            if (this.beta<0) this.beta=0;
            if (this.beta>Math.PI) this.beta=Math.PI;
    
        }

        var x = this.radio * Math.sin(this.alfa) * Math.sin(this.beta)
        var y = this.radio * Math.cos(this.beta)
        var z = this.radio * Math.cos(this.alfa) * Math.sin(this.beta)


        var viewParameters = {
            eye: [x,y,z],
            center: [0,0,0],
            up: [0,1,0]
        }      
        return viewParameters
    }
}
