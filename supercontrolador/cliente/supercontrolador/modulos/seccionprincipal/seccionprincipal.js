// Función para inicializar las gráficas cuando la página ha cargado
function inicializarGraficas() {
    // Verificar si ya existe la tabla de gráficas, si no, crearla
    if (!document.getElementById('tabla-graficas')) {
        const tabla = document.createElement('table');
        tabla.id = 'tabla-graficas';
        tabla.border = "1";
        tabla.style.width = "100%";
        tabla.style.textAlign = "center";

        // Crear encabezado de la tabla
        const thead = document.createElement('thead');
        const encabezadoFila = document.createElement('tr');
        const thDescripcion = document.createElement('th');
        thDescripcion.textContent = "Descripción";
        const thGrafico = document.createElement('th');
        thGrafico.textContent = "Gráfico";
        encabezadoFila.appendChild(thDescripcion);
        encabezadoFila.appendChild(thGrafico);
        thead.appendChild(encabezadoFila);
        tabla.appendChild(thead);

        // Crear cuerpo de la tabla
        const tbody = document.createElement('tbody');
        tbody.id = 'tbody-graficas'; // Asegurar que tenemos un ID para referencia fácil
        tabla.appendChild(tbody);

        // Buscar dónde insertar la tabla (ajustar según tu estructura HTML)
        const mainContent = document.querySelector('main') || document.body;
        mainContent.appendChild(tabla);
    }
    
    // Cargar las gráficas dentro del tbody
    cargaGraficas();
}

// Función para cargar las gráficas dentro del tbody
function cargaGraficas() {
    console.log("Cargando estadísticas de tablas...");

    const tbody = document.querySelector("#tbody-graficas");
    if (!tbody) {
        console.error("❌ No se encontró el tbody de la tabla de gráficas.");
        return;
    }

    tbody.innerHTML = "";

    let loadingRow = document.createElement("tr");
    let loadingCell = document.createElement("td");
    loadingCell.colSpan = 2;
    loadingCell.textContent = "Cargando estadísticas...";
    loadingCell.style.textAlign = "center";
    loadingRow.appendChild(loadingCell);
    tbody.appendChild(loadingRow);

    fetch("../../servidor/?o=estadisticastablas")
        .then(response => response.json())
        .then(datos => {
            console.log("Datos recibidos del servidor:", datos);

            if (!Array.isArray(datos) || datos.length === 0) {
                tbody.innerHTML = '<tr><td colspan="2" style="text-align: center;">No hay datos disponibles</td></tr>';
                return;
            }

            tbody.innerHTML = "";

            let graficos = [
                { tipo: "anillo", color: "#3498db", id: "grafica-anillo", titulo: "Registros por tabla (Anillo)" },
                { tipo: "tarta", color: "#e74c3c", id: "grafica-tarta", titulo: "Registros por tabla (Tarta)" }
            ];

            graficos.forEach(({ tipo, color, id, titulo }) => {
                let row = document.createElement("tr");
                let cellText = document.createElement("td");
                let cellGraph = document.createElement("td");

                cellText.textContent = `Gráfico de ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}:`;
                let canvas = document.createElement("div");
                canvas.id = id;
                cellGraph.appendChild(canvas);

                row.appendChild(cellText);
                row.appendChild(cellGraph);
                tbody.appendChild(row);

                let grafico = new JVGrafica(datos, color, `#${id}`, titulo);
                grafico[tipo]();
            });

            console.log("✅ Gráficas insertadas correctamente en la tabla.");
        })
        .catch(error => {
            console.error("❌ Error al cargar los datos:", error);
            tbody.innerHTML = `<tr><td colspan="2" style="color: red; text-align: center;">
                Error al cargar los datos: ${error.message}
            </td></tr>`;
        });
}

// Llamar a inicializarGraficas cuando la página ha cargado
document.addEventListener('DOMContentLoaded', inicializarGraficas);

// Exponer la función cargaGraficas globalmente
window.cargaGraficas = cargaGraficas;

function cargoAplicaciones(){
	////////////////////////////////// CARGO LAS APLICACIONES /////////////////////////////////////////////
    
    fetch("apps/apps.json")
    .then(function(response){
    	return response.json()
    })
    .then(function(datos){
    	console.log(datos)
    	aplicaciones = datos
    })
}
