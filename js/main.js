/**
 * main.js — Punto de entrada de la aplicación
 *
 * Inicializa cada módulo de forma aislada: si uno falla, los demás siguen
 * funcionando y la consola no queda con errores sin controlar.
 */

import { initTheme } from './theme.js';
import { initMenu } from './menu.js';
import { initFilter } from './filter.js';
import { initContact } from './contact.js';
import { initGithub } from './github.js';
import { initReveal } from './reveal.js';

const modulos = [
    ['tema', initTheme],
    ['menú', initMenu],
    ['filtro', initFilter],
    ['contacto', initContact],
    ['github', initGithub],
    ['animaciones', initReveal]
];

function iniciar() {
    modulos.forEach(([nombre, inicializar]) => {
        try {
            inicializar();
        } catch (error) {
            console.warn(`No se pudo iniciar el módulo "${nombre}":`, error);
        }
    });

    const anio = document.getElementById('anioActual');
    if (anio) anio.textContent = new Date().getFullYear();
}

// Los módulos ES se ejecutan diferidos, pero se protege el caso de DOM aún cargando
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
} else {
    iniciar();
}
