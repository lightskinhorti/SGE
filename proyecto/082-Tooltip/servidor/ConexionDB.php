<?php

class conexionDB {
    // Propiedades privadas para almacenar las credenciales y la conexión con la base de datos
    private $servidor;
    private $usuario;
    private $contrasena;
    private $basededatos;
    private $conexion;

    // Constructor que establece la conexión a la base de datos
    public function __construct() {
        $this->servidor = "localhost";
        $this->usuario = "crimson";
        $this->contrasena = "crimson";
        $this->basededatos = "crimson";
        
        // Establecer la conexión con la base de datos
        $this->conexion = mysqli_connect(
            $this->servidor,
            $this->usuario,
            $this->contrasena,
            $this->basededatos
        );

        // Verificar si la conexión fue exitosa
        if (!$this->conexion) {
            die("Error de conexión: " . mysqli_connect_error());
        }
    }

    // Método para buscar registros en una tabla con condiciones específicas
    public function buscar($tabla, $datos) {
        $peticion = "SELECT * FROM " . $tabla . " WHERE ";
        foreach ($datos as $clave => $valor) {
            $peticion .= $clave . "='" . $valor . "' AND ";
        }
        $peticion .= " 1;"; // Agregar condición de '1' al final para evitar errores

        $resultado = mysqli_query($this->conexion, $peticion);
        $retorno = [];

        // Recuperar los datos y almacenarlos en un array
        while ($fila = mysqli_fetch_assoc($resultado)) {
            $retorno[] = $fila;
        }

        // Devolver los datos en formato JSON
        return json_encode($retorno, JSON_PRETTY_PRINT);
    }

    // Método para buscar registros similares en una tabla
    public function buscarSimilar($tabla, $datos) {
        $peticion = "SELECT * FROM " . $tabla . " WHERE ";
        foreach ($datos as $clave => $valor) {
            $peticion .= $clave . " LIKE '%" . $valor . "%' AND ";
        }
        $peticion .= " 1;"; // Agregar condición de '1' al final para evitar errores

        $resultado = mysqli_query($this->conexion, $peticion);
        $retorno = [];

        // Recuperar los datos y almacenarlos en un array
        while ($fila = mysqli_fetch_assoc($resultado)) {
            $retorno[] = $fila;
        }

        // Devolver los datos en formato JSON
        return json_encode($retorno, JSON_PRETTY_PRINT);
    }

    // Método para seleccionar una tabla y obtener sus restricciones y registros
    public function seleccionaTabla($tabla) {
        $query = "
            SELECT * FROM information_schema.key_column_usage
            WHERE table_name = '" . $tabla . "'
            AND REFERENCED_TABLE_NAME IS NOT NULL;
        "; // Obtener las restricciones de la tabla

        $result = mysqli_query($this->conexion, $query);
        $restricciones = [];

        // Recuperar las restricciones
        while ($row = mysqli_fetch_assoc($result)) {
            $restricciones[] = $row;
        }

        // Obtener todos los registros de la tabla
        $query = "SELECT * FROM " . $tabla . ";";
        $result = mysqli_query($this->conexion, $query);
        $resultado = [];

        // Procesar cada fila y gestionar las restricciones
        while ($row = mysqli_fetch_assoc($result)) {
            $fila = [];
            foreach ($row as $clave => $valor) {
                $identificador = 1;
                $pasas = true;
                
                // Comprobar si la columna tiene alguna restricción
                foreach ($restricciones as $restriccion) {
                    if ($clave == "Identificador") {
                        $identificador = $valor;
                    }
                    if ($clave == $restriccion["COLUMN_NAME"]) {
                        $query2 = "
                            SELECT * FROM " . $restriccion["REFERENCED_TABLE_NAME"] . "
                            WHERE Identificador = " . $identificador . ";
                        ";
                        $result2 = mysqli_query($this->conexion, $query2);
                        $cadena = "";
                        while ($row2 = mysqli_fetch_assoc($result2)) {
                            foreach ($row2 as $campo) {
                                $cadena .= $campo . "-";
                            }
                        }
                        $fila[$clave] = $cadena;
                        $pasas = false; // Ya no pasa el valor original
                    }
                }

                // Si no hay restricciones, se mantiene el valor original
                if ($pasas) {
                    $fila[$clave] = $valor;
                }
            }
            $resultado[] = $fila;
        }

        // Devolver los resultados en formato JSON
        return json_encode($resultado, JSON_PRETTY_PRINT);
    }

    // Método para listar todas las tablas en la base de datos
    public function listadoTablas() {
        $query = "
            SELECT table_name AS 'Tables_in_" . $this->basededatos . "',
                   table_comment AS 'Comentario'
            FROM information_schema.tables
            WHERE table_schema = '" . $this->basededatos . "';
        ";

        $result = mysqli_query($this->conexion, $query);
        $resultado = [];

        // Recuperar y almacenar la información de las tablas
        while ($row = mysqli_fetch_assoc($result)) {
            $resultado[] = $row;
        }

        // Devolver la lista de tablas en formato JSON
        return json_encode($resultado, JSON_PRETTY_PRINT);
    }

    // Método para obtener las columnas de una tabla
    public function columnasTabla($tabla) {
        $query = "SHOW COLUMNS FROM " . $tabla . ";";
        $result = mysqli_query($this->conexion, $query);
        $resultado = [];

        // Recuperar y almacenar las columnas
        while ($row = mysqli_fetch_assoc($result)) {
            $resultado[] = $row;
        }

        // Devolver las columnas en formato JSON
        return json_encode($resultado, JSON_PRETTY_PRINT);
    }

    // Método para insertar datos en una tabla
    public function insertaTabla($tabla, $valores) {
        $campos = "";
        $parametros = "";
        $tipos = "";
        $datos = [];

        // Preparar los valores de la consulta
        foreach ($valores as $clave => $valor) {
            if (is_array($valor)) {
                echo "Error: El valor de '$clave' es un array y no se puede convertir a string.";
                return;
            }

            $campos .= $clave . ",";
            $parametros .= "?,";

            // Verificar si el campo es un archivo
            if (isset($_FILES[$clave])) {
                $tipos .= "b";
                $datos[] = file_get_contents($_FILES[$clave]['tmp_name']);
            } else {
                $tipos .= "s";
                $datos[] = $valor;
            }
        }

        // Eliminar las comas finales
        $campos = rtrim($campos, ",");
        $parametros = rtrim($parametros, ",");

        // Preparar la consulta de inserción
        $query = "INSERT INTO $tabla ($campos) VALUES ($parametros)";
        $stmt = $this->conexion->prepare($query);

        // Verificar si la preparación de la consulta fue exitosa
        if ($stmt === false) {
            die("Error en la preparación de la consulta: " . $this->conexion->error);
        }

        // Vincular los parámetros y ejecutar la consulta
        $stmt->bind_param($tipos, ...$datos);
        foreach ($datos as $index => $dato) {
            if ($tipos[$index] === "b") {
                $stmt->send_long_data($index, $dato);
            }
        }

        if ($stmt->execute()) {
            echo "Inserción exitosa en la tabla $tabla.";
        } else {
            echo "Error al insertar en la tabla $tabla: " . $stmt->error;
        }

        // Cerrar la declaración
        $stmt->close();
    }

    // Método para actualizar un campo en la tabla
    public function actualizar($datos) {
        $query = "
            UPDATE " . $datos['tabla'] . " 
            SET " . $datos['columna'] . " = '" . $datos['valor'] . "'
            WHERE Identificador = " . $datos['Identificador'] . ";
        ";

        $result = mysqli_query($this->conexion, $query);
        return '{"mensaje":"ok"}';
    }

    // Método para eliminar un registro de la tabla
    public function eliminaTabla($tabla, $id) {
        $query = "
            DELETE FROM " . $tabla . " 
            WHERE Identificador = " . $id . ";
        ";
        $result = mysqli_query($this->conexion, $query);
    }

    // Métodos privados para codificar y decodificar datos (no se usan en el código actual)
    private function codifica($entrada) {
        return base64_encode($entrada);
    }

    private function decodifica($entrada) {
        return base64_decode($entrada);
    }
}

?>
