/////////////////////////////////// CREO UNA FUNCIÓN PARA CARGAR DINÁMICAMENTE TABLAS /////////////////////////////////////////////

function cargaDatosTabla(tabla){
    let campoclave;  // Creo una variable que va a almacenar el nombre del campo que es clave primaria

    /////////////////////////////////// LISTADO DE COLUMNAS DE TABLA /////////////////////////////////////////////
    fetch("../../servidor/?o=columnastabla&tabla=" + tabla)  // Llamo a un microservicio que me da la lista de columnas de la tabla
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las columnas de la tabla');
            }
            return response.json();  // Devuelvo el JSON que el servidor envía
        })
        .then(datos => {
            // Inicializo los arrays donde almacenaré las columnas, tipos, claves y campos de búsqueda
            columnas_tabla = [];
            tipos_tabla = [];
            claves_tabla = [];
            campos_busqueda = [];

            let cabeceras_tabla = document.querySelector("table thead tr");  // Selecciono donde colocaré las cabeceras de la tabla
            cabeceras_tabla.innerHTML = "";  // Vacío cualquier contenido previo en la cabecera

            // Itero sobre los datos recibidos para construir las cabeceras de la tabla y los inputs de búsqueda
            datos.forEach(function(dato) {
                let elemento = document.createElement("th");  // Creo un elemento th para cada columna
                columnas_tabla.push(dato['Field']);  // Agrego el nombre de la columna al array de columnas

                elemento.textContent = dato['Field'];  // Establezco el nombre de la columna como texto
                campos_busqueda.push(document.createElement("input"));  // Creo un input para la búsqueda
                campos_busqueda[campos_busqueda.length - 1].setAttribute("placeholder", dato['Field']);  // Establezco el placeholder del input

                claves_tabla.push(dato['Key']);  // Agrego el tipo de clave de la columna
                campos_busqueda[campos_busqueda.length - 1].setAttribute("type", convierteTipoDato(dato['Type']));  // Establezco el tipo de input según el tipo de dato
                tipos_tabla.push(convierteTipoDato(dato['Type']));  // Agrego el tipo de dato al array

                elemento.appendChild(campos_busqueda[campos_busqueda.length - 1]);  // Agrego el input a la cabecera
                cabeceras_tabla.appendChild(elemento);  // Agrego el elemento th a la cabecera

                if (dato['Key'] == "PRI") {  // Si la columna es clave primaria
                    campoclave = dato['Field'];  // Recordamos el nombre del campo clave
                }
            });

            // Añadimos una columna extra con una lupa para activar la búsqueda
            let elemento = document.createElement("th");
            elemento.textContent = "🔍";  // Establezco el texto de la columna como un ícono de lupa
            cabeceras_tabla.appendChild(elemento);

            // Configuro el comportamiento de la lupa al hacer clic
            elemento.onclick = function() {
                let mensaje = {};  // Creo un objeto vacío para enviar al servidor

                // Recorro los campos de búsqueda y los agrego al objeto mensaje
                campos_busqueda.forEach(function(campo) {
                    let columna = campo.getAttribute("placeholder");
                    let valor = campo.value;
                    if (valor != "") {  // Si el campo no está vacío
                        mensaje[columna] = valor;  // Agrego el valor al objeto mensaje
                    }
                });

                // Realizo una petición al servidor para buscar los datos similares
                fetch("../../servidor/?o=buscarSimilar&tabla=" + tabla, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(mensaje),
                })
                .then(response => response.json())
                .then(datos => {
                    pueblaTabla(datos, campoclave, tabla);  // Poblamos la tabla con los datos obtenidos
                })
                .catch(error => {
                    console.error('Error al realizar la búsqueda:', error);  // Manejo de errores
                });
            };

            // Construcción dinámica del formulario de inserción
            let coleccioncampos = [];  // Array para almacenar los campos de inserción
            let contiene_modal = document.querySelector("#contienemodal");
            contiene_modal.innerHTML = "<h1>Formulario de inserción: " + tabla + "</h1>";  // Establezco el título del modal

            let seccion = document.createElement("section");  // Sección para contener los inputs de inserción
            columnas_tabla.forEach(function(columna, index) {
                let contenedor = document.createElement("div");
                let texto = document.createElement("p");
                texto.textContent = "Inserta un nuevo elemento para: " + columna;
                contenedor.appendChild(texto);

                // Si la columna no es una clave foránea, creo un input
                if (claves_tabla[index] != "MUL") {
                    coleccioncampos.push(document.createElement("input"));
                    coleccioncampos[coleccioncampos.length - 1].setAttribute("type", tipos_tabla[index]);
                    coleccioncampos[coleccioncampos.length - 1].setAttribute("placeholder", columna);
                    contenedor.appendChild(coleccioncampos[coleccioncampos.length - 1]);
                } else {
                    let selectElement = document.createElement("select");
                    coleccioncampos.push(selectElement);

                    let defaultOption = document.createElement("option");
                    defaultOption.textContent = "Selecciona una opción:";
                    selectElement.appendChild(defaultOption);

                    fetchOptionsForSelect(selectElement, columna);  // Lleno el select con opciones
                    contenedor.appendChild(selectElement);
                    selectjv(selectElement);  // Función personalizada (no proporcionada en el código original)
                }

                seccion.appendChild(contenedor);  // Agrego el contenedor al formulario
            });
            contiene_modal.appendChild(seccion);  // Finalmente agrego la sección al modal

            // Creo el botón para enviar el formulario
            let boton_enviar = document.createElement("button");
            boton_enviar.textContent = "Enviar";
            boton_enviar.onclick = function() {
                let formData = new FormData();

                // Recorro los campos del formulario y los agrego al FormData
                coleccioncampos.forEach(function(campo) {
                    if (campo.getAttribute('placeholder') !== "Identificador") {
                        if (campo.getAttribute('type') === "file") {
                            let archivo = campo.files[0];
                            formData.append(campo.getAttribute('placeholder'), archivo);
                        } else {
                            formData.append(campo.getAttribute('placeholder'), campo.value);
                        }
                    }
                });

                // Envio los datos al servidor para insertar el nuevo registro
                fetch("../../servidor/?o=insertar&tabla=" + tabla, {
                    method: 'POST',
                    body: formData
                })
                .then(function(response) {
                    return response.text();
                })
                .then(function(datos) {
                    console.log(datos);
                    document.querySelector("#modal").classList.remove("aparece");
                    document.querySelector("#modal").classList.add("desaparece");
                    setTimeout(function() {
                        document.querySelector("#modal").style.display = "none";
                    }, 1000);
                })
                .catch(error => {
                    console.error('Error al enviar el formulario:', error);
                });
            };
            contienemodal.appendChild(boton_enviar);  // Agrego el botón al modal

            // Cargar los datos de la tabla
            fetch("../../servidor/?o=tabla&tabla=" + tabla)
                .then(response => response.json())
                .then(datos => {
                    pueblaTabla(datos, campoclave, tabla);
                })
                .catch(error => {
                    console.error('Error al cargar los datos de la tabla:', error);
                });
        })
        .catch(error => {
            console.error('Error al obtener las columnas de la tabla:', error);
        });
}

/////////////////////////////////// CREO UNA FUNCIÓN PARA CARGAR LAS OPCIONES DE UN SELECT /////////////////////////////////////////////

function fetchOptionsForSelect(selectElement, column) {
    fetch("../../servidor/?o=tabla&tabla=" + column.split("_")[0])
        .then(response => response.json())
        .then(datos => {
            datos.forEach(function(dato) {
                let option = document.createElement("option");
                option.value = dato['Identificador'];
                option.textContent = Object.values(dato).join(' - ');
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al obtener las opciones del select:', error);
        });
}
