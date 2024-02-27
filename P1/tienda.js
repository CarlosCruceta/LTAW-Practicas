
//-- Servidor que devuelve una página en HTML con mi tienda cuando se le pide
//-- el recurso raiz (/), y devuelve una página de ERROR también
//-- en HTML cuando se pide cualquier otro recurso

const http = require('http');
const fs = require('fs');

const PUERTO = 8084;


const server = http.createServer((req, res)=>{
    console.log("Petición recibida!");

    //-- Valores de la respuesta por defecto
    let code = 200;
    let code_msg = "OK";


    //-- Analizar el recurso
    //-- Construir el objeto url con la url de la solicitud
    const url = new URL(req.url, 'http://' + req.headers['host']);
    console.log(url.pathname);

    //-- Cualquier recurso que no sea la página principal
    //-- genera un error
    if (url.pathname != '/') {
        code = 404;
        code_msg = "Not Found";
        return sendErrorResponse(res, code, code_msg, 'error.html');
        
    }
       // Leer el contenido de index.html de manera asíncrona
    fs.readFile('index.html', (err, data) => {
        if (err) {
            console.error("Error al leer index.html:", err);
            code = 500;
            code_msg = "Internal Server Error";
            return sendErrorResponse(res, code, code_msg, 'error.html');
        }

        // Enviar el contenido de index.html como respuesta
        sendResponse(res, code, code_msg, data);
    });
});

function sendErrorResponse(res, code, code_msg, errorPage) {
    // Leer el contenido de error.html de manera asíncrona
    fs.readFile(errorPage, 'utf8', (err, data) => {
        if (err) {
            console.error("Error al leer " + errorPage + ":", err);
            code = 500;
            code_msg = "Internal Server Error";
            return sendResponse(res, code, code_msg, "Error interno del servidor");
        }

        // Enviar el contenido de error.html como respuesta
        sendResponse(res, code, code_msg, data);
    });
}

function sendResponse(res, code, code_msg, page) {
    res.statusCode = code;
    res.statusMessage = code_msg;
    res.setHeader('Content-Type', 'text/html');
    res.write(page);
    res.end();
}


server.listen(PUERTO);

console.log("Escuchando en puerto: " + PUERTO);
