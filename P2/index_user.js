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

    for (let i = 0; i < cookieArray.length; i++) {
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

// Define una función para inicializar el carrito y la funcionalidad asociada
function initializeCart() {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartContent = document.getElementById("cart-content");
    const totalPriceElement = document.getElementById("total-price");
    const checkoutButton = document.createElement("button");
    checkoutButton.textContent = "Finalizar compra";
    checkoutButton.classList.add("checkout-button");
    let totalPrice = 0;

    addToCartButtons.forEach(button => {
        button.addEventListener("click", function(event) {
            const productContainer = event.target.closest(".product");
            const productName = productContainer.querySelector("h2").textContent;
            const productPrice = parseFloat(productContainer.querySelector("p").textContent.replace('€', ''));

            // Crear un nuevo elemento <li> para el producto y agregarlo al carrito
            const cartItem = document.createElement("li");
            cartItem.textContent = `${productName} - ${productPrice}€`;

            // Agregar botón de eliminar
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.classList.add("delete-item");
            deleteButton.addEventListener("click", function() {
                cartItemsContainer.removeChild(cartItem); // Eliminar el elemento del carrito
                totalPrice -= productPrice;
                totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)}€`;

                // Ocultar el botón de finalizar compra si no hay elementos en el carrito
                if (cartItemsContainer.children.length == 0) {
                    checkoutButton.style.display = "none";
                }
            });

            cartItem.appendChild(deleteButton);
            cartItemsContainer.appendChild(cartItem);

            // Actualizar el precio total
            totalPrice += productPrice;
            totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)}€`;

            // Mostrar el botón de finalizar compra si hay elementos en el carrito
            if (cartItemsContainer.children.length > 0) {
                checkoutButton.style.display = "block";
            }
        });
    });

    // Botón de finalización de compra
    checkoutButton.addEventListener("click", function() {
        window.location.href = "compra.html"; // Redirigir a la página de compra
    });

    cartContent.appendChild(checkoutButton);

    // Mostrar u ocultar el carrito cuando se haga clic en el botón
    const dropbtn = document.querySelector(".dropdown i");
    dropbtn.addEventListener("click", function() {
        cartContent.classList.toggle("show");
    });

    // Cerrar el carrito cuando se haga clic fuera de él
    window.addEventListener("click", function(event) {
        if (!event.target.matches('.dropdown i')) {
            const dropdowns = document.getElementsByClassName("dropdown-content");
            for (let i = 0; i < dropdowns.length; i++) {
                const openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    });
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
    initializeCart(); // Inicializar el carrito
});
