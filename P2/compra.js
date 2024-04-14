document.addEventListener("DOMContentLoaded", function() {
    // Obtener los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const totalPrice = urlParams.get('total');
    const items = JSON.parse(decodeURIComponent(urlParams.get('items')));

    // Mostrar los elementos del carrito y el precio total
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");

    items.forEach(item => {
        const cartItem = document.createElement("p");
        cartItem.textContent = item;
        cartItemsContainer.appendChild(cartItem);
    });

    totalPriceElement.textContent = `Total: ${totalPrice}€`;
});

// Suponiendo que ya tienes una forma de cargar el archivo JSON en tu aplicación
const data = require('./tienda.json');

// Define una función para guardar los datos en el archivo JSON
function guardarDatos() {
    // Convierte el objeto de datos a formato JSON
    const jsonData = JSON.stringify(data, null, 2);

    // Guarda los datos en el archivo JSON (aquí debes usar tu lógica para guardar los datos en tu sistema de archivos o base de datos)
    console.log("Datos guardados:", jsonData);
}

// Define una función para procesar el pedido
function procesarPedido(direccionEnvio, numeroTarjeta, productosComprados) {
    // Crear un nuevo objeto de pedido
    const nuevoPedido = {
        nombre_usuario: "Usuario actual", // Aquí debes reemplazar "Usuario actual" con el nombre de usuario del usuario actual
        direccion_envio: direccionEnvio,
        numero_tarjeta: numeroTarjeta,
        productos_comprados: productosComprados
    };

    // Agregar el nuevo pedido al array de pedidos en el archivo JSON
    data.pedidos.push(nuevoPedido);

    // Guardar los datos actualizados en el archivo JSON
    guardarDatos();

    // Mostrar mensaje de confirmación
    console.log("Pedido procesado con éxito:", nuevoPedido);
}

// Supongamos que tienes una forma de obtener los datos del formulario de compra
// Aquí debes agregar la lógica para obtener los datos de la dirección de envío y el número de tarjeta del formulario

// Obtener la dirección de envío y el número de tarjeta del formulario (aquí debes agregar la lógica para obtener estos datos del formulario)
const direccionEnvio = "Dirección de envío del usuario";
const numeroTarjeta = "Número de tarjeta del usuario";

// Obtener los productos comprados del formulario (aquí debes agregar la lógica para obtener estos datos del formulario)
const productosComprados = ["Producto 1", "Producto 2", "Producto 3"];

// Procesar el pedido con los datos del formulario
procesarPedido(direccionEnvio, numeroTarjeta, productosComprados);
