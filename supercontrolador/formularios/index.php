<!doctype html>
<html>
	<head>
		<link rel="stylesheet" href="estilo.css">
		<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
	</head>
	<body>
		<?php
		if (!isset($_GET['f']) || empty($_GET['f'])) {
			die("<h1>Error: No se especificó un formulario.</h1>");
		}

		$archivo = 'forms/' . htmlspecialchars($_GET['f']) . '.json';

		if (!file_exists($archivo)) {
			die("<h1>Error: El formulario solicitado no existe.</h1>");
		}

		$datos = file_get_contents($archivo);
		$coleccion = json_decode($datos, true);

		if (!is_array($coleccion)) {
			die("<h1>Error: El archivo JSON no es válido.</h1>");
		}
		?>

		<form method="POST" action="envia.php">
			<h1><?php echo htmlspecialchars($_GET['f']); ?></h1>
			<input type="hidden" name="token" value="<?php echo base64_encode(date('U'));?>">
			<input type="hidden" name="formulario" value="<?php echo htmlspecialchars($_GET['f']); ?>">

			<?php foreach($coleccion as $clave => $valor): ?>
				<article>
					<div class='texto'>
						<p><strong><?php echo htmlspecialchars($valor['titulo']); ?></strong></p>
						<p><?php echo htmlspecialchars($valor['descripcion']); ?></p>
					</div>
					<input 
						type="<?php echo htmlspecialchars($valor['tipo']); ?>" 
						name="<?php echo htmlspecialchars($valor['nombre']); ?>"
						placeholder="<?php echo htmlspecialchars($valor['valorejemplo']); ?>"
						minlength="<?php echo htmlspecialchars($valor['min']); ?>"
						maxlength="<?php echo htmlspecialchars($valor['max']); ?>"
						<?php if (!empty($valor['jvvalidador'])): ?>
							jvvalidador="<?php echo htmlspecialchars($valor['jvvalidador']); ?>"
						<?php endif; ?>
					>
				</article>
			<?php endforeach; ?>

			<input type="submit">
		</form>

		<script>
			<?php 
			$jvScriptPath = "lib/jvvalidador/jvvalidador.js";
			if (file_exists($jvScriptPath)) {
				echo str_replace(["\r", "\n", "\t"], '', file_get_contents($jvScriptPath));
			} else {
				echo "console.error('Error: No se pudo cargar el validador.');";
			}
			?>
		</script>
		<link rel="stylesheet" href="lib/jvvalidador/jvvalidador.css">
	</body>
</html>
