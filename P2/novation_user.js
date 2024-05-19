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
            var nombreProducto = "Novation Circuit Tracks";

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
        // Calcular el precio total al cargar la página
        totalPrice = calculateTotalPrice(cartItems);
        totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} €`;

        // Mostrar los elementos del carrito
        showCartItems(cartItems, cartItemsContainer);

        // Mostrar el contenido del carrito si hay elementos
        if (cartItems.length > 0) {
            cartContent.style.display = "block";
            checkoutButton.style.display = "block";
        } else {
            // Ocultar el contenido del carrito si no hay elementos
            cartContent.style.display = "none";
            checkoutButton.style.display = "none";
        }
    } else {
        // Ocultar el contenido del carrito si no hay elementos
        cartContent.style.display = "none";
        checkoutButton.style.display = "none";
    }

    // Agregar eventos a los botones "Agregar al carrito"
    addToCartButtons.forEach(button => {
        button.addEventListener("click", function(event) {
            // Obtener detalles del producto
            const productName = document.getElementById("product-name").textContent;
            const productPriceText = document.getElementById("product-price").textContent;
            const productPrice = parseFloat(productPriceText.replace('Precio: ', '').replace(' €', ''));

            // Añadir producto al carrito
            const cartItem = `${productName} - ${productPrice.toFixed(2)} €`;
            cartItems.push(cartItem); // Agregar al array de carrito

            // Actualizar la cookie del carrito
            setCookie("cartItems", JSON.stringify(cartItems), 30); // Cookie válida por 30 días

            // Actualizar y mostrar el total
            totalPrice += productPrice;
            totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} €`;

            // Mostrar el contenido del carrito si está oculto
            if (cartContent.style.display === "none") {
                cartContent.style.display = "block";
                checkoutButton.style.display = "block"; // Mostrar botón de finalizar compra
            }

            // Mostrar el elemento añadido en el carrito
            const cartItemElement = document.createElement("li");
            cartItemElement.textContent = cartItem;

            // Crear botón para eliminar producto del carrito
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.classList.add("delete-item");
            deleteButton.addEventListener("click", function() {
                // Remover del DOM
                cartItemsContainer.removeChild(cartItemElement);

                // Calcular el precio a restar
                const itemPrice = parseFloat(cartItem.split(' - ')[1].replace(' €', ''));
                totalPrice -= itemPrice;
                totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} €`;

                // Remover del array de carrito
                const index = cartItems.indexOf(cartItem);
                if (index !== -1) {
                    cartItems.splice(index, 1);
                }

                // Actualizar la cookie del carrito
                setCookie("cartItems", JSON.stringify(cartItems), 30); 

                // Ocultar el carrito si está vacío
                if (cartItems.length === 0) {
                    cartContent.style.display = "none";
                    checkoutButton.style.display = "none"; 
                }

                // Ocultar el botón si no hay productos en el carrito
                if (cartItems.length === 0) {
                    checkoutButton.style.display = "none";
                }
            });

            // Agregar el botón de eliminar al elemento del carrito
            cartItemElement.appendChild(deleteButton);
            cartItemsContainer.appendChild(cartItemElement);
        });
    });

    // Función para calcular el precio total del carrito
    function calculateTotalPrice(items) {
        return items.reduce((total, item) => {
            const itemPrice = parseFloat(item.split(' - ')[1].replace(' €', ''));
            return total + itemPrice;
        }, 0);
    }

    // Función para mostrar los elementos del carrito
    function showCartItems(items, container) {
        items.forEach(item => {
            const cartItemElement = document.createElement("li");
            cartItemElement.textContent = item;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.classList.add("delete-item");
            deleteButton.addEventListener("click", function() {
                container.removeChild(cartItemElement);
                const itemPrice = parseFloat(item.split(' - ')[1].replace(' €', ''));
                totalPrice -= itemPrice;
                totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} €`;

                const index = cartItems.indexOf(item);
                if (index !== -1) {
                    cartItems.splice(index, 1);
                }

                setCookie("cartItems", JSON.stringify(cartItems), 30); 

                if (cartItems.length === 0) {
                    cartContent.style.display = "none";
                    checkoutButton.style.display = "none"; 
                }

                if (cartItems.length === 0) {
                    checkoutButton.style.display = "none";
                }
            });

            cartItemElement.appendChild(deleteButton);
            container.appendChild(cartItemElement);
        });
    }
}
