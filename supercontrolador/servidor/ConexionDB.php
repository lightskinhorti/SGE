<?php
	
	class conexionDB{																													// Creo una nueva clase
		
			private $servidor;																										// creo una serie de propiedades privadas
			private $usuario;																											// 
			private $contrasena;																									// 
			private $basededatos;																									// 
			private $conexion;																										// 
			
			public function __construct() {																				// Creo un constructor
				  $this->servidor = "localhost";																			// Le doy los datos de acceso a la base de datos
				  $this->usuario = "crimson";																		// 
				  $this->contrasena = "crimson";																	// 
				  $this->basededatos = "crimson";																// 
				  
				  $this->conexion = mysqli_connect(
							$this->servidor, 
							$this->usuario, 
							$this->contrasena, 
							$this->basededatos
						);																															// Establezco una conexión con la base de datos
			 }
			public function buscar($tabla,$datos){
				$peticion = "SELECT * FROM ".$tabla." WHERE ";
				foreach($datos as $clave=>$valor){
					$peticion .= $clave."='".$valor."' AND "; 
				}
				$peticion .= " 1;";
				//echo $peticion;
				
				
				$resultado = mysqli_query($this->conexion , $peticion);
				$retorno = [];
				while ($fila = mysqli_fetch_assoc($resultado)) {										// Recupero los datos del servidor
					$fila['token'] = base64_encode(date('U'));
					//$fila['token'] = rand();
					$retorno[] = $fila;																			// Hago un push encubierto a las restricciones
					
				}
				
				
				$json = json_encode($retorno, JSON_PRETTY_PRINT);							// Lo codifico como json
				return $json;	
			}
			
			public function buscarSimilar($tabla,$datos){
				$peticion = "SELECT * FROM ".$tabla." WHERE ";
				foreach($datos as $clave=>$valor){
					$peticion .= $clave." LIKE '%".$valor."%' AND "; 
				}
				$peticion .= " 1;";
				//echo $peticion;
				
				
				$resultado = mysqli_query($this->conexion , $peticion);
				$retorno = [];
				while ($fila = mysqli_fetch_assoc($resultado)) {										// Recupero los datos del servidor
					$retorno[] = $fila;																			// Hago un push encubierto a las restricciones
				}
				$json = json_encode($retorno, JSON_PRETTY_PRINT);							// Lo codifico como json
				return $json;	
			}
			
			public function seleccionaTabla($tabla){													// Creo un metodo de seleccion
				$query = "SELECT 
											*
									FROM 
											information_schema.key_column_usage
									WHERE 
											table_name = '".$tabla."'
											AND
											REFERENCED_TABLE_NAME IS NOT NULL
											;";											// Formateo una consulta SQL para ver qué campos tienen restricciones
				
				$result = mysqli_query($this->conexion , $query);								// Ejecuto la consulta contra la base de datos	
				$restricciones = [];																						// Creo un array vacio para guardar las restricciones
				while ($row = mysqli_fetch_assoc($result)) {										// Recupero los datos del servidor
					$restricciones[] = $row;																			// Hago un push encubierto a las restricciones
				}
				
				//var_dump($restricciones);																				// Las debugeo en pantalla
				
				$query = "SELECT * FROM ".$tabla.";";														// Creo la petición dinámica
				$result = mysqli_query($this->conexion , $query);								// Ejecuto la peticion
				$resultado = [];																								// Creo un array vacio
				while ($row = mysqli_fetch_assoc($result)) {										// PAra cada uno de los registros
						
						//$resultado[] = $row;																			// Los añado al array
						$fila = [];																									// Creo el conjunto de datos para cada fila
						foreach($row as $clave=>$valor){														// PAra cada una de las columnas
							$identificador = 1;
							$pasas = true;																						// En principio asumimos que no hay restriccion
							foreach($restricciones as $restriccion){									// Para cada una de las restricciones
								if($clave == "Identificador"){
									$identificador = $valor;
								}
								if($clave == $restriccion["COLUMN_NAME"]){							// En el caso de que se detecte que esta columna forma parte de las restricciones
									
									$query2 = "
										SELECT * 
										FROM ".$restriccion["REFERENCED_TABLE_NAME"]."
										WHERE Identificador = ".$identificador."
									;";
									$result2 = mysqli_query($this->conexion , $query2);
									$cadena = "";
									while ($row2 = mysqli_fetch_assoc($result2)) {
										foreach($row2 as $campo){
											$cadena .= $campo."-";
										}
									}
									
									$fila[$clave] = $cadena;															// En la celda devolvemos un string tontorron
									$pasas = false;																				// Cambiamos el estado de la variable a falso
								}
							}
						if($pasas == true){																					// en el caso de que la variable siga siendo verdadera
							$fila[$clave] = $valor;																		// En ese caso el valor de la variable es el valor real de la tabla
						}
						}
						$resultado[] = $fila;		
				}
				$json = json_encode($resultado, JSON_PRETTY_PRINT);							// Lo codifico como json
				return $json;																										// Devuelvo el json
			}
			
			public function listadoTablas(){
				$query = "
					SELECT 
							table_name AS 'Tables_in_".$this->basededatos."', 
							table_comment AS 'Comentario'
					FROM 
							information_schema.tables
					WHERE 
							table_schema = '".$this->basededatos."';
				";																				// Creo la petición dinámica
				//echo $query; 
				$result = mysqli_query($this->conexion , $query);								// Ejecuto la peticion
				$resultado = [];																								// Creo un array vacio
				while ($row = mysqli_fetch_assoc($result)) {										// PAra cada uno de los registros
						//$resultado[] = $row;																			// Los añado al array
						$fila = [];
						foreach($row as $clave=>$valor){
							$fila[$clave] = $valor;
						}
						$resultado[] = $fila;
				}
				$json = json_encode($resultado, JSON_PRETTY_PRINT);							// Lo codifico como json
				return $json;																										// Devuelvo el json
			}
			
			public function listadoTablasAplicacion($aplicacion){
				$query = "
				
				SELECT 
					 ist.table_name AS 'Tables_in_".$this->basededatos."',
					 ist.table_comment AS 'Comentario',
					 ta.tabla AS 'Tabla_de_Aplicación'
				FROM 
					 information_schema.tables AS ist
				LEFT JOIN 
					 tablasaplicaciones AS ta
				ON 
					 ist.table_name = ta.tabla
				LEFT JOIN 
					 aplicaciones AS ap
				ON 
					 ta.aplicaciones_nombre = ap.Identificador
				WHERE 
					 ist.table_schema = '".$this->basededatos."'
					 AND ap.nombre = '".$aplicacion."';
				";																				// Creo la petición dinámica
				//echo $query;
				$result = mysqli_query($this->conexion , $query);								// Ejecuto la peticion
				$resultado = [];																								// Creo un array vacio
				while ($row = mysqli_fetch_assoc($result)) {										// PAra cada uno de los registros
						//$resultado[] = $row;																			// Los añado al array
						$fila = [];
						foreach($row as $clave=>$valor){
							$fila[$clave] = $valor;
						}
						$resultado[] = $fila;
				}
				$json = json_encode($resultado, JSON_PRETTY_PRINT);							// Lo codifico como json
				return $json;																										// Devuelvo el json
			}
			
			public function listadoAplicacionesUsuario($usuario){
				$query = "
				
				SELECT 
        aplicaciones.nombre
    FROM usuarios2
    LEFT JOIN departamentos 
        ON usuarios2.departamento_id = departamentos.Identificador
    LEFT JOIN departamentosaplicaciones 
        ON departamentosaplicaciones.departamentos_nombre = departamentos.Identificador
    LEFT JOIN aplicaciones 
        ON departamentosaplicaciones.aplicaciones_nombre = aplicaciones.Identificador
    WHERE usuarios2.usuario = '".$usuario."'
";																				// Creo la petición dinámica
				//echo $query;
				$result = mysqli_query($this->conexion , $query);								// Ejecuto la peticion
				$resultado = [];																								// Creo un array vacio
				while ($row = mysqli_fetch_assoc($result)) {										// PAra cada uno de los registros
						//$resultado[] = $row;																			// Los añado al array
						$fila = [];
						foreach($row as $clave=>$valor){
							$fila[$clave] = $valor;
						}
						$resultado[] = $fila;
				}
				$json = json_encode($resultado, JSON_PRETTY_PRINT);							// Lo codifico como json
				return $json;																										// Devuelvo el json
			}
			
			public function columnasTabla($tabla){
				$query = "SHOW COLUMNS FROM ".$tabla.";";																				// Creo la petición dinámica
				$result = mysqli_query($this->conexion , $query);								// Ejecuto la peticion
				$resultado = [];																								// Creo un array vacio
				while ($row = mysqli_fetch_assoc($result)) {										// PAra cada uno de los registros
						//$resultado[] = $row;																			// Los añado al array
						$fila = [];
						foreach($row as $clave=>$valor){
							$fila[$clave] = $valor;
						}
						$resultado[] = $fila;
				}
				$json = json_encode($resultado, JSON_PRETTY_PRINT);							// Lo codifico como json
				return $json;																										// Devuelvo el json
			}
			
			public function obtenRegistro($tabla,$id){
				$query = "SELECT * FROM ".$tabla." WHERE Identificador = ".$id.";";																				// Creo la petición dinámica
				$result = mysqli_query($this->conexion , $query);								// Ejecuto la peticion
				$resultado = [];																								// Creo un array vacio
				while ($row = mysqli_fetch_assoc($result)) {										// PAra cada uno de los registros
						//$resultado[] = $row;																			// Los añado al array
						$fila = [];
						foreach($row as $clave=>$valor){
							$fila[$clave] = $valor;
						}
						$resultado[] = $fila;
				}
				$json = json_encode($resultado, JSON_PRETTY_PRINT);							// Lo codifico como json
				return $json;																										// Devuelvo el json
			}
			

			public function insertaTabla($tabla, $valores) {
				// Verificar si hay datos
				if (empty($valores)) {
					echo $valores;
					echo "Error: No se recibieron valores para insertar.";
					return;
				}
			
				$campos = "";
				$parametros = "";
				$tipos = "";
				$datos = [];
			
				foreach ($valores as $clave => $valor) {
					// Validación de valores
					if (is_array($valor) && !isset($_FILES[$clave])) {
						echo "Error: El valor de '$clave' es un array y no se puede convertir a string.";
						continue;
					}
					
					$campos .= "`" . $clave . "`,"; // Añadir backticks para proteger nombres de columnas
					$parametros .= "?,";
			
					// Verificar si es un archivo
					if (isset($_FILES[$clave]) && $_FILES[$clave]['error'] === UPLOAD_ERR_OK) {
						$tipos .= "b"; // blob
						$datos[] = file_get_contents($_FILES[$clave]['tmp_name']);
					} else {
						$tipos .= "s"; // string por defecto
						$datos[] = $valor;
					}
				}
			
				// Validación para asegurarse de que hay tipos y datos antes de continuar
				if (empty($tipos) || empty($datos)) {
					echo "Error: No se recibieron datos válidos para insertar.";
					return;
				}
			
				// Eliminar la última coma
				$campos = rtrim($campos, ",");
				$parametros = rtrim($parametros, ",");
			
				// Depuración
				error_log("Campos: " . $campos);
				error_log("Parámetros: " . $parametros);
				error_log("Tipos: " . $tipos);
				error_log("Datos: " . print_r($datos, true));
			
				$query = "INSERT INTO `$tabla` ($campos) VALUES ($parametros)";
				
				// Depuración de la consulta
				error_log("SQL Query: " . $query);
				
				$stmt = $this->conexion->prepare($query);
			
				if ($stmt === false) {
					$error = "Error en la preparación de la consulta: " . $this->conexion->error;
					error_log($error);
					echo $error;
					return;
				}
			
				// Bind parameters dinámicamente
				if (!empty($datos)) {
					$stmt->bind_param($tipos, ...$datos);
					
					// Manejar datos binarios largos si es necesario
					foreach ($datos as $index => $dato) {
						if ($tipos[$index] === "b") {
							$stmt->send_long_data($index, $dato);
						}
					}
				}
			
				// Ejecutar la consulta
				if ($stmt->execute()) {
					echo "Inserción exitosa en la tabla $tabla.";
				} else {
					$error = "Error al insertar en la tabla $tabla: " . $stmt->error;
					error_log($error);
					echo $error;
				}
			
				$stmt->close();
			}
			
			public function actualizaTabla($tabla,$valores,$id){
					$query = "
						UPDATE ".$tabla." 
						SET
						";																													// Empiezo a formatear la query de actualización
					foreach($valores as $clave=>$valor){													// Para cada uno de los datos
						$query .= $clave."='".$valor."', ";													// Encadeno con la query
					}
					$query = substr($query, 0, -2);																// Le quito los dos ultimos caracteres
						$query .= "
						WHERE Identificador = ".$id."
						";																													// preparo la petición de inserción
					echo $query;
					$result = mysqli_query($this->conexion , $query);							// Ejecuto la peticion
					return "";							
			}
			public function actualizar($datos){														// Método de actualizar un solo campo en la tabla
					
					$query = "
						UPDATE ".$datos['tabla']." 
						SET ".$datos['columna']." = '".$datos['valor']."'
						
						WHERE Identificador = ".$datos['Identificador']."
						";																													// preparo la petición de inserción
					//echo $query;
					$result = mysqli_query($this->conexion , $query);							// Ejecuto la peticion
					return '{"mensaje":"ok"}';							
			}
			public function eliminaTabla($tabla,$id){
				$query = "
						DELETE FROM ".$tabla." 
						WHERE Identificador = ".$id.";
						";	
				$result = mysqli_query($this->conexion , $query);							// Ejecuto la peticion
			}
			
			private function codifica($entrada){
				return base64_encode($entrada);
			}
			
			private function decodifica($entrada){
				return base64_decode($entrada);
			}
			/**
 * Cuenta el número de filas en cada tabla de la base de datos
 * @return string JSON con los datos de cada tabla y su número de registros
 */
public function contarFilasTablas() {
    // Obtener la lista de tablas en la base de datos
    $query = "
        SELECT 
            table_name 
        FROM 
            information_schema.tables
        WHERE 
            table_schema = '".$this->basededatos."'
        AND
            table_type = 'BASE TABLE'; 
    ";

    $result = mysqli_query($this->conexion, $query);
    if (!$result) {
        throw new Exception("Error al recuperar las tablas: " . mysqli_error($this->conexion));
    }

    $datos = [];

    // Recorrer cada tabla y contar sus filas
    while ($row = mysqli_fetch_assoc($result)) {
		
        $tabla = $row['table_name'];
        
        // Evitar las tablas de sistema o de control interno si es necesario
        if (strpos($tabla, '_') === 0 || strpos($tabla, 'sys_') === 0) {
            continue;
        }
        
        try {
            $queryCount = "SELECT COUNT(*) AS total FROM `$tabla`;";
            $resultCount = mysqli_query($this->conexion, $queryCount);

            if (!$resultCount) {
                error_log("Error al contar filas en la tabla $tabla: " . mysqli_error($this->conexion));
                continue; // Continuar con la siguiente tabla
            }

            $count = mysqli_fetch_assoc($resultCount)['total'];
            
            // Solo incluir tablas con registros
            if ($count > 0) {
                $datos[] = ["texto" => $tabla, "valor" => (int)$count];
            }
        } catch (Exception $e) {
            error_log("Excepción al contar filas en $tabla: " . $e->getMessage());
            continue; // Continuar con la siguiente tabla
        }
    }
    
    // Ordenar los datos por número de registros (de mayor a menor)
    usort($datos, function($a, $b) {
        return $b['valor'] - $a['valor'];
    });
    
    // Codificar el resultado como JSON
    return json_encode($datos, JSON_PRETTY_PRINT);
}

	}

?>
