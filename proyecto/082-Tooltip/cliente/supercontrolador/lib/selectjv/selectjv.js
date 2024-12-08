// Función principal que transforma un elemento <select> en un componente personalizado
function selectjv(selector) {

  // Array para almacenar contenedores
  contenedores = [];
  
  // Crear un contenedor para el selector
  contenedores.push(document.createElement("div"));
  contenedores[contenedores.length - 1].classList.add("selectjv");  // Añadir clase "selectjv" al contenedor

  // Añadir un evento de clic para evitar la propagación del clic a otros elementos
  contenedores[contenedores.length - 1].onclick = function(e) {
      e.stopPropagation();
  };

  // Reemplazar el <select> original con el nuevo contenedor
  selector.replaceWith(contenedores[contenedores.length - 1]);

  // Crear una caja para mostrar el texto de la opción seleccionada
  let caja = document.createElement("div");
  caja.classList.add("caja");
  caja.textContent = selector.querySelector("option:first-child").textContent;  // Establecer el texto de la primera opción
  contenedores[contenedores.length - 1].appendChild(caja);  // Añadir la caja al contenedor
  contenedores[contenedores.length - 1].appendChild(selector);  // Añadir el <select> al contenedor

  // Evento para abrir las opciones cuando se hace clic en la caja
  caja.onclick = function(e) {
      e.stopPropagation();
      caja.classList.add("radio2");  // Cambiar la clase de la caja para marcarla como seleccionada
      
      let resultados = document.createElement("div");  // Crear el contenedor de los resultados
      resultados.classList.add("resultados");  // Añadir clase "resultados"
      this.appendChild(resultados);  // Añadir los resultados al contenedor de la caja
      
      // Crear el campo de búsqueda
      let buscador = document.createElement("input");
      buscador.setAttribute("type", "search");
      buscador.setAttribute("placeholder", "busca...");
      resultados.appendChild(buscador);  // Añadir el campo de búsqueda a los resultados
      
      // Evento para manejar el clic en el buscador (no realiza ninguna acción aquí)
      buscador.onclick = function(e) {
          console.log("ok hola");
          e.stopPropagation();
      };

      // Evento que se dispara cuando el usuario teclea en el campo de búsqueda
      buscador.onkeyup = function(e) {
          let busca = this.value;  // Obtener el texto del campo de búsqueda
          contieneresultados.innerHTML = "";  // Limpiar los resultados anteriores

          // Filtrar las opciones que coinciden con el texto de búsqueda
          opciones.forEach(function(opcion) {
              if (opcion.textContent.toLowerCase().includes(busca.toLowerCase())) {
                  let texto = document.createElement("p");
                  texto.textContent = opcion.textContent;  // Crear un <p> con el texto de la opción
                  contieneresultados.appendChild(texto);  // Añadir el texto al contenedor de resultados
                  
                  // Evento que se dispara cuando el usuario selecciona una opción
                  texto.onclick = function() {
                      console.log("has hecho click en una opcion: ", texto.textContent);
                      resultados.remove();  // Eliminar los resultados
                      caja.textContent = texto.textContent;  // Actualizar el texto de la caja con la opción seleccionada

                      // Marcar la opción seleccionada en el <select> original
                      let opciones2 = selector.querySelectorAll("option");
                      opciones2.forEach(function(opcion2) {
                          if (opcion2.textContent == texto.textContent) {
                              opcion2.setAttribute("selected", true);  // Establecer el atributo "selected"
                          } else {
                              opcion2.removeAttribute("selected");  // Eliminar el atributo "selected" de las demás opciones
                          }
                      });
                  };
              }
          });
      };

      // Crear un contenedor para las opciones filtradas
      let contieneresultados = document.createElement("div");
      contieneresultados.onclick = function(e) {
          e.stopPropagation();  // Evitar que el clic se propague
      };

      // Obtener todas las opciones del <select> original
      let opciones = selector.querySelectorAll("option");
      opciones.forEach(function(opcion) {
          let texto = document.createElement("p");
          texto.textContent = opcion.textContent;  // Crear un <p> con el texto de la opción
          contieneresultados.appendChild(texto);  // Añadir el texto al contenedor de resultados

          // Evento que se dispara cuando el usuario selecciona una opción
          texto.onclick = function() {
              console.log("has hecho click en una opcion: ", texto.textContent);
              resultados.remove();  // Eliminar los resultados
              caja.textContent = texto.textContent;  // Actualizar el texto de la caja con la opción seleccionada

              // Marcar la opción seleccionada en el <select> original
              let opciones2 = selector.querySelectorAll("option");
              opciones2.forEach(function(opcion2) {
                  if (opcion2.textContent == texto.textContent) {
                      opcion2.setAttribute("selected", true);
                  } else {
                      opcion2.removeAttribute("selected");
                  }
              });
          };
      });

      // Añadir el contenedor de opciones filtradas a los resultados
      resultados.appendChild(contieneresultados);
      resultados.onclick = function(e) {
          e.stopPropagation();  // Evitar que el clic se propague
      };
  };

  // Evento para cerrar los resultados al hacer clic fuera del contenedor
  document.onclick = function() {
      console.log("ok body");
      contenedores.forEach(function(contenedor) {
          try {
              contenedor.querySelector(".resultados").remove();  // Eliminar los resultados
              contenedor.querySelector(".caja").classList.remove("radio2");  // Eliminar la clase "radio2"
          } catch (error) {
              console.log("error pero no pasa nada");
          }
      });
  };
}
