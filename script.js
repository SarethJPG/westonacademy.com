// =========================================
// NAVBAR: OCULTAR/MOSTRAR AL HACER SCROLL
// =========================================

// Guardamos la posición inicial del scroll al cargar la página
let ubicacionPrincipal = window.scrollY || document.documentElement.scrollTop;

// Referencia al elemento de la navbar
const navbar = document.getElementById('navbar');

// Detecta cada movimiento del scroll
if (navbar) {
    window.addEventListener('scroll', function () {

        // Posición actual del scroll en el momento del evento
        const desplazamientoActual = window.scrollY || document.documentElement.scrollTop;

        // Si estamos subiendo (posición anterior >= actual) o estamos hasta arriba, mostramos la navbar
        if (ubicacionPrincipal >= desplazamientoActual || desplazamientoActual <= 0) {
            navbar.classList.remove('navbar-oculta');
        } else {
            // Si estamos bajando, ocultamos la navbar
            navbar.classList.add('navbar-oculta');
        }

        // Actualizamos la referencia para la próxima ejecución
        ubicacionPrincipal = desplazamientoActual;
    });
}

// =========================================
// NAVBAR: MENÚ SÁNDWICH (VISTA MÓVIL)
// =========================================
document.addEventListener('DOMContentLoaded', function () {

    const btnHamburguesa = document.getElementById('btn-hamburguesa');
    const seccionD = document.querySelector('.seccion-d');

    // Solo se activa si ambos elementos existen en la página
    if (btnHamburguesa && seccionD) {

        // Toggle del menú al pulsar el botón sándwich
        btnHamburguesa.addEventListener('click', function (e) {
            e.stopPropagation();
            btnHamburguesa.classList.toggle('abierto');
            seccionD.classList.toggle('menu-activo');
        });

        // Cerrar el menú automáticamente al hacer clic en cualquier pestaña
        const enlaces = seccionD.querySelectorAll('.nav-link');
        enlaces.forEach(function (enlace) {
            enlace.addEventListener('click', function () {
                btnHamburguesa.classList.remove('abierto');
                seccionD.classList.remove('menu-activo');
            });
        });

        // Cerrar el menú al hacer clic fuera de él
        document.addEventListener('click', function (e) {
            if (!seccionD.contains(e.target) && !btnHamburguesa.contains(e.target)) {
                btnHamburguesa.classList.remove('abierto');
                seccionD.classList.remove('menu-activo');
            }
        });
    }
});