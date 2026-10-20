/**
 * menu.js — Funcionalidad 2: Menú hamburguesa responsivo y accesible
 *
 * · click en el botón → conmuta la clase .nav--abierto
 * · muta aria-expanded (true/false) y aria-label del botón
 * · se cierra con Escape, al elegir un enlace, al hacer click fuera
 *   y al pasar a escritorio (> 1024px)
 * · extra: marca con aria-current el enlace de la sección visible (scrollspy)
 */

const CLASE_ABIERTO = 'nav--abierto';
const ES_ESCRITORIO = '(min-width: 1025px)';

export function initMenu() {
    const boton = document.getElementById('menuBtn');
    const nav = document.getElementById('navMenu');
    if (!boton || !nav) return;

    const estaAbierto = () => boton.getAttribute('aria-expanded') === 'true';

    function establecerMenu(abrir, devolverFoco = false) {
        nav.classList.toggle(CLASE_ABIERTO, abrir);
        boton.setAttribute('aria-expanded', String(abrir));
        boton.setAttribute('aria-label', abrir ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
        if (!abrir && devolverFoco) boton.focus();
    }

    boton.addEventListener('click', () => establecerMenu(!estaAbierto()));

    // Delegación de eventos: un solo listener para todos los enlaces del menú
    nav.addEventListener('click', (evento) => {
        if (evento.target.closest('a')) establecerMenu(false);
    });

    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape' && estaAbierto()) establecerMenu(false, true);
    });

    document.addEventListener('click', (evento) => {
        if (estaAbierto() && !evento.target.closest('.header')) establecerMenu(false);
    });

    window.matchMedia(ES_ESCRITORIO).addEventListener('change', (evento) => {
        if (evento.matches) establecerMenu(false);
    });

    iniciarScrollSpy(nav);
}

/** Resalta en el menú la sección que está en pantalla. */
function iniciarScrollSpy(nav) {
    if (!('IntersectionObserver' in window)) return;

    const enlaces = [...nav.querySelectorAll('a[href^="#"]')];
    const secciones = enlaces
        .map((enlace) => document.querySelector(enlace.getAttribute('href')))
        .filter(Boolean);

    const observador = new IntersectionObserver((entradas) => {
        entradas
            .filter((entrada) => entrada.isIntersecting)
            .forEach((entrada) => {
                enlaces.forEach((enlace) => {
                    const activo = enlace.getAttribute('href') === `#${entrada.target.id}`;
                    if (activo) enlace.setAttribute('aria-current', 'true');
                    else enlace.removeAttribute('aria-current');
                });
            });
    }, { rootMargin: '-45% 0px -50% 0px' });

    secciones.forEach((seccion) => observador.observe(seccion));
}
