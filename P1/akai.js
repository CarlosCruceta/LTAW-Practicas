document.addEventListener('DOMContentLoaded', function () {
    var dots = document.querySelectorAll('.dot');
    var images = document.querySelectorAll('.image-container img');
    var imageText = document.getElementById('image-text');

    // Textos predefinidos asociados a cada punto
    var paragraphs = [
        "Este es el párrafo asociado al punto 1.",
        "SMART STRIP \
         La Smart Strip con doble detección táctil te abre la puerta a nuevas formas de tocar. Rasguea notas, haz inflexiones de tono o incorpora texturas complejas con la función Perform FX.",
        "BOTONES PARA SELECCIÓN DE GRUPO Y TRANSPORTE",
        "PANTALLAS DE ALTA RESOLUCIÓN A COLOR"
    ];

    // Por defecto, seleccionar el primer punto e imagen
    changeImage(0);

    function changeImage(index) {
        // Aplicar estilos a todas las imágenes y puntos
        images.forEach(function (image, i) {
            if (i === index) {
                // Mantener la opacidad original para la imagen seleccionada
                image.style.opacity = '1';

                // Mostrar el párrafo correspondiente a la imagen seleccionada
                imageText.innerHTML = paragraphs[index];
                imageText.style.display = 'block';
            } else {
                // Aplicar una opacidad menor para las otras imágenes
                image.style.opacity = '0.3';
            }
        });

        dots.forEach(function (dot, i) {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            changeImage(index);
        });
    });
});
