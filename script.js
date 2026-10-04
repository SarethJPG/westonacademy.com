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

// =========================================
// HERO: CARRUSEL DE 3 CARDS CON BUCLE INFINITO
// =========================================
const track = document.getElementById('carrusel-track');

// Solo se ejecuta si la página actual tiene el carrusel
if (track) {

    const slidesOriginales = Array.from(track.children);
    const btnIzq = document.getElementById('hero-flecha-izq');
    const btnDer = document.getElementById('hero-flecha-der');
    const puntos = Array.from(document.querySelectorAll('.hero-punto'));

    let indiceActual = 1;
    let enMovimiento = false;

    // -----------------------------------------
    // Clonamos la primera y última card para el bucle infinito
    // -----------------------------------------
    const primerClon = slidesOriginales[0].cloneNode(true);
    const ultimoClon = slidesOriginales[slidesOriginales.length - 1].cloneNode(true);

    track.appendChild(primerClon);
    track.insertBefore(ultimoClon, slidesOriginales[0]);

    const todosLosSlides = Array.from(track.children);

    // -----------------------------------------
    // Mueve la pista a la card indicada por indiceActual
    // -----------------------------------------
    function moverCarrusel() {
        const anchoSlide = todosLosSlides[0].getBoundingClientRect().width;
        track.style.transform = `translateX(-${indiceActual * anchoSlide}px)`;
    }

    // Posicionamiento inicial sin animación
    track.style.transition = 'none';
    moverCarrusel();

    // -----------------------------------------
    // Sincroniza el punto activo con la card actual
    // (ignora los clones, siempre apunta al original)
    // -----------------------------------------
    function actualizarPuntos() {
        // Quitamos el activo de todos
        puntos.forEach(punto => punto.classList.remove('activo'));

        // Calculamos a qué índice real corresponde
        let indexReal = indiceActual - 1;

        // Si estamos en el clon del primero (extremo derecho), iluminamos el punto 0
        if (indiceActual === todosLosSlides.length - 1) indexReal = 0;

        // Si estamos en el clon del último (extremo izquierdo), iluminamos el último punto
        if (indiceActual === 0) indexReal = slidesOriginales.length - 1;

        // Activamos el punto correspondiente (si existe)
        if (puntos[indexReal]) {
            puntos[indexReal].classList.add('activo');
        }
    }

    // -----------------------------------------
    // Avanzar a la derecha
    // -----------------------------------------
    function moverDerecha() {
        if (enMovimiento) return;
        enMovimiento = true;
        track.style.transition = 'transform 0.6s ease-in-out';
        indiceActual++;
        moverCarrusel();
        actualizarPuntos();
    }

    // -----------------------------------------
    // Avanzar a la izquierda
    // -----------------------------------------
    function moverIzquierda() {
        if (enMovimiento) return;
        enMovimiento = true;
        track.style.transition = 'transform 0.6s ease-in-out';
        indiceActual--;
        moverCarrusel();
        actualizarPuntos();
    }

    // -----------------------------------------
    // Al terminar la transición, saltamos sin animación
    // si estamos en un clon (efecto infinito)
    // -----------------------------------------
    track.addEventListener('transitionend', () => {
        enMovimiento = false;

        // Si llegamos al clon del primero → saltamos al original
        if (indiceActual === todosLosSlides.length - 1) {
            track.style.transition = 'none';
            indiceActual = 1;
            moverCarrusel();
        }

        // Si llegamos al clon del último → saltamos al original
        if (indiceActual === 0) {
            track.style.transition = 'none';
            indiceActual = todosLosSlides.length - 2;
            moverCarrusel();
        }
    });

    // -----------------------------------------
    // Listeners de las flechas
    // -----------------------------------------
    if (btnDer) btnDer.addEventListener('click', moverDerecha);
    if (btnIzq) btnIzq.addEventListener('click', moverIzquierda);

    // -----------------------------------------
    // Clic en cada punto → salta directo a esa card
    // -----------------------------------------
    puntos.forEach((punto, index) => {
        punto.addEventListener('click', () => {
            if (enMovimiento) return;
            enMovimiento = true;
            // +1 porque el índice 0 del track es el clon de la última card
            indiceActual = index + 1;
            track.style.transition = 'transform 0.6s ease-in-out';
            moverCarrusel();
            actualizarPuntos();
        });
    });

    // -----------------------------------------
    // Recalcular en resize
    // -----------------------------------------
    window.addEventListener('resize', () => {
        track.style.transition = 'none';
        moverCarrusel();
    });
}