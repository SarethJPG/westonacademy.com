<?php
// =============================================
// ARCHIVO DE EJEMPLO
// Copia este archivo como "enviar.php" y rellena los valores reales.
// El archivo enviar.php NO se sube a git (está en .gitignore).
// =============================================

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$smtp_host      = 'smtp.TU-HOSTING.com';           // ← Reemplaza con el servidor SMTP
$smtp_usuario   = 'correo@TU-DOMINIO.com';         // ← Reemplaza con el correo
$smtp_password  = 'TU-CONTRASEÑA';                 // ← Reemplaza con la contraseña
$smtp_puerto    = 587;                             // 587 (TLS) o 465 (SSL)
$smtp_seguridad = PHPMailer::ENCRYPTION_STARTTLS;

$correo_destino = 'correo@TU-DOMINIO.com';
$nombre_destino = 'Weston Academy';

// =============================================

// Respuesta JSON
header('Content-Type: application/json; charset=utf-8');

// Recibir datos (JSON desde script.js)
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Datos inválidos']);
    exit;
}

// Sanitizar
$nombre   = htmlspecialchars(strip_tags(trim($input['nombre']   ?? '')), ENT_QUOTES, 'UTF-8');
$ciudad   = htmlspecialchars(strip_tags(trim($input['ciudad']   ?? '')), ENT_QUOTES, 'UTF-8');
$telefono = htmlspecialchars(strip_tags(trim($input['telefono'] ?? '')), ENT_QUOTES, 'UTF-8');
$correo   = filter_var(trim($input['correo'] ?? ''), FILTER_SANITIZE_EMAIL);
$mensaje  = htmlspecialchars(strip_tags(trim($input['mensaje']  ?? '')), ENT_QUOTES, 'UTF-8');

// Validaciones
if (empty($nombre) || mb_strlen($nombre) < 2) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Nombre inválido']);
    exit;
}

if (empty($ciudad) || mb_strlen($ciudad) > 50) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Ciudad inválida']);
    exit;
}

if (empty($telefono) || !preg_match('/^[0-9\s]+$/', $telefono)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Teléfono inválido']);
    exit;
}

if (empty($correo) || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Correo inválido']);
    exit;
}

if (empty($mensaje) || mb_strlen($mensaje) > 500) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Mensaje inválido']);
    exit;
}

// Enviar correo con PHPMailer
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = $smtp_host;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtp_usuario;
    $mail->Password   = $smtp_password;
    $mail->SMTPSecure = $smtp_seguridad;
    $mail->Port       = $smtp_puerto;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom($smtp_usuario, 'Weston Academy');
    $mail->addAddress($correo_destino, $nombre_destino);
    $mail->addReplyTo($correo, $nombre);

    $mail->isHTML(true);
    $mail->Subject = 'Nuevo mensaje desde Weston Academy';

    $mail->Body = "
        <h2 style='color:#3663a7;'>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> {$nombre}</p>
        <p><strong>Ciudad:</strong> {$ciudad}</p>
        <p><strong>Teléfono:</strong> {$telefono}</p>
        <p><strong>Correo:</strong> {$correo}</p>
        <p><strong>Mensaje:</strong></p>
        <p style='padding:1rem;background:#f0f0f0;border-radius:6px;'>{$mensaje}</p>
    ";

    $mail->AltBody = "Nombre: {$nombre}\nCiudad: {$ciudad}\nTeléfono: {$telefono}\nCorreo: {$correo}\n\nMensaje:\n{$mensaje}";

    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Mensaje enviado con éxito']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error al enviar: ' . $mail->ErrorInfo]);
}