// Paquetes necesarios para la apertura del server
const io = require('socket.io')(); //Valores de puerto
const { InicioJuego, EjecucionJuego, getUpdateVelocidad } = require('./game'); // Valores de juego
const { Frame_rate } = require('./constantes'); // Valores de tablero y fotogramas
const { CrearCodigoJuego } = require('./utilidades'); // Generador de códigos de sala
const state = {};
const salaCliente = {};

// Conexión del cliente al servidor
io.on('connection', client => {

    //Acciones de la primera pantalla
    client.on('keydown', AccionarTecla);
    client.on('NuevaSala', CrearNuevoJuego);
    client.on('Unirsejuego', UnirseSalaExistente);
    
    // Si hay una sala de juego abierta, realiza la conexión
    function UnirseSalaExistente(nombreSala) {
        console.log('Conexión establecida')
        const sala = io.sockets.adapter.rooms[nombreSala];

        let SocketsJugadores;
        if (sala) {
            SocketsJugadores = sala.sockets;
        }

        let Numeroclientes = 0;
        if (SocketsJugadores) {
            Numeroclientes = Object.keys(SocketsJugadores).length;
        }
        // Si no hay nadie en la partida
        if (Numeroclientes === 0) {
            client.emit('JuegoDesconocido');
            return;
        // Si hay más de 2 jugadores
        } else if (Numeroclientes > 1) {
            client.emit('MuchosJugadores');
            return;
        }
        console.log('Juego iniciado')
        salaCliente[client.id] = nombreSala;

        client.join(nombreSala);
        client.number = 2;
        client.emit('InicioJuego', 2);

        IntervaloJuego(nombreSala);
    }

    // Creación de un juego nuevo
    function CrearNuevoJuego() {
        let nombreSala = CrearCodigoJuego(5);
        salaCliente[client.id] = nombreSala;
        client.emit('CodigoJuego', nombreSala);

        state[nombreSala] = InicioJuego();
        console.log('Creación de la sala')
        client.join(nombreSala);
        client.number = 1;
        client.emit('InicioJuego', 1)
    }
    
    // Pulsadores
    function AccionarTecla(keyCode) {
        const nombreSala = salaCliente[client.id];
        console.log('Procesa tecla')
        if (!nombreSala) {
            return;
        }
        try {
            keyCode = parseInt(keyCode);
        } catch (e) {
            console.error(e);
            return;

        }
        // Obtiene el movimiento del cliente que activó
        const vel = getUpdateVelocidad(keyCode);
        if (vel) {
            state[nombreSala].players[client.number - 1].vel = vel
        }
    }
});

// Inicio del juego
function IntervaloJuego(nombreSala) {
    // Ajuste de ticks para el framerate
    const interlvalID = setInterval(() => {
        const Ganador = EjecucionJuego(state[nombreSala]);
        // Actividad en la sala 
        if (!Ganador) {
            InformaEstadoJuego(nombreSala, state[nombreSala]);
        } else {
            InformaFinJuego(nombreSala, Ganador);
            state[nombreSala] = null;
            clearInterval(interlvalID);
        }
    }, 1000 / Frame_rate);
}

// Verifica el estado del juego
function InformaEstadoJuego(sala, EstadoJuego) {
    io.sockets.in(sala).emit('EstadoJuego', JSON.stringify(EstadoJuego));
}

//Si el juego ya acabó, declare el ganador
function InformaFinJuego(sala, Ganador) {
    io.sockets.in(sala).emit('FinPartida', JSON.stringify({ Ganador }));
}
io.listen(3000);