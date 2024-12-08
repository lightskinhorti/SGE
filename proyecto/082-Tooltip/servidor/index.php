<?php

	ini_set('display_errors', 1);  // Activo la visualización de errores en el navegador
	ini_set('display_startup_errors', 1);  // Activo los errores de inicio de PHP
	error_reporting(E_ALL);  // Establezco el nivel de reporte de errores a todos los errores posibles

	include "ConexionDB.php";  // Incluyo el archivo que contiene la clase de conexión a la base de datos

	$conexion = new conexionDB();  // Creo una nueva instancia de la clase conexionDB para gestionar las conexiones

	// Verifico si se ha recibido un parámetro 'o' en la URL
	if (isset($_GET['o'])) {
		switch ($_GET['o']) {  // Dependiendo del valor del parámetro 'o', ejecuto un caso u otro
			case "listatablas":
				// Si 'o' es "listatablas", llamo al método listadoTablas() y muestro el resultado
				echo $conexion->listadoTablas();
				break;
			case "tabla":
				// Si 'o' es "tabla", llamo al método seleccionaTabla() pasando el parámetro 'tabla' recibido por GET
				echo $conexion->seleccionaTabla($_GET['tabla']);
				break;
			case "columnastabla":
				// Si 'o' es "columnastabla", llamo al método columnasTabla() pasando el parámetro 'tabla' recibido por GET
				echo $conexion->columnasTabla($_GET['tabla']);
				break;
			case "eliminar":
				// Si 'o' es "eliminar", llamo al método eliminaTabla() pasando los parámetros 'tabla' y 'id' recibidos por GET
				echo $conexion->eliminaTabla($_GET['tabla'], $_GET['id']);
				break;
			case "buscar":
				// Si 'o' es "buscar", recibo los datos JSON enviados en la petición del cliente
				$json = file_get_contents('php://input');  // Obtengo el JSON enviado en la solicitud
        		$datos = json_decode($json, true);  // Decodifico el JSON para convertirlo en un array de PHP
				// Llamo al método buscar() pasando la tabla y los datos recibidos y muestro el resultado
				echo $conexion->buscar($_GET['tabla'], $datos);
				break;
			case "actualizar":
				// Si 'o' es "actualizar", recibo los datos JSON enviados en la petición del cliente
				$json = file_get_contents('php://input');  // Obtengo el JSON enviado en la solicitud
        		$datos = json_decode($json, true);  // Decodifico el JSON para convertirlo en un array de PHP
				// Llamo al método actualizar() con los datos recibidos y muestro el resultado
				echo $conexion->actualizar($datos);
				break;
			case "buscarSimilar":
				// Si 'o' es "buscarSimilar", recibo los datos JSON enviados en la petición del cliente
				$json = file_get_contents('php://input');  // Obtengo el JSON enviado en la solicitud
        		$datos = json_decode($json, true);  // Decodifico el JSON para convertirlo en un array de PHP
				// Llamo al método buscarSimilar() pasando la tabla y los datos recibidos y muestro el resultado
				echo $conexion->buscarSimilar($_GET['tabla'], $datos);
				break;
			case "insertar":
				// Si 'o' es "insertar", recibo los datos JSON enviados en la petición del cliente
				$json = file_get_contents('php://input');  // Obtengo el JSON enviado en la solicitud
				var_dump($json);  // Muestra el JSON recibido (útil para depuración)
				$datos = json_decode($json, true);  // Decodifico el JSON para convertirlo en un array de PHP
				var_dump($datos);  // Muestra los datos decodificados (útil para depuración)
				// Llamo al método insertaTabla() pasando la tabla y los datos recibidos y muestro el resultado
				echo $conexion->insertaTabla($_GET['tabla'], $datos);
				break;
		}
	}
	
?>
