
//-- Servidor que devuelve una página en HTML con mi tienda cuando se le pide
//-- el recurso raiz (/), y devuelve una página de ERROR también
//-- en HTML cuando se pide cualquier otro recurso

// Importacion de módulos
const fs = require('fs');
const http = require('http');

// Puerto donde escucha el servidor
const port = 9090;

// Creacion del servidor
const server = http.createServer((req, res) => {
    // Analizar la URL solicitada
    const url = new URL(req.url, 'http://' + req.headers['host']);
    let file = '';
    let code = 200;

    // Determinar el archivo solicitado
    if (url.pathname == '/') {
        file = 'index.html';
    } else {
        file = url.pathname.substr(1);
    }
});


server.listen(port);
console.log("Escuchando en puerto: " + port);