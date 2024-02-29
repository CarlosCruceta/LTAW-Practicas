
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

// Obtener el formato del archivo a partir de su extensión
    let fileFormat = file.split('.')[1];

    // Establecer el tipo MIME predeterminado
    let fileType = 'text/html';

    // Configurar el mensaje de estado de respuesta
    res.statusMessage = "OK";

    // Determinar el tipo MIME específico para ciertos formatos de archivo
    switch (fileFormat) {
        case 'css':
        case 'html':
        case 'js':
            fileType = 'text/' + fileFormat;
            break;
        case 'png':
        case 'jpg':
        case 'ico':
            fileType = 'image/' + fileFormat;
            break;
        case 'json':
            fileType = 'application/' + fileFormat;
            break;
        default:
            // Si no coincide con ningún formato conocido, configurar el código de respuesta 404
            code = 404;
            res.statusMessage = "NOT FOUND";
            file = 'error.html';
    }

    // Leer el archivo y responder al cliente
    fs.readFile(file, (err, data) => {
        if (err) {
            // Si hay un error al leer el archivo, configurar el código de respuesta 404
            res.statusCode = 404;
            res.statusMessage = "NOT FOUND";
            res.setHeader('Content-Type', fileType);
            return res.end('Error en la carga de la página');
        }

        // Configurar el código de respuesta y el tipo MIME, y enviar el contenido del archivo
        res.statusCode = code;
        res.setHeader('Content-Type', fileType);
        res.write(data);
        return res.end();
    });


});


server.listen(port);
console.log("Escuchando en puerto: " + port);