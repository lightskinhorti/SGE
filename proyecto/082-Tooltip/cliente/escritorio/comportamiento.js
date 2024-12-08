window.onload = function(){
    // Realizo una solicitud fetch al servidor para obtener la lista de aplicaciones
    fetch("../../servidor/?o=tabla&tabla=aplicaciones")
        .then(response => {
            // Verifico si la respuesta fue exitosa
            if (!response.ok) {
                throw new Error('Error en la comunicación con el servidor');
            }
            return response.json();  // Devuelvo el JSON que el servidor envía
        })
        .then(data => {
            const plantilla = document.getElementById('plantilla_aplicacion');  // Cargamos la plantilla HTML

            console.log(data);  // Vomito el JSON para ver qué datos he recibido

            // Iteramos sobre los elementos del JSON que contiene la lista de aplicaciones
            data.forEach(function(elemento) {
                console.log(elemento);  // Vomito cada elemento de la lista de aplicaciones

                // Clonamos la plantilla y creamos una nueva instancia
                const instancia = plantilla.content.cloneNode(true);

                // Seleccionamos el elemento <p> dentro de la plantilla y le asignamos el nombre de la aplicación
                const nombre = instancia.querySelector('p');
                nombre.innerHTML = elemento.nombre;

                // Seleccionamos el icono y le asignamos la primera letra del nombre de la aplicación
                let icono = instancia.querySelector(".icono");
                icono.textContent = elemento.nombre[0];  // Usamos la primera letra del nombre como icono

                // Añadimos la nueva instancia al DOM
                document.querySelector('main').appendChild(instancia);
            });

            // Seleccionamos todas las aplicaciones y les asignamos un evento de clic
            let aplicaciones = document.querySelectorAll(".aplicacion");
            aplicaciones.forEach(function(aplicacion) {
                // Cuando se hace clic en una aplicación, redirigimos a la URL correspondiente
                aplicacion.onclick = function() {
                    window.location = "../supercontrolador/";
                };
            });
        })
        .catch(error => {
            // En caso de error en la solicitud, mostramos un mensaje en la consola
            console.error('Hubo un problema con la solicitud fetch:', error);
        });
}
