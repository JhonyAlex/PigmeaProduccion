<?php
// Esta parte solo se ejecutará en un servidor PHP
$is_php_env = true;
$app_version = "1.0.1";
$csrf_token = md5(uniqid(rand(), true));

// Si quieres probar en GitHub Pages, simplemente guarda este archivo como index.html
// y elimina toda la sección PHP
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="<?php echo $is_php_env ? $csrf_token : 'static-token-for-demo'; ?>">
    <title>Sistema de Gestión de Producción y KPIs</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Chart.js -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <!-- ... existing code ... -->

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js"></script>
    
    <!-- Config script - determina si estamos en modo estático o PHP -->
    <script src="js/config.js"></script>
    
    <!-- Archivos de aplicación -->
    <script src="js/navigation.js"></script>
    <script src="js/funciones.js"></script>
    <script src="js/gestion-operarios.js"></script>
    <script src="js/gestion-maquinas.js"></script>
    
    <!-- Solución global para modales -->
    <script>
      // ... existing code ...
    </script>
</body>
</html>
