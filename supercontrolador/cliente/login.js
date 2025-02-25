function login() {
    console.log("Has pulsado el boton");
    let usuario = document.querySelector("#usuario").value.trim();
    let contrasena = document.querySelector("#contrasena").value.trim();
    
    // Resetear feedback
    document.querySelector("#feedback").textContent = "";
    
    if (!usuario || !contrasena) {
        mostrarError("Usuario y contraseña son obligatorios");
        return;
    }
    fetch("../servidor/anterior/loginusuario.php", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasena })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log("Respuesta del servidor:", data);
        
        if (data.resultado = true && data.usuarios?.length > 0) {
            manejarLoginExitoso(data.usuarios[0]);
        } else {
            mostrarError(data.mensaje || "Credenciales incorrectas");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        mostrarError("Error de conexión. Inténtalo de nuevo.");
    });
}

function manejarLoginExitoso(usuario) {
    localStorage.setItem('crimson_usuario', usuario.usuario);
    localStorage.setItem('crimson_token', usuario.token);
    
    document.querySelector("#feedback").style.color = "green";
    document.querySelector("#feedback").textContent = "Acceso correcto. Redirigiendo...";
    
    setTimeout(() => {
        window.location.href = "escritorio/index.html";
    }, 2000);
}

function mostrarError(mensaje) {
    document.querySelector("#feedback").style.color = "red";
    document.querySelector("#feedback").textContent = mensaje;
    
    // Crear toast dinámicamente si no existe
    let toast = document.querySelector("#toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.style.position = "fixed";
        toast.style.bottom = "20px";
        toast.style.right = "20px";
        toast.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
        toast.style.color = "white";
        toast.style.padding = "10px 20px";
        toast.style.borderRadius = "5px";
        toast.style.transform = "translateY(100px)";
        toast.style.transition = "transform 0.3s ease-in-out";
        toast.style.zIndex = "1000";
        document.body.appendChild(toast);
    }
    
    toast.textContent = mensaje;
    setTimeout(() => {
        toast.style.transform = "translateY(0)";
    }, 10);
    
    setTimeout(() => {
        toast.style.transform = "translateY(100px)";
    }, 5000);
}

// Inicialización de eventos
window.onload = function() {
    document.querySelector("#login").addEventListener("click", login);
    
    // Añadir evento Enter para los campos de formulario
    document.addEventListener("keypress", function(e) {
        if (e.code === "Enter") login();
    });
    
    // Asegurar que el campo de contraseña sea de tipo password
    const contrasenaInput = document.querySelector("#contrasena");
    if (contrasenaInput && contrasenaInput.type !== "password") {
        contrasenaInput.type = "password";
    }
};