/**
 * filter.js — Funcionalidad 3: Buscador y filtro en tiempo real
 *
 * · Escucha el evento `input` del buscador y los clicks de los filtros.
 * · INMUTABILIDAD: `habilidades` está congelado (Object.freeze) y nunca se
 *   modifica; cada render deriva una colección nueva con .filter() y .map().
 */

import { habilidades, categorias } from './data.js';
import { el, normalizar } from './utils.js';

/** Estado de la interfaz (no contiene los datos, solo los criterios). */
const criterios = { texto: '', categoria: 'todas' };

const nombreCategoria = (id) => categorias.find((categoria) => categoria.id === id)?.nombre ?? id;

/** Predicado del .filter(): ¿la habilidad cumple la búsqueda y la categoría? */
function cumpleCriterios(habilidad) {
    const coincideCategoria =
        criterios.categoria === 'todas' || habilidad.categoria === criterios.categoria;

    const textoBuscable = normalizar(
        `${habilidad.nombre} ${habilidad.descripcion} ${nombreCategoria(habilidad.categoria)} ${habilidad.etiquetaNivel}`
    );

    return coincideCategoria && textoBuscable.includes(normalizar(criterios.texto));
}

/** Transformación del .map(): dato → tarjeta del DOM. */
function crearTarjeta(habilidad, indice) {
    return el('li', {},
        el('article', { className: 'habilidad-card', dataset: { categoria: habilidad.categoria } },
            el('p', { className: 'habilidad-icono' },
                `${String(indice + 1).padStart(2, '0')} · ${nombreCategoria(habilidad.categoria)}`),
            el('h3', {}, habilidad.nombre),
            el('p', {}, habilidad.descripcion),
            el('p', { className: 'barra', aria: { hidden: 'true' } },
                el('span', { style: { '--nivel': `${habilidad.nivel}%` } })),
            el('small', {}, `${habilidad.etiquetaNivel} · ${habilidad.nivel}%`)
        )
    );
}

export function initFilter() {
    const lista = document.getElementById('habilidadesLista');
    const contenedorFiltros = document.getElementById('filtros');
    const buscador = document.getElementById('buscador');
    const formulario = document.getElementById('habilidadesForm');
    const info = document.getElementById('resultadosInfo');
    const sinResultados = document.getElementById('sinResultados');
    if (!lista || !contenedorFiltros || !buscador) return;

    function render() {
        // Tubería funcional: datos originales → filter → map → DOM
        const tarjetas = habilidades
            .filter(cumpleCriterios)
            .map(crearTarjeta);

        lista.replaceChildren(...tarjetas);
        sinResultados.hidden = tarjetas.length > 0;
        info.textContent = `Mostrando ${tarjetas.length} de ${habilidades.length} habilidades`;
    }

    // Botones de categoría generados desde los datos (con .map())
    const botones = categorias.map((categoria) =>
        el('li', {},
            el('button', {
                className: `filtro${categoria.id === criterios.categoria ? ' activo' : ''}`,
                type: 'button',
                dataset: { filtro: categoria.id },
                aria: { pressed: String(categoria.id === criterios.categoria) }
            }, categoria.nombre)
        )
    );
    contenedorFiltros.replaceChildren(...botones);

    // Delegación de eventos: un solo listener para todos los botones
    contenedorFiltros.addEventListener('click', (evento) => {
        const boton = evento.target.closest('.filtro');
        if (!boton) return;

        criterios.categoria = boton.dataset.filtro;
        contenedorFiltros.querySelectorAll('.filtro').forEach((otro) => {
            const activo = otro === boton;
            otro.classList.toggle('activo', activo);
            otro.setAttribute('aria-pressed', String(activo));
        });
        render();
    });

    // Búsqueda en tiempo real mientras el usuario escribe
    buscador.addEventListener('input', (evento) => {
        criterios.texto = evento.target.value;
        render();
    });

    // Evita que Enter en el buscador recargue la página
    formulario.addEventListener('submit', (evento) => evento.preventDefault());

    render();
}
