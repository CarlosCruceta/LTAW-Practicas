// Define una función para cargar los productos desde el archivo JSON
function fetchProducts() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'tienda.json', true);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            var data = JSON.parse(xhr.responseText);
            // Obtén la lista de productos del archivo JSON
            var productos = data.productos;

            // Itera sobre cada producto y actualiza los valores en la página HTML
            productos.forEach((producto, index) => {
                var productElement = document.getElementsByClassName("product")[index];
                productElement.querySelector("h2").innerText = producto.nombre;
                productElement.querySelector("p").innerText = producto.precio + " €";
            });
        } else {
            console.error('Error al cargar el archivo tienda.json');
        }
    };
    xhr.onerror = function () {
        console.error('Error al cargar el archivo tienda.json');
    };
    xhr.send();
}

// Define una función para obtener el valor de una cookie
function getCookie(name) {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");

    for(let i = 0; i <cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) == " ") {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) == 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return "";
}


// Ejecutar las funciones al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    const usuario = getCookie("usuario");
    if (usuario) {
        const welcomeMessage = document.createElement("p");
        welcomeMessage.textContent = `Bienvenido de nuevo, ${usuario}`;
        welcomeMessage.classList.add("welcome-message");
        document.getElementById("header").appendChild(welcomeMessage);
    }
    fetchProducts(); // Cargar los productos
   
});
