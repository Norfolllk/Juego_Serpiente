    // 1. Capturamos el canvas y su contexto de dibujo
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");
let intervaloSerpiente;
let direccionActual = "derecha";
let puntaje = 0;
const TAMANIO_CELDA = 25;
const serpiente = [
  { x: (canvas.width / 2) / TAMANIO_CELDA,       y: (canvas.height / 2) / TAMANIO_CELDA },
  { x: (canvas.width / 2) / TAMANIO_CELDA - 1,   y: (canvas.height / 2) / TAMANIO_CELDA },
  { x: (canvas.width / 2) / TAMANIO_CELDA - 2,   y: (canvas.height / 2) / TAMANIO_CELDA },
  { x: (canvas.width / 2) / TAMANIO_CELDA,       y: (canvas.height / 2) / TAMANIO_CELDA + 1 }
];

let comida = {
  comidaX: 10,
  comidaY: 10
}


    // Generamos la primera comida antes de dibujar el juego
    generarComida();
    // Primera pintura del juego al cargar la página
    dibujarTodo();
 
    // =========================
    // FUNCIONES DE DIBUJO
    // =========================
 
    function limpiarCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
 
    function dibujarTodo() {
      limpiarCanvas();
      dibujarTablero();
      pintarSerpiente();
      pintarComida();  
    }
 
    function dibujarTablero(){
 
      for (let x=0 ; x<=canvas.width ; x=x+TAMANIO_CELDA){
      ctx.strokeStyle = "#050069";
      ctx.beginPath();
      ctx.moveTo(x,0);
      ctx.lineTo(x,canvas.height);
      ctx.stroke();
      }
 
      for (let y=0 ; y<=canvas.height ; y=y+TAMANIO_CELDA){
      ctx.strokeStyle = "#050069";
      ctx.beginPath();
      ctx.moveTo(0,y);
      ctx.lineTo(canvas.width,y);
      ctx.stroke();
      }
    }
 
    function pintarParte(lineaX,lineaY){
 
      let valorX = lineaX * TAMANIO_CELDA;
      let valorY = lineaY * TAMANIO_CELDA;
 
      ctx.fillRect(valorX, valorY, TAMANIO_CELDA, TAMANIO_CELDA);
 
      ctx.strokeStyle = "#ffffff";
      ctx.strokeRect(valorX, valorY, TAMANIO_CELDA, TAMANIO_CELDA);
 
    }
 
    function pintarSerpiente(){
      for (let indice=0 ; indice<serpiente.length; indice++){
        let parte = serpiente[indice];
 
        if (indice == 0){
          let valorX = parte.x * TAMANIO_CELDA;
          let valorY = parte.y * TAMANIO_CELDA;
 
          ctx.fillStyle = "#ff0000";
          ctx.fillRect(valorX, valorY, TAMANIO_CELDA, TAMANIO_CELDA);
 
          ctx.strokeStyle = "#ffffff";
          ctx.strokeRect(valorX, valorY, TAMANIO_CELDA, TAMANIO_CELDA);
 
        } else {
          ctx.fillStyle = "#0000a1";
          pintarParte(parte.x,parte.y);
        }
      }
    }
 
    function moverDerecha(){
      let cabezaActual = serpiente[0];
      let nuevaCabeza = {
        x: cabezaActual.x +1,
        y: cabezaActual.y
      };
 
      serpiente.unshift(nuevaCabeza);
 
      // Eliminamos la última parte para simular el movimiento
      serpiente.pop();
    }
 
    function moverIzquierda(){
      let cabezaActual = serpiente[0];
      let nuevaCabeza = {
        x: cabezaActual.x -1,
        y: cabezaActual.y
      };
      serpiente.unshift(nuevaCabeza);
      // Eliminamos la última parte para simular el movimiento
      serpiente.pop();
    }
 
    function moverAbajo(){
      let cabezaActual = serpiente[0];
      let nuevaCabeza = {
        x: cabezaActual.x,
        y: cabezaActual.y+1
      };
      serpiente.unshift(nuevaCabeza);
      // Eliminamos la última parte para simular el movimiento
      serpiente.pop();
    }
 
    function moverArriba(){
      let cabezaActual = serpiente[0];
      let nuevaCabeza = {
        x: cabezaActual.x,
        y: cabezaActual.y-1
      };
      serpiente.unshift(nuevaCabeza);
      // Eliminamos la última parte para simular el movimiento
      serpiente.pop();
    }
 
    function cambiarDireccion(nuevaDireccion){
      direccionActual = nuevaDireccion;
    }
 
    function iniciarJuego(){
      intervaloSerpiente = setInterval(moverSerpiente,600);
    }
 
    function pausarJuego(){
      clearInterval(intervaloSerpiente);
    }
 
    function moverSerpiente(){
      let ultimaParte = serpiente[serpiente.length-1];
      if (direccionActual == "derecha"){
        moverDerecha();
      }
      if (direccionActual == "izquierda"){
        moverIzquierda();
      }
      if (direccionActual == "abajo"){
        moverAbajo();
      }
      if (direccionActual == "arriba"){
        moverArriba();
      }  
 
      if (atraparComida() == true){
        puntaje = puntaje +1;
        document.getElementById("puntaje").innerText = puntaje;
        serpiente.push(ultimaParte);
        generarComida();
      }
      dibujarTodo();
    }
 
    function generarComida(){
      let totalColumnas = canvas.width/TAMANIO_CELDA;
      let totalFilas = canvas.height/TAMANIO_CELDA;
      comida.comidaX = Math.floor(Math.random() * totalColumnas);
      comida.comidaY = Math.floor(Math.random() * totalFilas);
    }
    
    function pintarComida(){
      let totalColumnas = canvas.width/TAMANIO_CELDA;
      let totalFilas = canvas.height/TAMANIO_CELDA;
 
      ctx.fillStyle = "#44ff00";
      pintarParte(comida.comidaX,comida.comidaY);
    }
 
    function atraparComida(){
      let cabezaActual = serpiente[0];
 
      if (cabezaActual.x == comida.comidaX && cabezaActual.y == comida.comidaY){
        return true;
      }else {
        return false;
      }
    }

//CLASE CON EL B / 7MAY
  //dibujarTablero=function(){
    //ctx.strokeStyle="white";
    //ctx.beginPath();//Empeiza a dibujar en el canva
    //ctx.moveTo(0,0); //Donde empieza a dubujar
    //ctx.lineTo(100,100);//Hasta donde dibujar
    //ctx.stroke(); //Pinta contorno
  //}

  //dibujarTablero2=function(){
    //for(let i=0;i<canvas.width;i+=TAMANIO_CELDA){
      //ctx.strokeStyle="white";
      //ctx.beginPath();//Empeiza a dibujar en el canva
      //ctx.moveTo(i,0); //Donde empieza a dubujar
      //ctx.lineTo(i,canvas.height);//Hasta donde dibujar
      //ctx.stroke();
    //}
    //for(let i=0;i<canvas.height;i+=TAMANIO_CELDA){
      //ctx.strokeStyle="white";
      //ctx.beginPath();//Empeiza a dibujar en el canva
      //ctx.moveTo(0,i); //Donde empieza a dubujar
      //ctx.lineTo(canvas.width,i);//Hasta donde dibujar
      //ctx.stroke();
  //}
//}