window.onload = function() {
    // Verificar si el usuario está autenticado
    let usuario = localStorage.getItem("crimson_usuario");
    let token = localStorage.getItem("crimson_token");
    
    if (!usuario || !token) {
        window.location.href = "../";
        return;
    }
    
    // Primero verificamos el token
    fetch("../../servidor/?o=compruebatoken&token=" + encodeURIComponent(token))
    .then(response => {
    if (!response.ok) {
        throw new Error('Error en la respuesta del servidor: ' + response.status);
    }
    return response.json(); // ✅ Esto ya convierte la respuesta en un objeto JSON
})
.then(data => { // 🔹 Ahora `data` ya es un objeto válido
    console.log("Respuesta de verificación de token:", data);
    if (data.resultado !== "ok") {
        console.log("Token inválido, redirigiendo...");
        window.location.href = "../";
        return Promise.reject("Token inválido");
    }
    return fetch("../../servidor/?o=listadoaplicacionesusuario&usuario=" + encodeURIComponent(usuario));
})

        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor: ' + response.status);
            }
            return response.text();
        })
        .then(rawText => {
            console.log("Respuesta cruda del servidor (aplicaciones):", rawText);
            if (!rawText.trim()) {
                throw new Error("El servidor devolvió una respuesta vacía.");
            }
            return JSON.parse(rawText);
        })
        .then(data => {
            console.log("Datos de aplicaciones:", data);
            const plantilla = document.getElementById('plantilla_aplicacion');
            if (!data || !data.length) {
                console.log("No hay aplicaciones disponibles");
                return;
            }
            if (!plantilla) {
                console.error("No se encontró la plantilla con ID 'plantilla_aplicacion'");
                return;
            }
            const main = document.querySelector('main');
            if (!main) {
                console.error("No se encontró el elemento 'main'");
                return;
            }
            data.forEach(function(elemento) {
                const instancia = plantilla.content.cloneNode(true);
                const nombre = instancia.querySelector('p');
                if (nombre) nombre.innerHTML = elemento.nombre;
                let icono = instancia.querySelector(".icono");
                if (icono && elemento.nombre) icono.textContent = elemento.nombre[0];
                main.appendChild(instancia);
            });
            let aplicaciones = document.querySelectorAll(".aplicacion");
            aplicaciones.forEach(function(aplicacion) {
                aplicacion.onclick = function() {
                    const nombreApp = this.querySelector("p").textContent;
                    localStorage.setItem('crimson_aplicacion', nombreApp);
                    window.location.href = "../supercontrolador/";
                }
            });
        })
        .catch(error => {
            console.error("Error completo:", error);
            alert("Error de conexión: " + error.message);
        });
    
    // Configurar el botón de cerrar sesión
    const btnCerrarSesion = document.querySelector("#cerrarsesion");
    if (btnCerrarSesion) {
        btnCerrarSesion.onclick = function() {
            localStorage.removeItem("crimson_usuario");
            localStorage.removeItem("crimson_token");
            localStorage.removeItem("crimson_aplicacion");
            window.location.href = "../";
        }
    }
}
