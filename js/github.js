/**
 * github.js — Funcionalidad 5 (capa de interfaz)
 *
 * Refleja los tres estados de la petición asíncrona en la sección #github:
 *   loading → esqueletos + spinner · success → perfil y tarjetas · error → mensaje + reintentar
 * El estado se expone en data-estado (para el CSS) y aria-busy (para lectores de pantalla).
 */

import { GITHUB_USER, MAX_REPOS } from './config.js';
import { obtenerPerfil, obtenerRepositorios } from './github-api.js';
import { el, formatearFecha } from './utils.js';

export function initGithub() {
    const seccion = document.getElementById('github');
    const perfilEl = document.getElementById('githubPerfil');
    const estadoEl = document.getElementById('githubEstado');
    const reposEl = document.getElementById('githubRepos');
    const reintentar = document.getElementById('githubReintentar');
    if (!seccion || !perfilEl || !estadoEl || !reposEl) return;

    /** Cambia el estado visual y accesible de toda la sección. */
    function establecerEstado(estado, mensaje) {
        seccion.dataset.estado = estado;
        seccion.setAttribute('aria-busy', String(estado === 'loading'));
        estadoEl.textContent = mensaje;
        reintentar.hidden = estado !== 'error';
    }

    const crearEsqueleto = () =>
        el('li', { className: 'repo-card skeleton', aria: { hidden: 'true' } });

    function crearTarjetaRepo(repo) {
        return el('li', {},
            el('article', { className: 'repo-card' },
                el('h3', {},
                    el('a', { href: repo.html_url, target: '_blank', rel: 'noopener noreferrer' }, repo.name)),
                el('p', {}, repo.description ?? 'Sin descripción.'),
                el('p', { className: 'repo-meta' },
                    repo.language ? el('span', { className: 'repo-lenguaje' }, repo.language) : null,
                    el('span', {}, `★ ${repo.stargazers_count}`),
                    el('span', {}, `Actualizado ${formatearFecha(repo.pushed_at)}`))
            )
        );
    }

    function pintarPerfil(perfil) {
        perfilEl.replaceChildren(
            el('img', {
                src: perfil.avatar_url,
                alt: `Avatar de ${perfil.login} en GitHub`,
                width: 72,
                height: 72,
                loading: 'lazy'
            }),
            el('hgroup', {},
                el('h3', {}, perfil.name ?? perfil.login),
                el('p', {}, perfil.bio ?? `@${perfil.login}`)),
            el('p', { className: 'github-perfil-datos' },
                el('span', {}, `${perfil.public_repos} repositorios`),
                el('span', {}, `${perfil.followers} seguidores`),
                el('a', { href: perfil.html_url, target: '_blank', rel: 'noopener noreferrer' }, 'Ver perfil →'))
        );
        perfilEl.hidden = false;
    }

    async function cargar() {
        // ---- LOADING ----
        perfilEl.hidden = true;
        reposEl.replaceChildren(...Array.from({ length: 3 }, crearEsqueleto));
        establecerEstado('loading', 'Cargando repositorios…');

        try {
            // Las dos peticiones salen en paralelo
            const [perfil, repos] = await Promise.all([
                obtenerPerfil(GITHUB_USER),
                obtenerRepositorios(GITHUB_USER)
            ]);

            // Tubería funcional sobre la respuesta: sin forks → recortar → tarjetas
            const tarjetas = repos
                .filter((repo) => !repo.fork)
                .slice(0, MAX_REPOS)
                .map(crearTarjetaRepo);

            // ---- SUCCESS ----
            pintarPerfil(perfil);
            reposEl.replaceChildren(...tarjetas);
            establecerEstado(
                'success',
                tarjetas.length
                    ? `Mostrando ${tarjetas.length} repositorios públicos de @${perfil.login}.`
                    : 'Este usuario aún no tiene repositorios públicos propios.'
            );
        } catch (error) {
            // ---- ERROR ----
            reposEl.replaceChildren();
            establecerEstado('error', error.message);
        }
    }

    reintentar.addEventListener('click', cargar);
    cargar();
}
