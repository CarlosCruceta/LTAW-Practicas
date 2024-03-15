document.addEventListener('DOMContentLoaded', function () {
    var dots = document.querySelectorAll('.dot');
    var images = document.querySelectorAll('.image-container img');
    var imageText = document.getElementById('image-text');

    // Textos predefinidos asociados a cada punto
    var paragraphs = [
        "<b>PADS Y BOTONES INTUITIVOS</b><br><br>32 pads retroiluminados. Los pads sensibles a la velocidad ofrecen una experiencia táctil excepcional para la creación de ritmos, mientras que los botones asignables te permiten controlar de manera fácil y rápida funciones esenciales durante tu sesión de producción.",
        "<b>EDICIÓN LIMITADA 'GREY VERSION'</b><br><br>Descubre la elegancia en la edición limitada del Novation Circuits Tracks.  Haz una declaración de estilo mientras desatas tu creatividad musical explotando todas sus capacidades de producción.",
        "<b>CONEXIONES VERSÁTILES</b><br><br>Entradas y salidas MIDI y conexiones USB. Una conectividad digital avanzada que permite integrar el Circuits Tracks en tu estudio o actuación. Aprovecha al máximo la sincronización de reloj y la integración con software de producción.",
        "<b>POTENCIÓMETROS Y EFECTOS DINÁMICOS</b><br><br>Ajusta con precisión tu sonido con los 8 potenciómetros táctiles y asignables. Ofrece una variedad de efectos integrados, desde filtros y reverberaciones hasta distorsiones. La versatilidad de los potenciómetros te brinda un control total sobre tu mezcla."
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
