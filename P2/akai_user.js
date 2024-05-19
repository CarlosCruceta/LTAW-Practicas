// Función para obtener los productos del archivo JSON
function fetchProducts() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'tienda.json', true); // Ajusta la ruta según la ubicación de tu archivo JSON
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            var data = JSON.parse(xhr.responseText);
            var productos = data.productos; // Obtén la lista de productos del archivo JSON

            // Nombre del producto inicial a mostrar
            var nombreProducto = "Akai MPC X SE";

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
    let totalPrice = 0;
    let cartItems = [];

    addToCartButtons.forEach(button => {
        button.addEventListener("click", function(event) {
            const productContainer = event.target.closest(".product");
            const productName = document.getElementById("product-name").textContent;
            const productPriceText = document.getElementById("product-price").textContent;
            const productPrice = parseFloat(productPriceText.replace('Precio: ', '').replace(' €', ''));

            const cartItem = document.createElement("li");
            cartItem.textContent = `${productName} - ${productPrice} €`;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.classList.add("delete-item");
            deleteButton.addEventListener("click", function() {
                cartItemsContainer.removeChild(cartItem);
                totalPrice -= productPrice;
                totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} €`;

                const index = cartItems.indexOf(`${productName} - ${productPrice} €`);
                if (index !== -1) {
                    cartItems.splice(index, 1);
                }

                if (cartItemsContainer.childElementCount === 0) {
                    cartContent.style.display = "none";
                }

                localStorage.setItem("cartItems", JSON.stringify(cartItems));
            });

            cartItem.appendChild(deleteButton);
            cartItemsContainer.appendChild(cartItem);

            totalPrice += productPrice;
            totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} €`;

            if (cartContent.style.display === "none") {
                cartContent.style.display = "block";
            }

            cartItems.push(`${productName} - ${productPrice} €`);
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        });
    });

    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
        cartItems = JSON.parse(storedCartItems);
        cartItems.forEach(item => {
            const cartItem = document.createElement("li");
            cartItem.textContent = item;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.classList.add("delete-item");
            deleteButton.addEventListener("click", function() {
                cartItemsContainer.removeChild(cartItem);
                const itemPrice = parseFloat(item.split(' - ')[1].replace(' €', ''));
                totalPrice -= itemPrice;
                totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} €`;

                const index = cartItems.indexOf(item);
                if (index !== -1) {
                    cartItems.splice(index, 1);
                }

                if (cartItemsContainer.childElementCount === 0) {
                    cartContent.style.display = "none";
                }

                localStorage.setItem("cartItems", JSON.stringify(cartItems));
            });

            cartItem.appendChild(deleteButton);
            cartItemsContainer.appendChild(cartItem);
        });

        if (cartItems.length > 0) {
            cartContent.style.display = "block";
        }
    }
}

