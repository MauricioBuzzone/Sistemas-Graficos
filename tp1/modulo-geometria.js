

/*

    Tareas:
    ------

    1) Modificar a función "generarSuperficie" para que tenga en cuenta los parametros filas y columnas al llenar el indexBuffer
       Con esta modificación deberían poder generarse planos de N filas por M columnas

    2) Modificar la funcion "dibujarMalla" para que use la primitiva "triangle_strip"

    3) Crear nuevos tipos funciones constructoras de superficies

        3a) Crear la función constructora "Esfera" que reciba como parámetro el radio

        3b) Crear la función constructora "TuboSenoidal" que reciba como parámetro la amplitud de onda, longitud de onda, radio del tubo y altura.
        (Ver imagenes JPG adjuntas)
        
        
    Entrega:
    -------

    - Agregar una variable global que permita elegir facilmente que tipo de primitiva se desea visualizar [plano,esfera,tubosenoidal]
    
*/
var mallaDeTriangulos;


function crearGeometria(geometria,filas,columnas){
        
    var superficie3D;
    if(geometria == "plano"){
        superficie3D = new Plano(3, 3);
    }else if(geometria ==  "esfera"){
        superficie3D = new Esfera(2);
        return generarSuperficie(new Esfera(2),filas,columnas);
    }else if(geometria == "tubo") {
        return generarSuperficie(new TuboSenoidal(0.1,10*Math.PI,1,2),filas,columnas);
    }
    return generarSuperficie(superficie3D,filas,columnas);
    
}

function dibujarGeometria(){

    dibujarMalla(mallaDeTriangulos);

}

function TuboSenoidal(amplitudOnda, longitudOnda, radio , altura){
    
    this.getPosicion= function(u,v){
        var x = (radio + amplitudOnda * Math.cos(u * longitudOnda)) * Math.cos(v*2*Math.PI) 
        var z = (radio + amplitudOnda * Math.cos(u * longitudOnda)) * Math.sin(v*2*Math.PI)
        var y = u * altura
        return [x,y,z]
    }

    this.getNormal = function(u,v){
        var dx_u = - amplitudOnda * longitudOnda *  Math.sin(u * longitudOnda) * Math.cos(v*2*Math.PI)
        var dy_u = altura
        var dz_u = - amplitudOnda * longitudOnda *  Math.sin(u * longitudOnda) * Math.sin(v*2*Math.PI)


        var dx_v = - (radio + amplitudOnda * Math.cos(u * longitudOnda)) * Math.sin(v*2*Math.PI) 
        var dy_v = 0
        var dz_v = (radio + amplitudOnda * Math.cos(u * longitudOnda)) * Math.cos(v*2*Math.PI)
        
        
        return [(dy_u * dz_v),(dz_u * dx_v - dx_u * dz_v),(-dy_u * dx_v)]
    }

    this.getCoordenadasTextura = function(u,v){
        return [0.5,0]
    }
}
function Esfera(radio){

    this.getPosicion= function(u,v){
        var x = radio * Math.sin(u*Math.PI)* Math.cos(v*2*Math.PI)
        var z = radio * Math.sin(u*Math.PI)* Math.sin(v*2*Math.PI)
        var y = radio * Math.cos(u*Math.PI)
        return [x,y,z]
    }

    this.getNormal = function(u,v){
        var x = Math.sin(u*Math.PI)* Math.cos(v*2*Math.PI)
        var z = Math.sin(u*Math.PI)* Math.sin(v*2*Math.PI)
        var y = Math.cos(u*Math.PI)
        return [x,y,z]
    }

    this.getCoordenadasTextura = function(u,v){
        return [0,0.1];
    }
}

function Plano(ancho,largo){

    this.getPosicion=function(u,v){

        var x=(u-0.5)*ancho;
        var z=(v-0.5)*largo;
        return [x,0,z];
    }

    this.getNormal=function(u,v){
        return [0,1,0];
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}




function generarSuperficie(superficie,filas,columnas){
    
    positionBuffer = [];
    normalBuffer = [];
    uvBuffer = [];

    for (var i=0; i <= filas; i++) {
        for (var j=0; j <= columnas; j++) {

            var u=i/filas;
            var v=j/columnas;

            var pos=superficie.getPosicion(u,v);

            positionBuffer.push(pos[0]);
            positionBuffer.push(pos[1]);
            positionBuffer.push(pos[2]);

            var nrm=superficie.getNormal(u,v);

            normalBuffer.push(nrm[0]);
            normalBuffer.push(nrm[1]);
            normalBuffer.push(nrm[2]);

            var uvs=superficie.getCoordenadasTextura(u,v);

            uvBuffer.push(uvs[0]);
            uvBuffer.push(uvs[1]);

        }
    }

    //trianglesVerticeBuffer = gl.createBuffer();
    //gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);    
            

    //trianglesNormalBuffer = gl.createBuffer();
    //gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);

    // Buffer de indices de los triángulos
    indexBuffer=[];  
    filas_vertices = filas + 1
    columnas_vertices =  columnas + 1
    
    for (i=0; i < filas_vertices - 1 ; i++) {
        for (j=0; j < columnas_vertices ; j++) {

            index_vert_sup = j + i  * columnas_vertices
            index_vert_inf = j + (i + 1) * columnas_vertices
 
            indexBuffer.push(index_vert_sup)
            indexBuffer.push(index_vert_inf)
        }

        if (i < filas_vertices - 2){
            indexBuffer.push((i + 2)* columnas_vertices - 1)
            indexBuffer.push((i + 1)* columnas_vertices)
        }
    }

    //trianglesIndexBuffer = gl.createBuffer();
    //trianglesIndexBuffer.number_vertex_point = indexBuffer.length;
    //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesIndexBuffer);
    //gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);

    return [
        positionBuffer,
        normalBuffer,
        indexBuffer
    ]
        
    //webgl_uvs_buffer = gl.createBuffer();
    //gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);

}

function dibujarMalla(mallaDeTriangulos){
    
    // Se configuran los buffers que alimentaron el pipeline
    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mallaDeTriangulos.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_uvs_buffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mallaDeTriangulos.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_normal_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mallaDeTriangulos.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
       
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mallaDeTriangulos.webgl_index_buffer);


    if (modo!="wireframe"){
        gl.uniform1i(shaderProgram.useLightingUniform,(lighting=="true"));                    
        /*
            Aqui es necesario modificar la primitiva por triangle_strip
        */
        gl.drawElements(gl.TRIANGLE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    
    if (modo!="smooth") {
        gl.uniform1i(shaderProgram.useLightingUniform,false);
        gl.drawElements(gl.LINE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
 
}

