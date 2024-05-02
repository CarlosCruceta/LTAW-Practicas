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


const display1 = document.getElementById("display1");
const caja = document.getElementById("caja");

//-- Retrollamda del boton de Ver productos
caja.oninput = () => {

    //-- Crear objeto para hacer peticiones AJAX
    const m = new XMLHttpRequest();

    //-- Función de callback que se invoca cuando
    //-- hay cambios de estado en la petición
    m.onreadystatechange = () => {

        //-- Petición enviada y recibida. Todo OK!
        if (m.readyState==4) {

            //-- Solo la procesamos si la respuesta es correcta
            if (m.status==200) {

                //-- La respuesta es un objeto JSON
                let productos = JSON.parse(m.responseText)

                console.log(productos);

                //-- Borrar el resultado anterior
                display1.innerHTML = "";

                //--Recorrer los productos del objeto JSON
                for (let i=0; i < productos.length; i++) {

                    //-- Añadir cada producto al párrafo de visualización
                    display1.innerHTML += productos[i];

                    //-- Separamos los productos por ',''
                    if (i < productos.length-1) {
                    display1.innerHTML += ', ';
                    }
                }

            } else {
                //-- Hay un error en la petición
                //-- Lo notificamos en la consola y en la propia web
                console.log("Error en la petición: " + m.status + " " + m.statusText);
                display2.innerHTML += '<p>ERROR</p>'
            }
        }
    }

    console.log(caja.value.length);

    //-- La peticion se realia solo si hay al menos 1 carácter
    if (caja.value.length >= 3) {

      //-- Configurar la petición
      m.open("GET","/productos?param1=" + caja.value, true);

      //-- Enviar la petición!
      m.send();
      
    } else {
        display1.innerHTML="";
    }
}
