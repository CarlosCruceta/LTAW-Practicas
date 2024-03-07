document.addEventListener('DOMContentLoaded', function () {
    var dots = document.querySelectorAll('.dot');
    var images = document.querySelectorAll('.image-container img');
    var imageText = document.getElementById('image-text');

    // Textos predefinidos asociados a cada punto
    var paragraphs = [
        "<b>OPTIMIZACIÓN DEL LIVE PLAYBACK<b><br><br>Botón de repetición de nota más grande y visible, junto con la Banda Inteligente, brindan nuevas posibilidades para tocar redobles, arpegios y mucho más.",
        "<b>PANTALLAS DE ALTA RESOLUCIÓN<b><br><br>Dos pantallas a color de alta resolución con encoder pulsable ofrecen una forma visual e intuitiva de buscar sonidos, efectos, plug-ins e instrumentos con una sola mano.",
        "<b>INTERFAZ PROFESIONAL DE AUDIO<b><br><br>Disfruta de un sonido brillante con la interfaz profesional de audio a 96 kHz y 24 bits, garantizando una calidad excepcional en tu producción musical.",
        "<b>PADS MEJORADOS<b><br><br>Disfruta de una experiencia más fluida y expresiva gracias a los pads mejorados, que son ahora más amplios y sensibles. Esto te proporciona la capacidad de tocar con una precisión y dinamismo excepcionales.",
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
