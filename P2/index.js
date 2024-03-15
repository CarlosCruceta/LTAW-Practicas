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

// Llama a fetchProducts cuando la página esté completamente cargada
window.onload = fetchProducts;
