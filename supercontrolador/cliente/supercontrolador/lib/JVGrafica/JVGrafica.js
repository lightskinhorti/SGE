// Definición de la clase JVGrafica mejorada
class JVGrafica {
    constructor(datos, color, selector, titulo = "") {
        // Constructor: inicializa la información necesaria para los gráficos
        this.datos = datos; // Datos de los sectores del gráfico
        this.color = color; // Color base (no utilizado directamente, pero conservado por diseño)
        this.selector = selector; // Selector donde se inserta el gráfico en el DOM
        this.titulo = titulo; // Título del gráfico
    }

    tarta() {
        // Método para dibujar un gráfico de pastel
        let anchura = 512; // Ancho del lienzo
        let altura = 512; // Alto del lienzo
        let lienzo = document.createElement("canvas"); // Crear un elemento canvas
        lienzo.width = anchura; // Configurar el ancho del lienzo
        lienzo.height = altura; // Configurar el alto del lienzo
        lienzo.style.border = "1px solid grey"; // Borde para visualizar el área del canvas
        
        // Verificar que la imagen existe antes de usarla como fondo
        let imgTest = new Image();
        imgTest.onload = () => {
            lienzo.style.background = "url('download.jpg') no-repeat center center";
            lienzo.style.backgroundSize = "cover";
        };
        imgTest.onerror = () => {
            console.log("La imagen de fondo no se pudo cargar, usando un color sólido");
            lienzo.style.background = "#f5f5f5";
        };
        imgTest.src = 'download.jpg';
        
        let contexto = lienzo.getContext("2d"); // Contexto de dibujo en 2D
        let alturaletra = 15; // Espaciado de texto en los sectores

        // Limpiar el contenedor antes de añadir el nuevo gráfico
        const container = document.querySelector(this.selector);
        if (!container) {
            console.error(`El selector "${this.selector}" no existe en el DOM`);
            return;
        }
        
        // Limpiar el contenedor antes de añadir el nuevo gráfico
        container.innerHTML = '';
        container.appendChild(lienzo); // Insertar el lienzo en el contenedor

        // Añadir título si existe
        if (this.titulo) {
            let tituloElement = document.createElement("h3");
            tituloElement.textContent = this.titulo;
            container.insertBefore(tituloElement, lienzo);
        }

        // Verificar si hay datos para mostrar
        if (!this.datos || this.datos.length === 0) {
            contexto.fillStyle = "#333";
            contexto.textAlign = "center";
            contexto.font = "20px Arial";
            contexto.fillText("No hay datos disponibles", anchura/2, altura/2);
            return;
        }

        let total = 0; // Calcular el total de los valores de los datos
        this.datos.forEach(function(dato) { 
            total += dato.valor; // Sumar todos los valores
        });

        let anguloinicial = 0; // Ángulo inicial para el primer sector

        // Iterar sobre los datos para dibujar cada sector del gráfico
        this.datos.forEach(function(dato) {
            // Generar colores más vivos y variados en lugar de solo grises
            let r = Math.floor(100 + Math.random() * 155);
            let g = Math.floor(100 + Math.random() * 155);
            let b = Math.floor(100 + Math.random() * 155);
            let color = `rgb(${r}, ${g}, ${b})`;

            let angulofinal = (dato.valor / total) * Math.PI * 2; // Calcular el ángulo final del sector

            // Dibujar el sector
            contexto.fillStyle = color; // Establecer el color de relleno
            contexto.beginPath(); // Iniciar un nuevo camino
            contexto.moveTo(anchura / 2, altura / 2); // Moverse al centro del lienzo
            contexto.arc(
                anchura / 2,
                altura / 2,
                anchura / 2 - 50, // Radio del círculo
                anguloinicial, // Ángulo inicial
                anguloinicial + angulofinal // Ángulo final
            );
            contexto.lineTo(anchura / 2, altura / 2); // Cerrar el sector hacia el centro
            contexto.fill(); // Rellenar el sector

            // Agregar un borde a cada sector para mayor claridad
            contexto.strokeStyle = "#fff";
            contexto.lineWidth = 2;
            contexto.stroke();

            // Calcular el ángulo medio para colocar el texto
            let angulotexto = anguloinicial + angulofinal / 2; 
            contexto.textAlign = "center"; // Alinear el texto al centro
            contexto.fillStyle = "white"; // Texto de color blanco
            contexto.font = "bold 14px Arial";
            
            // Calcular posición para el texto
            let distanciaTexto = (anchura / 2 - 50) * 0.7; // 70% del radio
            
            contexto.fillText(
                dato.texto, // Etiqueta del sector
                anchura / 2 + Math.cos(angulotexto) * distanciaTexto,
                altura / 2 + Math.sin(angulotexto) * distanciaTexto - alturaletra
            );

            // Mostrar el valor numérico en el sector
            contexto.fillText(
                dato.valor,
                anchura / 2 + Math.cos(angulotexto) * distanciaTexto,
                altura / 2 + Math.sin(angulotexto) * distanciaTexto
            );

            // Mostrar el porcentaje del sector
            let porcentaje = ((dato.valor / total) * 100).toFixed(1);
            contexto.fillText(
                porcentaje + "%",
                anchura / 2 + Math.cos(angulotexto) * distanciaTexto,
                altura / 2 + Math.sin(angulotexto) * distanciaTexto + alturaletra
            );

            anguloinicial += angulofinal; // Actualizar el ángulo inicial para el siguiente sector
        });
        
        // Añadir leyenda
        this.crearLeyenda(container, total);
    }

    anillo() {
        // Método para dibujar un gráfico de anillo
        let anchura = 512;
        let altura = 512;
        let lienzo = document.createElement("canvas");
        lienzo.width = anchura;
        lienzo.height = altura;
        lienzo.style.border = "1px solid grey";
        
        // Verificar que la imagen existe antes de usarla como fondo
        let imgTest = new Image();
        imgTest.onload = () => {
            lienzo.style.background = "url('descarga.jpg') no-repeat center center";
            lienzo.style.backgroundSize = "cover";
        };
        imgTest.onerror = () => {
            console.log("La imagen de fondo no se pudo cargar, usando un color sólido");
            lienzo.style.background = "#f5f5f5";
        };
        imgTest.src = 'descarga.jpg';
        
        let contexto = lienzo.getContext("2d");
        let alturaletra = 15;

        // Limpiar el contenedor antes de añadir el nuevo gráfico
        const container = document.querySelector(this.selector);
        if (!container) {
            console.error(`El selector "${this.selector}" no existe en el DOM`);
            return;
        }
        
        // Limpiar el contenedor antes de añadir el nuevo gráfico
        container.innerHTML = '';
        container.appendChild(lienzo);

        // Añadir título si existe
        if (this.titulo) {
            let tituloElement = document.createElement("h3");
            tituloElement.textContent = this.titulo;
            container.insertBefore(tituloElement, lienzo);
        }

        // Verificar si hay datos para mostrar
        if (!this.datos || this.datos.length === 0) {
            contexto.fillStyle = "#333";
            contexto.textAlign = "center";
            contexto.font = "20px Arial";
            contexto.fillText("No hay datos disponibles", anchura/2, altura/2);
            return;
        }

        let total = 0; // Calcular el total de los datos
        this.datos.forEach(function(dato) {
            total += dato.valor;
        });

        let anguloinicial = 0;
        let colores = []; // Guardar los colores para la leyenda

        this.datos.forEach(function(dato, index) {
            // Generar colores más vivos y variados
            let r = Math.floor(100 + Math.random() * 155);
            let g = Math.floor(100 + Math.random() * 155);
            let b = Math.floor(100 + Math.random() * 155);
            let color = `rgb(${r}, ${g}, ${b})`;
            colores.push(color);

            let angulofinal = (dato.valor / total) * Math.PI * 2; // Ángulo del sector

            contexto.fillStyle = color;
            contexto.beginPath();
            contexto.moveTo(anchura / 2, altura / 2);
            contexto.arc(
                anchura / 2,
                altura / 2,
                anchura / 2 - 50,
                anguloinicial,
                anguloinicial + angulofinal
            );
            contexto.lineTo(anchura / 2, altura / 2);
            contexto.fill();
            
            // Agregar borde para mayor claridad
            contexto.strokeStyle = "#fff";
            contexto.lineWidth = 2;
            contexto.stroke();

            let angulotexto = anguloinicial + angulofinal / 2;
            contexto.textAlign = "center";
            contexto.fillStyle = "white";
            contexto.font = "bold 14px Arial";
            
            // Solo mostrar texto para sectores suficientemente grandes
            if (angulofinal > 0.2) { // Aproximadamente 11 grados
                let radio = (anchura / 2 - 50) * 0.7; // 70% del radio del anillo
                
                contexto.fillText(
                    dato.texto,
                    anchura / 2 + Math.cos(angulotexto) * radio,
                    altura / 2 + Math.sin(angulotexto) * radio - alturaletra
                );
                
                contexto.fillText(
                    dato.valor,
                    anchura / 2 + Math.cos(angulotexto) * radio,
                    altura / 2 + Math.sin(angulotexto) * radio
                );
                
                let porcentaje = ((dato.valor / total) * 100).toFixed(1);
                contexto.fillText(
                    porcentaje + "%",
                    anchura / 2 + Math.cos(angulotexto) * radio,
                    altura / 2 + Math.sin(angulotexto) * radio + alturaletra
                );
            }

            anguloinicial += angulofinal;
        });

        // Crear el "agujero" en el centro utilizando globalCompositeOperation
        contexto.globalCompositeOperation = 'destination-out'; // Este modo elimina lo que se dibuja

        contexto.beginPath();
        contexto.arc(anchura / 2, altura / 2, 100, 0, Math.PI * 2);
        contexto.fill();

        // Restaurar el modo de composición para el siguiente dibujo
        contexto.globalCompositeOperation = 'source-over'; // Esto es lo normal para dibujar
        
        // Añadir leyenda
        this.crearLeyenda(container, total);
    }
    
    crearLeyenda(container, total) {
        // Crear una leyenda para mostrar todos los datos
        let leyenda = document.createElement("div");
        leyenda.style.marginTop = "20px";
        leyenda.style.display = "grid";
        leyenda.style.gridTemplateColumns = "repeat(auto-fill, minmax(200px, 1fr))";
        leyenda.style.gap = "10px";
        
        this.datos.forEach((dato, index) => {
            // Generar un color para cada elemento (igual que en los gráficos)
            let r = Math.floor(100 + Math.random() * 155);
            let g = Math.floor(100 + Math.random() * 155);
            let b = Math.floor(100 + Math.random() * 155);
            let color = `rgb(${r}, ${g}, ${b})`;
            
            let item = document.createElement("div");
            item.style.display = "flex";
            item.style.alignItems = "center";
            item.style.margin = "5px";
            
            let colorBox = document.createElement("span");
            colorBox.style.display = "inline-block";
            colorBox.style.width = "15px";
            colorBox.style.height = "15px";
            colorBox.style.backgroundColor = color;
            colorBox.style.marginRight = "8px";
            
            let texto = document.createElement("span");
            let porcentaje = ((dato.valor / total) * 100).toFixed(1);
            texto.textContent = `${dato.texto}: ${dato.valor} (${porcentaje}%)`;
            
            item.appendChild(colorBox);
            item.appendChild(texto);
            leyenda.appendChild(item);
        });
        
        container.appendChild(leyenda);
    }
}