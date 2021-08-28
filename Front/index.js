// Colores de juego
const BG_color = '#231f20';
const snake_color = '#E67E22';
const food_color = '#239B56';


const socket = io('http://localhost:3000'); //URL para conexión front->server
socket.on('InicioJuego', ManejaIniciador);
socket.on('EstadoJuego', ManejaEstadoJuego);
socket.on('FinPartida', ManejaGameOver);
socket.on('CodigoJuego', ManejaCodigoJuego);
socket.on('JuegoDesconocido', ManejaJuegoDesconocido);
socket.on('MuchosJugadores', ManejaMuchosJugadores);

const pantallaJuego = document.getElementById('pantallaJuego');
const pantallaInicial = document.getElementById('initialScreen');
const botonNuevaSala = document.getElementById('newGameButton');
const UnirseBoton = document.getElementById('joinGameButton');
const CodigoJuego = document.getElementById('gameCodeInput');
const CodigoJuegoDisplay = document.getElementById('gameCodeDisplay');


botonNuevaSala.addEventListener('click', NuevaSala);
UnirseBoton.addEventListener('click', Unirsejuego);


function NuevaSala() {
    socket.emit('NuevaSala');
    InicioJuego();
}

function Unirsejuego() {
    const codigo = CodigoJuego.value;
    socket.emit('Unirsejuego', codigo);

    InicioJuego();
}
let canvas, ctx;
let NumeroJugador;
let PartidaActiva = false;

// Valores de inicio de partida
function InicioJuego() {
    pantallaInicial.style.display = 'none';
    pantallaJuego.style.display = 'block';

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = canvas.height = 600;

    ctx.fillStyle = BG_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.addEventListener('keydown', keydown);
    PartidaActiva = true;

}

function keydown(e) {
    console.log(e.keyCode);
    socket.emit('keydown', e.keyCode);
}

// Coloreo de elementos
function paintGame(state) {

    ctx.fillStyle = BG_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const food = state.food;
    const gridsize = state.gridsize;
    // Ajuste de relación pixel-cuadrícula
    const size = canvas.width / gridsize;

    ctx.fillStyle = food_color;
    ctx.fillRect(food.x * size, food.y * size, size, size);

    paintPlayer(state.players[0], size, snake_color);
    paintPlayer(state.players[1], size, 'red');
}

function paintPlayer(playerState, size, color) {
    const snake = playerState.snake;

    ctx.fillStyle = color;

    for (let cell of snake) {
        ctx.fillRect(cell.x * size, cell.y * size, size, size);
    }
}

function ManejaIniciador(number) {
    NumeroJugador = number;
}

function ManejaEstadoJuego(EstadoJuego) {
    if (!PartidaActiva) {
        return;
    }
    EstadoJuego = JSON.parse(EstadoJuego);
    requestAnimationFrame(() => paintGame(EstadoJuego)) // Si el servidor inicia el proceso de pregunta de estado, recolorear los cambios
}

function ManejaGameOver(data) {
    if (!PartidaActiva) {
        return;
    }
    data = JSON.parse(data);

    if (data.Ganador === NumeroJugador) {
        alert('¡¡Victoria!!')
    } else {
        alert('Derrota');
    }
    PartidaActiva = false;
}

function ManejaCodigoJuego(CodigoJuego) {
    CodigoJuegoDisplay.innerText = CodigoJuego;
}

function ManejaJuegoDesconocido() {
    reset();
    alert('La sala no existe')
}

function ManejaMuchosJugadores() {
    reset();
    alert('Juego actualmente en curso')
}

function reset() {
    NumeroJugador = null;
    gameCodeInput.value = "";
    gameCodeDisplay.innerText = "";
    initialScreen.style.display = 'block';
    pantallaJuego.style.display = 'none';
}