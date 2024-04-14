document.addEventListener("DOMContentLoaded", function() {
    const orderForm = document.getElementById("order-form");

    orderForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const formData = new FormData(orderForm);

        fetch('/realizar-pedido', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al procesar el pedido.');
            }
            return response.text();
        })
        .then(data => {
            console.log(data);
            // Aquí podrías mostrar un mensaje de confirmación al usuario
        })
        .catch(error => {
            console.error(error);
            // Aquí podrías mostrar un mensaje de error al usuario
        });
    });
});
