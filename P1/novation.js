document.addEventListener('DOMContentLoaded', function () {
    var dots = document.querySelectorAll('.dot');
    var images = document.querySelectorAll('.image-container img');
    var imageText = document.getElementById('image-text');

    // Textos predefinidos asociados a cada punto
    var paragraphs = [
        "<b>16 POTENCIÓMETROS Q-LINK CON PANTALLAS OLED</b><br><br>Enlaza tus efecto favoritos de forma personalizada, observando todos los parámetros necesarios nítidamente gracias a sus fantásticas pantallas OLED.",
        "<b>PANTALLA TÁCTIL MULTI-TOUCH A COLOR</b><br><br>Pantalla táctil multigestual a todo color de 10,1 pulgadas con ángulo ajustable.",
        "<b>TODAS LAS I/O QUE NECESITES</b><br>2 entradas combo XLR/jack con alimentación phantom, 2 entradas jack TRS/RCA línea/phono, 8 salidas TRS 6,35 mm, 8 salidas TS CV/Gate, 2 E/S MIDI 5 pines, Salidas de auriculares jack y minijak",
        "<b>PADS MPC ILUMINADOS</b><br><br>16 velocity- and pressure-sensitive pads, retroiluminados RGB que permiten un tacto cómodo y firme, controlando cada sonido de manera única.",
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
                image.style.opacity = '0.2';
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
