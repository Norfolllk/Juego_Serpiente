 // 1. Capturamos el canvas y su contexto de dibujo
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");
const TAMANIO_CELDA = 25;
let intervaloSerpiente;
let velocidad = 300;
let direccionActual = "derecha";
let proximaDireccion = "derecha";
let puntaje = 0;
let juegoFinalizado = false;
let ComidaX;
let ComidaY;
const lineasY = canvas.height / TAMANIO_CELDA;
const lineasX = canvas.width / TAMANIO_CELDA;
let serpiente = [
  { x: (canvas.width / 2) / TAMANIO_CELDA,       y: (canvas.height / 2) / TAMANIO_CELDA },
  { x: (canvas.width / 2) / TAMANIO_CELDA - 1,   y: (canvas.height / 2) / TAMANIO_CELDA },
  { x: (canvas.width / 2) / TAMANIO_CELDA - 2,   y: (canvas.height / 2) / TAMANIO_CELDA },
  { x: (canvas.width / 2) / TAMANIO_CELDA,       y: (canvas.height / 2) / TAMANIO_CELDA + 1 }
];

function dibujarTablero() {
    for (let i = 0; i < canvas.width; i += TAMANIO_CELDA) {
        ctx.strokeStyle = "grey";
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += TAMANIO_CELDA) {
        ctx.strokeStyle = "grey";
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}

function pintarParte(lineaX, lineaY, color) {
    let valorx = lineaX * TAMANIO_CELDA;
    let valory = lineaY * TAMANIO_CELDA;
    ctx.fillStyle = color;
    ctx.fillRect(valorx, valory, TAMANIO_CELDA, TAMANIO_CELDA);
    ctx.strokeStyle = color;
    ctx.strokeRect(valorx, valory, TAMANIO_CELDA, TAMANIO_CELDA);
}

function pintarSerpiente() {
    let movimiento;
    for (let i = 0; i < serpiente.length; i++) {
        movimiento = serpiente[i];
        if (i == 0) {
            pintarParte(movimiento.x, movimiento.y, "brown");
        } else {
            pintarParte(movimiento.x, movimiento.y, "red");
        }
    }
}

function moverDerecha() {
    let cabezaActual = serpiente[0];
    let nuevaCabeza = {
        x: cabezaActual.x + 1,
        y: cabezaActual.y
    };
    serpiente.unshift(nuevaCabeza);
    serpiente.pop();
}

function moverIzquierdo() {
    let cabezaActual = serpiente[0];
    let nuevaCabeza = {
        x: cabezaActual.x - 1,
        y: cabezaActual.y
    };
    serpiente.unshift(nuevaCabeza);
    serpiente.pop();
}

function moverArriba() {
    let cabezaActual = serpiente[0];
    let nuevaCabeza = {
        x: cabezaActual.x,
        y: cabezaActual.y - 1
    };
    serpiente.unshift(nuevaCabeza);
    serpiente.pop();
}

function moverAbajo() {
    let cabezaActual = serpiente[0];
    let nuevaCabeza = {
        x: cabezaActual.x,
        y: cabezaActual.y + 1
    };
    serpiente.unshift(nuevaCabeza);
    serpiente.pop();
}

function cambiarDireccion(direccion) {
    if (direccion == "derecha") {
        if (direccionActual != "izquierda") {
            proximaDireccion = "derecha";
        }
    } else if (direccion == "izquierda") {
        if (direccionActual != "derecha") {
            proximaDireccion = "izquierda";
        }
    } else if (direccion == "arriba") {
        if (direccionActual != "abajo") {
            proximaDireccion = "arriba";
        }
    } else if (direccion == "abajo") {
        if (direccionActual != "arriba") {
            proximaDireccion = "abajo";
        }
    }
}

function iniciarJuego() {
    if (juegoFinalizado == true) {
        return;
    }
    document.getElementById("estado").innerHTML = "Jugando";
    document.getElementById("mensaje").innerHTML = "¡Que la serpiente no se choque!";
    intervaloSerpiente = setInterval(moverSerpiente, velocidad);  //Velicidad
}

function pausarJuego() {
    clearInterval(intervaloSerpiente);
    document.getElementById("estado").innerHTML = "Pausado";
}

function moverSerpiente() {
    if (proximaDireccion) {
        direccionActual = proximaDireccion;
        proximaDireccion = null;
    }

    if (direccionActual == "derecha") {
        moverDerecha();
    } else if (direccionActual == "izquierda") {
        moverIzquierdo();
    } else if (direccionActual == "arriba") {
        moverArriba();
    } else if (direccionActual == "abajo") {
        moverAbajo();
    }

    let colisionComida = atraparComida();
    if (colisionComida == true) {
        puntaje = puntaje + 1;
        let puntos = document.getElementById("puntaje");
        puntos.innerHTML = puntaje;
        let colaActual = serpiente[serpiente.length - 1];
        let colaNueva;

        if (direccionActual == "derecha") {
            colaNueva = {
                x: colaActual.x - 1,
                y: colaActual.y
            };
        }

        if (direccionActual == "izquierda") {
            colaNueva = {
                x: colaActual.x + 1,
                y: colaActual.y
            };
        }

        if (direccionActual == "arriba") {
            colaNueva = {
                x: colaActual.x,
                y: colaActual.y + 1
            };
        }

        if (direccionActual == "abajo") {
            colaNueva = {
                x: colaActual.x,
                y: colaActual.y - 1
            };
        }
        serpiente.push(colaNueva);
        generarComida();
    }

    verificarCondicionBordes();
    verificarColisionPropioCuerpo();
    dibujarTodo();
}

function verificarCondicionBordes() {
    let cabeza = serpiente[0];
    if (cabeza.x < 0 || cabeza.x >= canvas.width / TAMANIO_CELDA) {
        pausarJuego();
        document.getElementById("estado").innerHTML = "GAME OVER";
        document.getElementById("mensaje").innerHTML = "💀 ¡Chocaste con la pared! Presiona Reiniciar.";
        juegoFinalizado = true;
        desabilitarBotones();
    } else if (cabeza.y < 0 || cabeza.y >= canvas.height / TAMANIO_CELDA) {
        pausarJuego();
        document.getElementById("estado").innerHTML = "GAME OVER";
        document.getElementById("mensaje").innerHTML = "💀 ¡Chocaste con la pared! Presiona Reiniciar.";
        juegoFinalizado = true;
        desabilitarBotones();
    }
}

function verificarColisionPropioCuerpo() {
    let cabeza = serpiente[0];
    // Recorre desde el índice 1 (el cuerpo, no la cabeza)
    for (let i = 1; i < serpiente.length; i++) {
        if (cabeza.x === serpiente[i].x && cabeza.y === serpiente[i].y) {
            terminarJuego("💀 ¡Te mordiste a ti mismo! Presiona Reiniciar.");
            return;
        }
    }
}

function generarComida() {
    let lineasY = canvas.height / TAMANIO_CELDA;
    let lineasX = canvas.width / TAMANIO_CELDA;
    let espaciosLibres = [];
    for (let y = 0; y < lineasY; y++) {
        for (let x = 0; x < lineasX; x++) {
            let ocupado = false;
            for (let segmento of serpiente) {
                if (segmento.x == x) {
                    if (segmento.y == y) {
                        ocupado = true;
                    }
                }
            }
            if (!ocupado) {
                espaciosLibres.push({
                    x: x,
                    y: y
                });
            }
        }
    }
    let aleatorio = Math.floor(
        Math.random() * espaciosLibres.length
    );
    ComidaX = espaciosLibres[aleatorio].x;
    ComidaY = espaciosLibres[aleatorio].y;
}

function pintarComida() {
    pintarParte(ComidaX, ComidaY, "yellow");
}

function atraparComida() {
    let cabeza = serpiente[0];
    if (cabeza.x == ComidaX && cabeza.y == ComidaY) {
        return true;
    } else {
        return false;
    }
}

function reiniciarJuego() {
    puntaje = 0;
    clearInterval(intervaloSerpiente);
    direccionActual = "derecha";
    serpiente.length = 0;

    serpiente = [
        { x: (canvas.width / 2) / TAMANIO_CELDA,       y: (canvas.height / 2) / TAMANIO_CELDA },
        { x: (canvas.width / 2) / TAMANIO_CELDA - 1,   y: (canvas.height / 2) / TAMANIO_CELDA },
        { x: (canvas.width / 2) / TAMANIO_CELDA - 2,   y: (canvas.height / 2) / TAMANIO_CELDA },
        { x: (canvas.width / 2) / TAMANIO_CELDA,       y: (canvas.height / 2) / TAMANIO_CELDA + 1 }
    ];

    document.getElementById("puntaje").innerHTML = 0;
    document.getElementById("estado").innerHTML = "Listo";
    document.getElementById("mensaje").innerHTML = "Presiona iniciar para comenzar.";

    juegoFinalizado = false;
    habilitarBotones();
    generarComida();
    dibujarTodo();
}

function limpiarCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function desabilitarBotones() {
    document.getElementById("arriba").disabled = true;
    document.getElementById("abajo").disabled = true;
    document.getElementById("derecha").disabled = true;
    document.getElementById("izquierda").disabled = true;
    document.getElementById("iniciar").disabled = true;
    document.getElementById("pausar").disabled = true;
}

function habilitarBotones() {
    document.getElementById("arriba").disabled = false;
    document.getElementById("abajo").disabled = false;
    document.getElementById("derecha").disabled = false;
    document.getElementById("izquierda").disabled = false;
    document.getElementById("iniciar").disabled = false;
    document.getElementById("pausar").disabled = false;
}

function dibujarTodo() {
    limpiarCanvas();
    dibujarTablero();
    pintarSerpiente();
    pintarComida();
}

generarComida();
dibujarTodo();

// ============================================================
// CONTROL POR TECLADO (mejora adicional)
// ============================================================
document.addEventListener("keydown", function (evento) {
    // 1. Evitamos que las flechas y el espacio hagan scroll en la página
    if(["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(evento.code) > -1) {
        evento.preventDefault();
    }

    // 2. Mapeamos las teclas a las direcciones
    if (evento.key === "ArrowRight") {
        cambiarDireccion("derecha");
    } else if (evento.key === "ArrowLeft") {
        cambiarDireccion("izquierda");
    } else if (evento.key === "ArrowUp") {
        cambiarDireccion("arriba");
    } else if (evento.key === "ArrowDown") {
        cambiarDireccion("abajo");
    } 
    // 3. Barra espaciadora para pausar el juego
    else if (evento.code === "Space") {
        if (document.getElementById("estado").innerHTML === "Jugando") {
            pausarJuego();
        }
    }
});

