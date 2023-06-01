function GUI (parametros){
    var gui = new dat.GUI();		
    var f1 = gui.addFolder('Menú');		

    f1.add(parametros.puente, 'alturaAct', parametros.puente.alturaMin, parametros.puente.alturaMax)
        .name("altura puente")
        .step(1)
        .onChange(function(alturaPuente){
            parametros.puente.alturaAct = alturaPuente
        }
    );

    f1.add(parametros.torres, 'alturaTorre', parametros.torres.alturaMin, parametros.torres.alturaMax)
        .name("altura torres")
        .step(1)
        .onChange(function(alturaTorre){
            parametros.torres.alturaTorre = alturaTorre
        }
    );

    f1.add(parametros.rio, 'alturaAct', parametros.rio.alturaMin, parametros.rio.alturaMax)
        .name("altura rio")
        .step(0.5)
        .onChange(function(altura){
            parametros.rio.alturaAct = altura     
        }
    );
    f1.add(parametros.tensores, 'separacionTensores', -10.0, 30.0).name("separacion tensores").step(1);

    f1.add(parametros, 'normal').name("normales");    
    
    f1.add(parametros, 'generar').name("generar");
    f1.open(); 
};
