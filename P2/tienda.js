const fs = require('fs');
const http = require('http');

const port = 9090;

const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://' + req.headers['host']);
    let file = '';
    let code = 200;
    let fileType = 'text/html';

    if (req.method === 'POST' && url.pathname === '/procesar') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString(); // convertir Buffer a string
        });

        req.on('end', () => {
            // Parsear los datos del cuerpo de la solicitud
            const parsedData = new URLSearchParams(body);
            const username = parsedData.get('username');
            
            // Aquí puedes hacer lo que quieras con los datos (por ejemplo, guardarlos en una base de datos, etc.)
            console.log(username);
    

            // Redirigir o enviar una respuesta apropiada
            res.writeHead(302, { 'Location': '/' }); // Redirigir al inicio después de procesar los datos
            return res.end();
        });

        return; // Importante: para evitar que el código siga ejecutándose después del manejo de la solicitud POST
    }

    if (url.pathname === '/') {
        file = 'index.html';
    } else if (url.pathname === '/ls') {
        // Manejo del recurso /ls para obtener el listado de archivos
        fs.readdir('.', (err, files) => {
            if (err) {
                console.error(`Error al leer el directorio: ${err.message}`);
                res.statusCode = 400;
                res.statusMessage = "404 NOT FOUND";
                res.setHeader('Content-Type', fileType);
                return res.end('ERROR 404 NOT FOUND');
            }
            // Creamos el html con el listado de archivos
            const fileListHTML = `<html><body><h1>Lista de Archivos:</h1><ul>${files.map(file => `<li>${file}</li>`).join('')}</ul></body></html>`;
            res.statusCode = code;
            res.setHeader('Content-Type', fileType);
            res.write(fileListHTML);
            return res.end();
        });
        return;
    } else {
        file = url.pathname.substr(1);
    }

    let fileFormat = file.split('.')[1];

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
            code = 404;
            res.statusMessage = "NOT FOUND";
            file = 'error.html';
    }

    fs.readFile(file, (err, data) => {
        if (err) {
            res.statusCode = 404;
            res.statusMessage = "NOT FOUND";
            res.setHeader('Content-Type', fileType);
            return res.end('ERROR 404 NOT FOUND');
        }

        res.statusCode = code;
        res.setHeader('Content-Type', fileType);
        res.write(data);
        return res.end();
    });
});

server.listen(port);
console.log("Escuchando en puerto: " + port);
