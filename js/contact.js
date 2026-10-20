/**
 * contact.js — Funcionalidad 4: Formulario de contacto interactivo
 *
 * · event.preventDefault() en `submit`: la página nunca se recarga.
 * · Validación nativa de HTML5 (required, minlength, type=email) combinada con
 *   la Constraint Validation API (setCustomValidity / checkValidity).
 * · Evento `input`: valida en tiempo real y muestra error/éxito por campo.
 * · Si `action` es un endpoint real (p. ej. Formspree) se envía con fetch;
 *   mientras sea el marcador TU_ENDPOINT… funciona en modo demostración.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Devuelve el mensaje de error de un campo, o '' si es válido. */
function obtenerError(campo) {
    const valor = campo.value.trim();

    if (!valor) return 'Este campo es obligatorio.';

    if (campo.type === 'email' && !EMAIL_REGEX.test(valor)) {
        return 'Ingresa un correo válido, por ejemplo nombre@dominio.com.';
    }

    if (campo.minLength > 0 && valor.length < campo.minLength) {
        return `Escribe al menos ${campo.minLength} caracteres (llevas ${valor.length}).`;
    }

    return '';
}

/** Valida un campo, actualiza la interfaz y devuelve true si es válido. */
function validarCampo(campo) {
    const error = obtenerError(campo);
    campo.setCustomValidity(error);               // integra el error con la validación nativa

    const contenedor = campo.closest('.campo');
    const mensaje = document.getElementById(campo.getAttribute('aria-describedby').split(' ')[0]);

    contenedor.dataset.estado = error ? 'error' : 'ok';
    campo.setAttribute('aria-invalid', String(Boolean(error)));
    mensaje.textContent = error || '✓ Se ve bien';

    return !error;
}

function limpiarEstados(formulario) {
    formulario.querySelectorAll('.campo').forEach((contenedor) => {
        delete contenedor.dataset.estado;
        contenedor.querySelector('.campo-mensaje').textContent = '';
    });
    formulario.querySelectorAll('input, textarea').forEach((campo) => {
        campo.removeAttribute('aria-invalid');
        campo.setCustomValidity('');
    });
}

export function initContact() {
    const formulario = document.getElementById('formularioContacto');
    if (!formulario) return;

    const campos = [...formulario.querySelectorAll('input, textarea')];
    const mensajeGeneral = document.getElementById('mensajeFormulario');
    const boton = formulario.querySelector('button[type="submit"]');
    const textarea = document.getElementById('mensaje');
    const contador = document.getElementById('contadorMensaje');

    function mostrarMensaje(texto, tipo) {
        mensajeGeneral.textContent = texto;
        mensajeGeneral.className = `mensaje-formulario ${tipo}`;
    }

    const actualizarContador = () => {
        contador.textContent = `${textarea.value.length} / ${textarea.maxLength}`;
    };

    // Validación en tiempo real mientras se escribe
    formulario.addEventListener('input', (evento) => {
        if (!campos.includes(evento.target)) return;
        validarCampo(evento.target);
        if (evento.target === textarea) actualizarContador();
        mensajeGeneral.textContent = '';
    });

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();                     // evita la recarga de la página

        const resultados = campos.map(validarCampo);  // valida todos (no se detiene en el primero)
        if (resultados.includes(false)) {
            mostrarMensaje('Revisa los campos marcados antes de enviar.', 'error-general');
            formulario.querySelector(':invalid')?.focus();
            return;
        }

        boton.disabled = true;
        mostrarMensaje('Enviando…', '');

        try {
            const nombre = document.getElementById('nombre').value.trim();
            const enModoDemo = formulario.action.includes('TU_ENDPOINT');

            if (enModoDemo) {
                await new Promise((resolver) => setTimeout(resolver, 700));
                mostrarMensaje(
                    `¡Gracias, ${nombre}! Tu mensaje fue validado (modo demostración: aún no se envía a ningún servidor).`,
                    'exito'
                );
            } else {
                const respuesta = await fetch(formulario.action, {
                    method: 'POST',
                    body: new FormData(formulario),
                    headers: { Accept: 'application/json' }
                });
                if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
                mostrarMensaje(`¡Gracias, ${nombre}! Tu mensaje fue enviado correctamente.`, 'exito');
            }

            formulario.reset();
            limpiarEstados(formulario);
            actualizarContador();
        } catch (error) {
            mostrarMensaje('No se pudo enviar el mensaje. Inténtalo nuevamente en unos minutos.', 'error-general');
        } finally {
            boton.disabled = false;
        }
    });

    actualizarContador();
}
