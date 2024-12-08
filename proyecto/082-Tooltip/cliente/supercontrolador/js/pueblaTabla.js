function pueblaTabla(datos, campoclave, tabla) {
    let contenidotabla = document.querySelector("section table tbody");  // Selecciono el contenido vacío de la tabla
    contenidotabla.innerHTML = "";  // Vacio la tabla por si había algo

    // Verificación de que 'datos' es un array y no está vacío
    if (!Array.isArray(datos) || datos.length === 0) {
        console.error("No se proporcionaron datos válidos.");
        return;
    }

    // Itera sobre los registros
    datos.forEach(function (registro) {
        let clave_primaria;
        let nuevafila = document.createElement("tr");  // Creo una nueva fila

        // Itera sobre las claves del registro (objeto)
        Object.keys(registro).forEach(clave => {
            if (clave === campoclave) {
                clave_primaria = registro[clave];  // Guarda la clave primaria
            }

            let nuevacolumna = document.createElement("td");  // Creo una nueva columna
            nuevacolumna.textContent = registro[clave];  // Pongo el contenido de la celda

            // Añado atributos personalizados a la celda
            nuevacolumna.setAttribute("tabla", tabla);
            nuevacolumna.setAttribute("columna", clave);
            nuevacolumna.setAttribute("Identificador", clave_primaria);

            // Manejo de eventos: Doble clic para hacer editable
            nuevacolumna.ondblclick = function () {
                console.log("Has hecho click en una celda");
                this.setAttribute("contenteditable", "true");
                this.focus();
            };

            // Cuando pierdo el foco de la celda, se envía la actualización al servidor
            nuevacolumna.onblur = function () {
                this.setAttribute("contenteditable", "false");
                let mensaje = {
                    "tabla": this.getAttribute("tabla"),
                    "columna": this.getAttribute("columna"),
                    "Identificador": this.getAttribute("Identificador"),
                    "valor": this.textContent
                };

                // Petición para actualizar la base de datos
                fetch("../../servidor/?o=actualizar", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(mensaje),
                })
                    .then(response => response.json())
                    .then(datos => {
                        console.log("Datos actualizados:", datos);
                    })
                    .catch(error => {
                        console.error("Error al actualizar:", error);
                    });
            };

            nuevafila.appendChild(nuevacolumna);  // Agrego la columna a la fila
        });

        // Columna para la papelera de eliminación
        let nuevacolumna = document.createElement("td");
        nuevacolumna.textContent = "🗑️";  // Emoji de la papelera
        nuevacolumna.setAttribute("claveprimaria", clave_primaria);  // Clave primaria

        // Evento de clic para eliminar
        nuevacolumna.onclick = function () {
            console.log("Vamos a eliminar algo");
            let identificador = this.getAttribute("claveprimaria");

            // Petición para eliminar el registro
            fetch(`../../servidor/?o=eliminar&tabla=${tabla}&id=${identificador}`)
                .then(response => response.json())
                .then(datos => {
                    console.log("Registro eliminado:", datos);
                })
                .catch(error => {
                    console.error("Error al eliminar:", error);
                });

            // Elimino visualmente la fila de la tabla
            this.parentElement.remove();
        };

        // Agrego la columna de la papelera a la fila
        nuevafila.appendChild(nuevacolumna);
        contenidotabla.appendChild(nuevafila);  // Finalmente, agrego la fila a la tabla
    });
}
