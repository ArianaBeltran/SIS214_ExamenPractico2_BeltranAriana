/**
 * theme.js — Funcionalidad 1: Conmutador de tema (Dark / Light)
 *
 * · Alterna el atributo data-theme en <html> (los tokens CSS hacen el resto).
 * · Persiste la preferencia en localStorage serializada con JSON.stringify()
 *   y la restaura con JSON.parse() al recargar.
 */

import { THEME_STORAGE_KEY } from './config.js';

const COLORES_BARRA = { light: '#fff8ef', dark: '#272321' };

/** Lee la preferencia guardada. Devuelve null si no existe o está corrupta. */
function leerPreferencia() {
    try {
        return JSON.parse(localStorage.getItem(THEME_STORAGE_KEY));
    } catch (error) {
        return null;
    }
}

/** Guarda la preferencia como JSON. Falla en silencio si el almacenamiento está bloqueado. */
function guardarPreferencia(modo) {
    try {
        const preferencia = { modo, actualizado: new Date().toISOString() };
        localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(preferencia));
    } catch (error) {
        /* Modo privado o almacenamiento lleno: el tema sigue funcionando sin persistir */
    }
}

/** Aplica el modo al DOM y sincroniza el estado accesible del botón. */
function aplicarTema(modo, boton) {
    document.documentElement.dataset.theme = modo;
    boton.setAttribute('aria-pressed', String(modo === 'dark'));
    boton.title = modo === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';

    const metaColor = document.querySelector('meta[name="theme-color"]');
    if (metaColor) metaColor.setAttribute('content', COLORES_BARRA[modo]);
}

export function initTheme() {
    const boton = document.getElementById('temaBtn');
    if (!boton) return;

    const guardada = leerPreferencia();
    const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const modoInicial = guardada?.modo ?? (prefiereOscuro ? 'dark' : 'light');

    aplicarTema(modoInicial, boton);

    boton.addEventListener('click', () => {
        const nuevoModo = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        aplicarTema(nuevoModo, boton);
        guardarPreferencia(nuevoModo);
    });
}
