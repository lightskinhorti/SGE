/////////////////////////////////// CREO UNA FUNCIÓN PARA CARGAR DINÁMICAMENTE TABLAS /////////////////////////////////////////////

function cargaDatosTabla(tabla){
   let campoclave;                                                          // Creo  una variable que va a almacenar el nombre del campo que es clave primaria
   /////////////////////////////////// LISTADO DE COLUMNAS DE TABLA /////////////////////////////////////////////
    
    fetch("../../servidor/?o=columnastabla&tabla="+tabla)                 // LLamo a un microservicio que me da la lista de tablas y le paso la tabla como parametro
        .then(response => {
          return response.json();                                           // Quiero que el servidor me devuelva un json
        })
        .then(datos => {
            columnas_tabla = []                                             // Vacía las columnas anteriores para cargar solo las nuevas
            tipos_tabla = []																// Creo un array vacio para almacenar los tipos de dato de las colummnas de la tabla
            claves_tabla = []																// Creo un array vacio para almacenar el tipo de clave de cada columna de la tabla
            campos_busqueda = []															// Creo un array vacio para almacenar los input del buscador de la tabla
            // Verificar que la tabla y sus elementos existen
            let cabeceras_tabla = document.querySelector("table thead tr");
            if (!cabeceras_tabla) {
                let thead = document.querySelector("table thead");
                if (!thead) {
                    console.error("❌ No se encontró la tabla en el DOM.");
                    return;
                }
                cabeceras_tabla = document.createElement("tr");
                thead.appendChild(cabeceras_tabla);
            }

            cabeceras_tabla.innerHTML = ""; // Selecciono donde tengo que poner las cabeceras en la tabla
            cabeceras_tabla.innerHTML = ""                                  // Por si acaso hay columnas previamente cargadas, vacio la cabecera
            datos.forEach(function(dato){                                   // PAra cada uno de los datos
                let elemento = document.createElement("th")                 // Creo un elemento que es una cabecera de tabla
                columnas_tabla.push(dato['Field'])                          // Al listado de columnas le añades la columna actual
                 
                elemento.textContent = dato['Field']                        // Su texto es el nombre del campo de la base de datos
                campos_busqueda.push(document.createElement("input"))											// Creo un elemento de tipo input html
                campos_busqueda[campos_busqueda.length-1].setAttribute("placeholder",dato['Field'] )	// A cada uno de los campos del buscador les pongo un placeholder
                
                claves_tabla.push(dato['Key'])										// Al array de claves le añado el valor de la clave que viene de la base de datos
                
                campos_busqueda[campos_busqueda.length-1].setAttribute("type",convierteTipoDato(dato['Type']) )
                tipos_tabla.push(convierteTipoDato(dato['Type']))
                
                elemento.appendChild(campos_busqueda[campos_busqueda.length-1])											// En cada una de las cabeceras, pongo un campo input
                cabeceras_tabla.appendChild(elemento)                       // Añado ese elemento a las cabeceras de la tabla
                if(dato['Key'] == "PRI"){                                   // Si este campo es clave primaria
                    campoclave = dato['Field']                              // en ese caso, recordamos cual es el nombre del campo que hace de clave primaria
                }
            })
            let elemento = document.createElement("th") 							// Creo una columna mas en la tabla
            elemento.textContent = "🔍"												// En la ultima cabecera de columna pongo la lupa
            cabeceras_tabla.appendChild(elemento) 									// Lo añado a las cabeceras de la tabla
            elemento.onclick = function(){											// Cuando haga click en la lupa

            	mensaje = {}																// Creo un objeto vacio
            	campos_busqueda.forEach(function(campo){							// Para cada uno de los input de busqueda
            		let columna = campo.getAttribute("placeholder")				// Atrapo el nombre del campo
            		let valor = campo.value												// Atrapo el valor del campo
            		if(valor != ""){														// Si el campo no está vacio
            			mensaje[columna] = valor										// Le añado el dato al objeto
            		}
            	})
            	fetch("../../servidor/?o=buscarSimilar&tabla="+tabla, {		// Ahora realizo una peticion al servidor y le paso el objeto
                          method: 'POST', 
                          headers: {
                            'Content-Type': 'application/json', 
                          },
                          body: JSON.stringify(mensaje), 
                        })
					  .then(response => {
						 return response.json();                                                       // Quiero que el servidor me devuelva un json
					  })
					  .then(datos => {			  
					  		pueblaTabla(datos,campoclave,tabla)									// Cuando el servidor me responde, pueblo la tabla con los datos que han venido
					  })
            }
            //console.log(columnas_tabla);
            
                /////////////////////////////////// LISTADO DE COLUMNAS DE TABLA /////////////////////////////////////////////
                let coleccioncampos = []                                          // Creo una colección vacía de campos
                let contiene_modal = document.querySelector("#contienemodal")     // Selecciono el contenedor del modal
                contiene_modal.innerHTML = "<h1>Formulario de inserción: "+tabla+"</h1>"  // Si el modal contenía algo, lo vaćio
                let seccion = document.createElement("section")
                columnas_tabla.forEach(function(columna, index){                  // Para cada una de las columnas de la tabla
                    let contenedor = document.createElement("div")
                    let texto = document.createElement("p")
                    texto.textContent = "Inserta un nuevo elemento para: "+columna+""
                    contenedor.appendChild(texto)
                    
                    if(claves_tabla[index] != "MUL"){
                        coleccioncampos.push(document.createElement("input"))     // Creo un campo input
                        coleccioncampos[coleccioncampos.length-1].setAttribute("type", tipos_tabla[index]) 
                        coleccioncampos[coleccioncampos.length-1].setAttribute("placeholder", columna)
                        coleccioncampos[coleccioncampos.length-1].setAttribute("name", columna)  // Añadir name attribute para FormData
                        contenedor.appendChild(coleccioncampos[coleccioncampos.length-1])                                                                            
                    } else {
                        let selectElement = document.createElement("select");
                        coleccioncampos.push(selectElement);
                
                        let defaultOption = document.createElement("option");
                        defaultOption.textContent = "Selecciona una opción:";
                        selectElement.appendChild(defaultOption);
                
                        fetchOptionsForSelect(selectElement, columna);
                        // Añadir tanto placeholder como name para consistencia
                        selectElement.setAttribute("placeholder", columna);
                        selectElement.setAttribute("name", columna);  // Importante para identificar el campo en PHP
                        
                        contenedor.appendChild(selectElement);
                        selectjv(selectElement);
                    }  
                    
                    seccion.appendChild(contenedor)                               // Lo añado al modal
                })
                contiene_modal.appendChild(seccion) 
                
                let boton_enviar = document.createElement("button")              // Por último creo un boton
                boton_enviar.textContent = "Enviar"                              // Le pongo texto al boton
                boton_enviar.onclick = function() {
                    console.log("Vamos a procesar el formulario");
                    
                    // Crear un objeto para los datos
                    let datosForm = {};
                
                    coleccioncampos.forEach(function(campo) {
                        // Usar el atributo name (o placeholder como respaldo)
                        let nombreCampo = campo.getAttribute('name') || campo.getAttribute('placeholder');
                        
                        if (nombreCampo && nombreCampo !== "Identificador") {
                            // Para inputs normales y selects, obtenemos el valor directamente
                            datosForm[nombreCampo] = campo.value;
                        }
                    });
                
                    // Para depuración, mostrar los datos que se van a enviar
                    console.log("Datos a enviar:", datosForm);
                
                    fetch("../../servidor/?o=insertar&tabla=" + tabla, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(datosForm)
                    })
                    .then(function(response) {
                        if (!response.ok) {
                            throw new Error('Error en la respuesta del servidor: ' + response.status);
                        }
                        return response.text();
                    })
                    .then(function(datos) {
                        console.log("Respuesta del servidor:", datos);
                        document.querySelector("#modal").classList.remove("aparece");
                        document.querySelector("#modal").classList.add("desaparece");
                        setTimeout(function() {
                            document.querySelector("#modal").style.display = "none";
                        }, 1000);
                    })
                    .catch(function(error) {
                        console.error('Error:', error);
                        alert('Error al enviar el formulario: ' + error.message);
                    });
                };
                contiene_modal.appendChild(boton_enviar);                                             // Añado el boton al modal
                /////////////////////////////////// LISTADO DE COLUMNAS DE TABLA /////////////////////////////////////////////
            
            /////////////////////////////////// CONTENIDO DE LA TABLA /////////////////////////////////////////////
 
            fetch("../../servidor/?o=tabla&tabla="+tabla)                            // LLamo a un microservicio que me da la lista de tablas y le paso la tabla como parametro
                .then(response => {
                  return response.json();                                                   // Quiero que el servidor me devuelva un json
                })
                .then(datos => {
                    pueblaTabla(datos,campoclave,tabla)
                })
           
            /////////////////////////////////// CONTENIDO DE LA TABLA /////////////////////////////////////////////
            
            
            /////////////////////////////////// CONTENIDO DE LA VENTANA MODAL /////////////////////////////////////////////
        })
    
 }
 
 /////////////////////////////////// CREO UNA FUNCIÓN PARA CARGAR DINÁMICAMENTE TABLAS /////////////////////////////////////////////
 
 
 
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
        });
}
