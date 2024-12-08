window.onload = function(){
    console.log("Javascript cargado");

    // Asignación de evento de clic al botón de login
    document.querySelector("#login").onclick = function(){
        login();  // Llamamos a la función login cuando se hace clic
    }

    // Detección de tecla presionada, mejorado con e.key para un manejo más claro
    document.onkeypress = function(e){
        console.log("Has pulsado una tecla");
        
        // Verificamos si la tecla presionada es 'Enter'
        if(e.key === "Enter"){
            console.log("Y la tecla es Enter");
            login();  // Llamamos a login si es la tecla Enter
        }
    }
}

function login(){
    console.log("Has pulsado el boton");

    // Obtenemos los valores de usuario y contraseña desde los campos de entrada
    let usuario = document.querySelector("#usuario").value;
    let contrasena = document.querySelector("#contrasena").value;

    console.log(usuario, contrasena);  // Imprimimos para verificar los valores

    // Construimos el mensaje JSON con los datos del usuario
    let mensaje = {"usuario": usuario, "contrasena": contrasena};

    // Hacemos la petición al servidor con fetch
    fetch("../servidor/?o=buscar&tabla=usuarios", {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify(mensaje),  // Enviamos el mensaje JSON al servidor
    })
    .then(response => {
        // Verificamos si la respuesta es exitosa (status 200)
        if (!response.ok) {
            throw new Error('Error en la comunicación con el servidor');
        }
        return response.json();  // Si todo está bien, tratamos la respuesta como JSON
    })
    .then(data => {
        console.log(data);  // Mostramos el JSON devuelto por el servidor

        // Verificamos si el login fue exitoso (longitud de la respuesta)
        if(data.length > 0){  
            console.log("Entras correctamente");

            // Guardamos en localStorage el usuario para futuras sesiones
            localStorage.setItem('crimson_usuario', data[0].usuario);

            // Modificamos el mensaje de retroalimentación
            document.querySelector("#feedback").style.color = "green";  
            document.querySelector("#feedback").innerHTML = "Acceso correcto. Redirigiendo en 5 segundos...";  

            // Redirigimos al escritorio después de 5 segundos
            setTimeout(function(){
                window.location = "escritorio/index.html";
            }, 5000);
        } else {
            console.log("Error al entrar");

            // Mostramos un mensaje de error
            document.querySelector("#feedback").style.color = "red";
            document.querySelector("#feedback").innerHTML = "Usuario incorrecto. Redirigiendo en 5 segundos...";  

            // Redirigimos al mismo sitio después de 5 segundos
            setTimeout(function(){
                window.location = window.location;
            }, 5000);
        }
    })
    .catch(error => {
        // Manejo de errores de red o de servidor
        console.error('Hubo un problema con la petición fetch:', error);
        document.querySelector("#feedback").style.color = "red";
        document.querySelector("#feedback").innerHTML = "Hubo un problema con la conexión. Inténtalo más tarde.";
    });
}
