const fs = require('fs');

function fetchProducts() {
    const jsonData = fs.readFileSync('productos.json', 'utf8');
    const data = JSON.parse(jsonData);
    const productContainer = document.getElementById('product-container');

    data.productos.forEach(product => {
        const productHTML = `
            <div class="product">
                <h2>${product.nombre}</h2>
                <p>${product.descripcion}</p>
                <p>Precio: ${product.precio} €</p>
                <p>Cantidad en stock: ${product.cantidad_en_stock}</p>
            </div>
        `;
        productContainer.innerHTML += productHTML;
    });
    
}

window.onload = fetchProducts;
