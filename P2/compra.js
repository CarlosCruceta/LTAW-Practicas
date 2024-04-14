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
