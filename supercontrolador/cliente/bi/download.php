<?php
// Verifica si la solicitud es de tipo POST y si se ha enviado el parámetro 'table'
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['table'])) {
    // Decodifica el contenido de la tabla que se recibió en formato base64
    $tableHTML = base64_decode($_POST['table']);

    // Configura las cabeceras para forzar la descarga del archivo HTML
    header('Content-Type: text/html'); // Indica que el contenido es HTML
    header('Content-Disposition: attachment; filename="table.html"'); // Especifica el nombre del archivo de descarga

    // Genera la estructura de un documento HTML con el contenido de la tabla
    echo "<!DOCTYPE html>";
    echo "<html>";
    echo "<head><title>Downloaded Table</title></head>"; // Título del documento
    echo "<body>";
    echo $tableHTML; // Inserta el contenido de la tabla dentro del cuerpo del HTML
    echo "</body>";
    echo "</html>";

    // Finaliza la ejecución del script para evitar cualquier salida adicional
    exit;
}
?>
