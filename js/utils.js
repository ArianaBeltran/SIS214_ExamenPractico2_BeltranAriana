/**
 * utils.js
 * Funciones auxiliares puras reutilizadas por varios módulos.
 */

/**
 * Crea un elemento del DOM sin usar innerHTML (evita inyección de HTML).
 * @param {string} tag - Nombre de la etiqueta.
 * @param {Object} [props] - Propiedades/atributos. `dataset` y `aria` aceptan objetos.
 * @param {...(Node|string)} children - Hijos del elemento.
 * @returns {HTMLElement}
 */
export function el(tag, props = {}, ...children) {
    const elemento = document.createElement(tag);

    Object.entries(props).forEach(([clave, valor]) => {
        if (valor === undefined || valor === null || valor === false) return;

        if (clave === 'dataset') {
            Object.assign(elemento.dataset, valor);
        } else if (clave === 'aria') {
            Object.entries(valor).forEach(([nombre, v]) => elemento.setAttribute(`aria-${nombre}`, v));
        } else if (clave === 'style') {
            Object.entries(valor).forEach(([nombre, v]) => elemento.style.setProperty(nombre, v));
        } else if (clave in elemento) {
            elemento[clave] = valor;
        } else {
            elemento.setAttribute(clave, valor);
        }
    });

    elemento.append(...children.filter((hijo) => hijo !== null && hijo !== undefined));
    return elemento;
}

/**
 * Normaliza un texto para comparar: minúsculas, sin tildes y sin espacios extremos.
 * "  Programación " → "programacion"
 * @param {string} texto
 * @returns {string}
 */
export const normalizar = (texto) =>
    String(texto)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .trim();

/**
 * Formatea una fecha ISO como "12 oct 2026" en español de Bolivia.
 * @param {string} iso
 * @returns {string}
 */
export const formatearFecha = (iso) =>
    new Intl.DateTimeFormat('es-BO', { day: 'numeric', month: 'short', year: 'numeric' })
        .format(new Date(iso));
