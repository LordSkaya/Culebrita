module.exports = {
        CrearCodigoJuego,
    }
    // generador de IDs
function CrearCodigoJuego(length) {
    var codigosala = '';
    var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var caractereslength = caracteres.length;
    for (var i = 0; i < length; i++) {
        codigosala += caracteres.charAt(Math.floor(Math.random() * caractereslength));
    }
    return codigosala;
}