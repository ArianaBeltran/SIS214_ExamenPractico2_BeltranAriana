/**
 * reveal.js — Animación de aparición al hacer scroll (mejora visual opcional)
 *
 * La clase .animar la añade JavaScript, así que sin JS (o con movimiento
 * reducido) el contenido simplemente se ve, nunca queda oculto.
 */

const SELECTOR = [
    '.perfil-texto',
    '.datos-personales',
    '.experiencia-card',
    '.educacion-card',
    '.contacto-info',
    '.formulario'
].join(', ');

export function initReveal() {
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (sinMovimiento || !('IntersectionObserver' in window)) return;

    const observador = new IntersectionObserver((entradas, obs) => {
        entradas
            .filter((entrada) => entrada.isIntersecting)
            .forEach((entrada) => {
                entrada.target.classList.add('visible');
                obs.unobserve(entrada.target);
            });
    }, { threshold: 0.15 });

    document.querySelectorAll(SELECTOR).forEach((elemento) => {
        elemento.classList.add('animar');
        observador.observe(elemento);
    });
}
