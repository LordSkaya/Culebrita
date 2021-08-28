const { tamaño_grid } = require('./constantes');    //Usando los valores predefinidos
module.exports = {          //Exportables para la comunicación
    InicioJuego,
    EjecucionJuego,
    getUpdateVelocidad,

}

function InicioJuego() {
    const state = CrearEstadoJuego()
    randomFood(state);
    return state;
}

// Generación de los atributos de juego
function CrearEstadoJuego() {
    return {
        players: [{
            pos: {
                x: 3,
                y: 10,
            },
            vel: {
                x: 1,
                y: 0,
            },
            snake: [
                { x: 1, y: 10 },
                { x: 2, y: 10 },
                { x: 3, y: 10 },
            ],
        }, {
            pos: {
                x: 18,
                y: 10,
            },
            vel: {
                x: 0,
                y: 0,
            },
            snake: [
                { x: 20, y: 10 },
                { x: 19, y: 10 },
                { x: 18, y: 10 },
            ],
        }],
        food: {},
        gridsize: tamaño_grid,
    };
}

function EjecucionJuego(state) {
    if (!state) {
        return;
    }

    //Se realiza la definición de los 2 jugadores
    const jugadorOne = state.players[0];
    const jugadorTwo = state.players[1];

    //Movimiento realizado en pantalla
    jugadorOne.pos.x += jugadorOne.vel.x;
    jugadorOne.pos.y += jugadorOne.vel.y;
    jugadorTwo.pos.x += jugadorTwo.vel.x;
    jugadorTwo.pos.y += jugadorTwo.vel.y;

    //Si el jugador 1 se sale de la pantalla, pierde y gana el jugador 2
    if (jugadorOne.pos.x < 0 || jugadorOne.pos.x > tamaño_grid || jugadorOne.pos.y < 0 || jugadorOne.pos.y > tamaño_grid) {
        return 2;
    }

    //Si el jugador 2 se sale de la pantalla, pierde y gana el jugador 1
    if (jugadorTwo.pos.x < 0 || jugadorTwo.pos.x > tamaño_grid || jugadorTwo.pos.y < 0 || jugadorTwo.pos.y > tamaño_grid) {
        return 1;
    }

    //Acción al comer la fruta por parte del jugador 1
    if (state.food.x == jugadorOne.pos.x && state.food.y == jugadorOne.pos.y) {
        jugadorOne.snake.push({...jugadorOne.pos });
        jugadorOne.pos.x += jugadorOne.vel.x;
        jugadorOne.pos.y += jugadorOne.vel.y;
        randomFood(state);
    }
    //Acción al comer la fruta por parte del jugador 2
    if (state.food.x == jugadorTwo.pos.x && state.food.y == jugadorTwo.pos.y) {
        jugadorTwo.snake.push({...jugadorTwo.pos });
        jugadorTwo.pos.x += jugadorTwo.vel.x;
        jugadorTwo.pos.y += jugadorTwo.vel.y;
        randomFood(state);
    }
    // Verifica el movimiento de la cabeza de la serpiente 1 antes de iniciar el movimiento del cuerpo
    if (jugadorOne.vel.x || jugadorOne.vel.y) {
        for (let cell of jugadorOne.snake) { // La cabeza colisiona?
            if (cell.x === jugadorOne.pos.x && cell.y === jugadorOne.pos.y) {
                return 2
            }
        }
        jugadorOne.snake.push({...jugadorOne.pos });
        jugadorOne.snake.shift();

    }
    // Verifica el movimiento de la cabeza de la serpiente 2 antes de iniciar el movimiento del cuerpo
    if (jugadorTwo.vel.x || jugadorTwo.vel.y) {
        for (let cell of jugadorTwo.snake) { // La cabeza colisiona?
            if (cell.x === jugadorTwo.pos.x && cell.y === jugadorTwo.pos.y) {
                return 1
            }
        }
        jugadorTwo.snake.push({...jugadorTwo.pos });
        jugadorTwo.snake.shift();
    }
    return false;
}

// Posicionamiento aleatorio de la comida
function randomFood(state) {
    food = {
            x: Math.floor(Math.random() * tamaño_grid),
            y: Math.floor(Math.random() * tamaño_grid),
        }
    // Si se genera la comida encima del jugador 1, adicionar y reubicar 
    for (let cell of state.players[0].snake) {
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state);
        }
    }
    // Si se genera la comida encima del jugador 2, adicionar y reubicar 
    for (let cell of state.players[1].snake) {
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state);
        }
    }
    state.food = food;
}

//Velocidad de movimiento y teclas de movimiento
function getUpdateVelocidad(keyCode) {
    switch (keyCode) {
        case 37: // tecla izquierda
            {
                return { x: -1, y: 0 };
            }
        case 38: // tecla abajo
            {
                return { x: 0, y: -1 };
            }
        case 39: // tecla derecha
            {
                return { x: 1, y: 0 };
            }
        case 40: // tecla arriba
            {
                return { x: 0, y: 1 };
            }


    }
}