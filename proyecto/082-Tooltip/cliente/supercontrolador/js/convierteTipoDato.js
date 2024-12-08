function convierteTipoDato(tipo) {
    let tipodevuelto;  // Variable para almacenar el tipo de dato devuelto

    // Comprobamos los distintos tipos de dato y los mapeamos a tipos de entrada HTML
    if (tipo.includes("varchar")) {
        tipodevuelto = "text";  // Texto
    } else if (tipo.includes("int")) {
        tipodevuelto = "number";  // Número entero
    } else if (tipo.includes("date")) {
        tipodevuelto = "date";  // Fecha
    } else if (tipo.includes("decimal")) {
        tipodevuelto = "number";  // Número decimal
    } else if (tipo.includes("time")) {
        tipodevuelto = "time";  // Hora
    } else if (tipo.includes("blob")) {
        tipodevuelto = "file";  // Archivo
    } else {
        tipodevuelto = "text";  // Valor predeterminado en caso de que el tipo no coincida
    }

    return tipodevuelto;  // Retornamos el tipo convertido
}
