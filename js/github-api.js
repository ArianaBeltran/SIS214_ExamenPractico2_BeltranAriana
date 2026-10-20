/**
 * github-api.js — Funcionalidad 5 (capa de datos): Fetch API + async/await
 *
 * Solo se ocupa de la comunicación con la API REST pública de GitHub.
 * La interfaz (loading / success / error) vive en github.js.
 *
 *  · Cada petición está encapsulada en try…catch.
 *  · Se evalúa response.ok y se traduce el código HTTP a un mensaje claro
 *    (400, 403, 404, 500…).
 *  · Se corta la petición con AbortController si tarda demasiado.
 */

import { API_TIMEOUT_MS } from './config.js';

const API_URL = 'https://api.github.com';

/** Error con el código de estado HTTP asociado. */
export class ApiError extends Error {
    constructor(mensaje, estado = null) {
        super(mensaje);
        this.name = 'ApiError';
        this.estado = estado;
    }
}

/** Traduce un código de estado HTTP a un mensaje para el usuario. */
function mensajeParaEstado(estado) {
    switch (estado) {
        case 400: return 'Solicitud incorrecta (400): revisa el usuario configurado.';
        case 403: return 'GitHub limitó las consultas (403). Espera unos minutos e inténtalo otra vez.';
        case 404: return 'No se encontró el usuario de GitHub (404). Revisa GITHUB_USER en js/config.js.';
        case 500:
        case 502:
        case 503: return `GitHub tiene problemas en este momento (${estado}). Inténtalo más tarde.`;
        default: return `No se pudo completar la consulta (HTTP ${estado}).`;
    }
}

/**
 * GET genérico que devuelve JSON o lanza ApiError.
 * @param {string} ruta - Ruta relativa, p. ej. "/users/octocat".
 * @returns {Promise<any>}
 */
async function pedirJSON(ruta) {
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), API_TIMEOUT_MS);

    try {
        const response = await fetch(`${API_URL}${ruta}`, {
            headers: { Accept: 'application/vnd.github+json' },
            signal: controlador.signal
        });

        if (!response.ok) {
            throw new ApiError(mensajeParaEstado(response.status), response.status);
        }

        return await response.json();                 // 200 OK
    } catch (error) {
        if (error instanceof ApiError) throw error;   // ya viene con mensaje HTTP

        if (error.name === 'AbortError') {
            throw new ApiError('GitHub tardó demasiado en responder. Inténtalo de nuevo.');
        }

        // fetch() solo rechaza por fallos de red (sin conexión, DNS, CORS…)
        throw new ApiError('No hay conexión con GitHub. Revisa tu internet e inténtalo de nuevo.');
    } finally {
        clearTimeout(temporizador);
    }
}

/** Perfil público del usuario. */
export const obtenerPerfil = (usuario) =>
    pedirJSON(`/users/${encodeURIComponent(usuario)}`);

/** Repositorios públicos, del más reciente al más antiguo. */
export const obtenerRepositorios = (usuario) =>
    pedirJSON(`/users/${encodeURIComponent(usuario)}/repos?per_page=100&sort=updated`);
