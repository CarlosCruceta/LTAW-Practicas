const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const port = 9090;

// Leer el archivo JSON que contiene la información de los usuarios
const tiendaData = JSON.parse(fs.readFileSync('tienda.json'));

const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://' + req.headers['host']);
    let file = '';
    let code = 200;
    let fileType = 'text/html';

    const cookieUsuario = req.headers.cookie ? req.headers.cookie.split(';').find(cookie => cookie.trim().startsWith('usuario=')) : null;
    const usuarioEncontrado = cookieUsuario ? cookieUsuario.split('=')[1] : null;

    if (req.method === 'POST' && url.pathname === '/realizar-pedido') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString(); // convertir Buffer a string
        });

        req.on('end', () => {
            const formData = querystring.parse(body);
            guardarPedido(formData);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            return res.end('Pedido recibido y procesado correctamente.');
        });

        return; // Importante: para evitar que el código siga ejecutándose después del manejo de la solicitud POST
    }
    if (url.pathname === '/') {
        if (usuarioEncontrado) {
            // Si la cookie de usuario está presente, mostrar la página index_user.html
            file = 'index_user.html';
        } else {
            file = 'index.html';
        }
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

function guardarPedido(formData) {
    const nuevoPedido = {};
    for (const [key, value] of Object.entries(formData)) {
        nuevoPedido[key] = value;
    }
    tiendaData.pedidos.push(nuevoPedido);
    fs.writeFileSync('tienda.json', JSON.stringify(tiendaData, null, 2), 'utf8');
    console.log('Pedido guardado exitosamente en tienda.json');
}
