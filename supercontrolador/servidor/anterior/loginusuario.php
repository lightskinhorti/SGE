<?php
// Capturar el JSON enviado
$inputJSON = file_get_contents("php://input");

// Decodificar el JSON a un array asociativo
$data = json_decode($inputJSON, true);

// Verificar si los datos existen
if (!isset($data['usuario']) || !isset($data['contrasena'])) {
    echo json_encode(["resultado" => "ko", "mensaje" => "Faltan datos"]);
    exit;
}

$usuario = $data['usuario'];
$contrasena = $data['contrasena'];

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT); // Establezco el nivel de retorno de errores de PHP
$mysqli = mysqli_connect("localhost", "horti", "horti", "crimson"); // Conectar a la base de datos

// Evitar SQL Injection con consultas preparadas
$query = "SELECT usuario FROM usuarios2 WHERE usuario = ? AND contrasena = ?";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("ss", $usuario, $contrasena);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) { // Si el usuario existe
    // Generar un token simple (en producción deberías usar algo más seguro)
    $token = md5($usuario . time());
    
    // Formato de respuesta esperado por login.js
    $response = [
        "resultado" => "ok",
        "usuarios" => [
            [
                "usuario" => $row["usuario"],
                "token" => $token
            ]
        ]
    ];
    echo json_encode($response);
} else { // Si el usuario no existe
    echo json_encode(["resultado" => "ko", "mensaje" => "Usuario o contraseña incorrectos"]);
}

$stmt->close();
$mysqli->close();
?>