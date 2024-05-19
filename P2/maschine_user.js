// Función para establecer una cookie
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Función para obtener el valor de una cookie específica
function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

// Función para obtener los productos del archivo JSON
function fetchProducts() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'tienda.json', true); // Ajusta la ruta según la ubicación de tu archivo JSON
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            var data = JSON.parse(xhr.responseText);
            var productos = data.productos; // Obtén la lista de productos del archivo JSON

            // Nombre del producto inicial a mostrar
            var nombreProducto = "NI Maschine MK3";

            // Encuentra el producto correspondiente en el JSON
            var productoEncontrado = productos.find(producto => producto.nombre === nombreProducto);
            if (productoEncontrado) {
                // Actualiza el nombre del producto en el DOM
                var nombreElement = document.getElementById("product-name");
                nombreElement.textContent = productoEncontrado.nombre;

                // Actualiza el precio del producto en el DOM
                var precioElement = document.getElementById("product-price");
                precioElement.textContent = `Precio: ${productoEncontrado.precio} €`;

                // Actualiza la descripción en el DOM
                var descripcionElement = document.getElementById("product-description");
                descripcionElement.innerHTML = productoEncontrado.descripcion;

                // Actualiza la imagen del producto en el DOM
                var imagenElement = document.getElementById("description-image");
                imagenElement.src = productoEncontrado.imagen; // Asigna la URL de la imagen desde el JSON
                imagenElement.alt = productoEncontrado.nombre; // Asigna el nombre como atributo alt de la imagen
            } else {
                console.error('Producto no encontrado en el archivo JSON');
            }
        } else {
            console.error('Error al cargar el archivo JSON');
        }
    };
    xhr.onerror = function () {
        console.error('Error al cargar el archivo JSON');
    };
    xhr.send();
}

// Ejecutar la función fetchProducts() al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    fetchProducts(); // Cargar los productos al inicio
    initializeCart(); // Inicializar el carrito de compras
});

// Función para inicializar el carrito y la funcionalidad asociada
function initializeCart() {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartContent = document.getElementById("cart-content");
    const totalPriceElement = document.getElementById("total-price");
    const checkoutButton = document.getElementById("checkout-button");
    let totalPrice = 0;
    let cartItems = [];

    // Obtener los elementos del carrito desde la cookie al cargar la página
    const storedCartItems = getCookie("cartItems");
    if (storedCartItems) {
        cartItems = JSON.parse(storedCartItems);
        cartItems.forEach(item => {
            const cartItem = document.createElement("li");
            cartItem.textContent = item;

            // Crear botón para eliminar producto del carrito
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.classList.add("delete-item");
            deleteButton.addEventListener("click", function() {
                cartItemsContainer.removeChild(cartItem);
                const itemPrice = parseFloat(item.split(' - ')[1].replace(' €', ''));
                totalPrice -= itemPrice;
                totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} €`;

                // Remover producto del array del carrito
                const index = cartItems.indexOf(item);
                if (index !== -1) {
                    cartItems.splice(index, 1);
                }

                // Actualizar la cookie del carrito
                setCookie("cartItems", JSON.stringify(cartItems), 30); // Cookie válida por 30 días

                // Ocultar el contenido del carrito si está vacío
                if (cartItemsContainer.childElementCount === 0) {
                    cartContent.style.display = "none";
                    checkoutButton.style.display = "none"; // Ocultar botón de finalizar compra
                    totalPrice = 0; // Establecer el total a 0 cuando el carrito está vacío
                    totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} €`;
                }

                // Ocultar el botón de finalizar compra si no hay elementos en el carrito
                if (cartItems.length === 0) {
                    checkoutButton.style.display = "none";
                }
            });

            // Agregar botón de eliminar al elemento del carrito
            cartItem.appendChild(deleteButton);
            cartItemsContainer.appendChild(cartItem);
        });

        // Mostrar el contenido del carrito si hay elementos
        if (cartItems.length > 0) {
            cartContent.style.display = "block";
            checkoutButton.style.display = "block"; // Mostrar botón de finalizar compra
        } else {
            // Mostrar el contenido del carrito como vacío si no hay elementos
            cartContent.style.display = "none";
            checkoutButton.style.display = "none";
            totalPrice = 0; // Establecer el total a 0 cuando el carrito está vacío
            totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} €`;
        }
    } else {
        // Mostrar el contenido del carrito como vacío si no hay elementos
        cartContent.style.display = "none";
        checkoutButton.style.display = "none";
        totalPrice = 0; // Establecer el total a 0 cuando el carrito está vacío
        totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} €`;
    }

    // Agregar eventos a los botones "Agregar al carrito"
    addToCartButtons.forEach(button => {
        button.addEventListener("click", function(event) {
            const productContainer = event.target.closest(".product");
            const productName = document.getElementById("product-name").textContent;
            const productPriceText = document.getElementById("product-price").textContent;
            const productPrice = parseFloat(productPriceText.replace('Precio: ', '').replace(' €', ''));

            // Crear elemento de lista para el carrito
            const cartItem = document.createElement("li");
            cartItem.textContent = `${productName} - ${productPrice} €`;

            // Crear botón para eliminar producto del carrito
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.classList.add("delete-item");
            deleteButton.addEventListener("click", function() {
                cartItemsContainer.removeChild(cartItem);
                totalPrice -= productPrice;
                totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} €`;

                // Remover producto del array del carrito
                const index = cartItems.indexOf(`${productName} - ${productPrice} €`);
                if (index !== -1) {
                    cartItems.splice(index, 1);
                }

                // Actualizar la cookie del carrito
                setCookie("cartItems", JSON.stringify(cartItems), 30); // Cookie válida por 30 días

                // Ocultar el contenido del carrito si está vacío
                if (cartItemsContainer.childElementCount === 0) {
                    cartContent.style.display = "none";
                    checkoutButton.style.display = "none"; // Ocultar botón de finalizar compra
                    totalPrice = 0; // Establecer el total a 0 cuando el carrito está vacío
                    totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} €`;
                }

                // Ocultar el botón de finalizar compra si no hay elementos en el carrito
                if (cartItems.length === 0) {
                    checkoutButton.style.display = "none";
                }
            });

            // Agregar botón de eliminar al elemento del carrito
            cartItem.appendChild(deleteButton);
            cartItemsContainer.appendChild(cartItem);

            totalPrice += productPrice;
            totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} €`;

            if (cartContent.style.display === "none") {
                cartContent.style.display = "block";
                checkoutButton.style.display = "block"; // Mostrar botón de finalizar compra
            }

            cartItems.push(`${productName} - ${productPrice} €`);
            setCookie("cartItems", JSON.stringify(cartItems), 30); // Actualizar la cookie del carrito
        });
    });

    // Verificar si hay elementos en el carrito para mostrar u ocultar el botón de finalizar compra
    if (cartItems.length === 0) {
        checkoutButton.style.display = "none";
    }
}
