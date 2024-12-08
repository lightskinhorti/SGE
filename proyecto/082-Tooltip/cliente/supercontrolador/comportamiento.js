/////////////////////////////////// VARIABLES GLOBALES DEL PROGRAMA /////////////////////////////////////////////

// Creo una variable global para almacenar las columnas de la tabla
var columnas_tabla = [];

/////////////////////////////////// VARIABLES GLOBALES DEL PROGRAMA /////////////////////////////////////////////

window.onload = function() {
    /////////////////////////////////// LISTADO DE TABLAS /////////////////////////////////////////////

    // Realizo una solicitud fetch para obtener la lista de tablas desde el servidor
    fetch("../../servidor/?o=listatablas")
        .then(response => {
            // Verifico si la respuesta fue exitosa
            if (!response.ok) {
                throw new Error('Error al obtener la lista de tablas');
            }
            return response.json();  // Devuelvo el JSON que el servidor envía
        })
        .then(datos => {
            // Llamo a la función para poblar el menú de navegación con los datos de las tablas
            poblarMenuNavegacion(datos);
        })
        .catch(error => {
            // En caso de error en la solicitud, muestro un mensaje de error
            console.error('Hubo un problema con la solicitud fetch:', error);
        });

    /////////////////////////////////// LISTADO DE TABLAS /////////////////////////////////////////////

    // Cargo la tabla "clientes" por defecto cuando se inicia el programa
    cargaDatosTabla("clientes");

    /////////////////////////////////// CLICK VENTANA MODAL PARA INSERTAR /////////////////////////////////////////////

    // Asigno el comportamiento al botón de "insertar"
    document.querySelector("#insertar").onclick = function() {
        // Muestra la ventana modal y activa la animación de aparición
        document.querySelector("#modal").style.display = "block";
        document.querySelector("#modal").classList.remove("desaparece");
        document.querySelector("#modal").classList.add("aparece");
    };

    // Al hacer clic en la ventana modal, la cierro y activo la animación de desaparición
    document.querySelector("#modal").onclick = function() {
        document.querySelector("#modal").classList.remove("aparece");
        document.querySelector("#modal").classList.add("desaparece");

        // Después de la animación, oculto la ventana modal
        setTimeout(function() {
            document.querySelector("#modal").style.display = "none";
        }, 1000);
    };

    // Prevengo que un clic dentro del contenedor del modal cierre la ventana modal
    document.querySelector("#contienemodal").onclick = function(event) {
        event.stopPropagation();  // Detengo la propagación del evento para evitar que se cierre el modal
    };
};
