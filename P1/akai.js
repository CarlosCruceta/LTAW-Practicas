document.addEventListener('DOMContentLoaded', function () {
  var dots = document.querySelectorAll('.dot');
  var images = document.querySelectorAll('.image-container img');
  var imageText = document.getElementById('image-text'); // Nuevo elemento de texto
  
  // Por defecto, seleccionar el primer punto e imagen
  changeImage(0);

  function changeImage(index) {
      // Aplicar estilos a todas las imágenes y puntos
      images.forEach(function (image, i) {
          if (i === index) {
              // Mantener la opacidad original para la imagen seleccionada
              image.style.opacity = '1';
              
              // Mostrar el texto correspondiente a la imagen seleccionada
              imageText.innerHTML = 'Texto para la imagen ' + (index + 1);
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
