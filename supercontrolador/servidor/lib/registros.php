<?php
    $servidor = "localhost";                                
    $usuario = "horti";                                    
    $contrasena = "horti";                                
    $basededatos = "crimson";                            
  
    $conexion = mysqli_connect(
            $servidor, 
            $usuario, 
            $contrasena, 
            $basededatos
        );	

    // Obtener el esquema de la tabla para saber exactamente qué columnas tiene
    $esquemaQuery = "DESCRIBE registros";
    $esquemaResult = mysqli_query($conexion, $esquemaQuery);
    
    if ($esquemaResult) {
       /* echo "<!-- Columnas de la tabla registros: ";
        while ($columna = mysqli_fetch_assoc($esquemaResult)) {
            echo $columna['Field'] . ", ";
        }
        echo " -->";*/
    }
            
    // Especifica las columnas explícitamente
    $query = "INSERT INTO registros (epoch, ip, navegador, url, comentarios) VALUES (
            '".$_SERVER['REQUEST_TIME']."',
            '".$_SERVER['REMOTE_ADDR']."',
            '".$_SERVER['HTTP_USER_AGENT']."',
            '".$_SERVER['REQUEST_URI']."',
            ''
        )";
            
    $result = mysqli_query($conexion, $query);
    
    // Verificar si hubo error y registrarlo
    if (!$result) {
        error_log("Error SQL en registros.php: " . mysqli_error($conexion));
    }
?>