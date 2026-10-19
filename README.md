# CV Interactivo — Ariana Beltrán

Landing page de CV / portafolio profesional desarrollada para el **Examen Práctico 2 de Tecnologías Web I (SIS-214)**, Universidad Católica Boliviana "San Pablo".

- 🌐 **Producción:** https://ArianaBeltran.github.io/SIS214_ExamenPractico2_BeltranAriana/
- 📦 **Repositorio:** https://github.com/ArianaBeltran/SIS214_ExamenPractico2_BeltranAriana

## Tecnologías

| Capa | Tecnología |
|------|------------|
| Estructura | HTML5 semántico + WAI-ARIA |
| Estilos | CSS3: custom properties, Flexbox, Grid, Media Queries (mobile-first) |
| Lógica | JavaScript ES6+ con módulos nativos (`type="module"`), sin librerías |
| Datos externos | API REST pública de GitHub (Fetch API + `async/await`) |
| Control de versiones y despliegue | Git, GitHub y GitHub Pages |

## Funcionalidades

1. **Tema claro / oscuro** (`js/theme.js`): alterna `data-theme` en `<html>` y guarda la preferencia en `localStorage` con `JSON.stringify()` / `JSON.parse()`. Respeta `prefers-color-scheme` la primera vez y evita el parpadeo con un script inline en `<head>`.
2. **Menú hamburguesa** (`js/menu.js`): conmuta `.nav--abierto` y actualiza `aria-expanded`; se cierra con `Esc`, al elegir un enlace, al hacer click fuera o al pasar a escritorio. Incluye *scrollspy* con `aria-current`.
3. **Buscador y filtro en tiempo real** (`js/filter.js`): evento `input` + filtros por categoría. Los datos de `data.js` están congelados (`Object.freeze`) y se procesan con la tubería `.filter().map()`, sin mutarlos.
4. **Formulario de contacto** (`js/contact.js`): `event.preventDefault()` en `submit`, validación nativa HTML5 + Constraint Validation API, validación en tiempo real con el evento `input`, mensajes de error/éxito por campo y contador de caracteres.
5. **Módulo asíncrono** (`js/github-api.js` + `js/github.js`): `fetch` con `async/await`, `try…catch`, verificación de `response.ok`, mensajes por código HTTP (400, 403, 404, 500), *timeout* con `AbortController` y tres estados de interfaz: **loading** (esqueletos + spinner), **success** (perfil y tarjetas) y **error** (mensaje + botón *Reintentar*).

## Arquitectura

```
SIS214_ExamenPractico2_BeltranAriana/
├── index.html              # Estructura semántica de toda la página
├── README.md
├── css/
│   ├── tokens.css          # :root (tokens), tema oscuro, reset universal y base
│   ├── layout.css          # Flexbox, Grid y Media Queries mobile-first
│   └── components.css      # Aspecto de cada componente y animaciones
├── js/
│   ├── main.js             # Punto de entrada: inicializa los módulos
│   ├── config.js           # Usuario de GitHub y constantes configurables
│   ├── data.js             # Datos originales e inmutables (habilidades, categorías)
│   ├── utils.js            # Helpers puros (el, normalizar, formatearFecha)
│   ├── theme.js            # 1. Tema + localStorage
│   ├── menu.js             # 2. Menú hamburguesa + ARIA
│   ├── filter.js           # 3. Buscador / filtro
│   ├── contact.js          # 4. Formulario
│   ├── github-api.js       # 5. Capa de datos (fetch)
│   ├── github.js           # 5. Capa de interfaz (loading/success/error)
│   └── reveal.js           # Animaciones al hacer scroll
└── assets/
    └── img/
        └── fotoCVV.jpeg    # Fotografía del hero
```

**Principios de diseño**

- **Separación de responsabilidades:** cada funcionalidad vive en su módulo; `main.js` solo orquesta.
- **Tokens de diseño:** los colores, tipografías y espaciados se declaran una vez en `:root`; el tema oscuro solo redefine tokens, los componentes no cambian.
- **Mobile-first:** los estilos base son para móvil (< 768 px); `min-width: 768px` agrega tablet (768–1024 px) y `min-width: 1025px` agrega escritorio (> 1024 px).
- **Flexbox y Grid con propósito:** Flexbox para alineaciones de una dimensión (header, filtros, botones, pie); Grid para esquemas bidimensionales (hero, secciones de dos columnas, cuadrículas de tarjetas).
- **Accesibilidad:** enlace "saltar al contenido", `aria-label`, `aria-expanded`, `aria-pressed`, `aria-live`, `aria-describedby`, `aria-invalid`, `aria-busy`, foco visible y soporte de `prefers-reduced-motion`.

## Ejecución local

Los módulos ES **no funcionan al abrir `index.html` con doble click** (`file://`); hay que servir la carpeta por HTTP:

```bash
# Opción 1: extensión Live Server de VS Code → "Go Live"

# Opción 2: Python
python -m http.server 5500
# abrir http://localhost:5500

# Opción 3: Node
npx serve .
```

## Configuración antes de publicar

1. En `js/config.js`, `GITHUB_USER` ya apunta a `ArianaBeltran` (cámbialo si usas otra cuenta).
2. En `index.html`, reemplaza `TU_ENDPOINT_DE_FORMSPREE` por tu endpoint de [Formspree](https://formspree.io) para recibir mensajes reales. Mientras tanto el formulario funciona en modo demostración.
3. Coloca tu foto en `assets/img/fotoCVV.jpeg`.

## Despliegue en GitHub Pages

1. Crea el repositorio **público** `SIS214_ExamenPractico2_BeltranAriana`.
2. `git remote add origin https://github.com/ArianaBeltran/SIS214_ExamenPractico2_BeltranAriana.git`
3. `git push -u origin main`
4. En GitHub: **Settings → Pages → Deploy from a branch → `main` / `(root)` → Save**.
5. En 1–2 minutos estará en `https://ArianaBeltran.github.io/SIS214_ExamenPractico2_BeltranAriana/`.

## Convenciones

- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `style:`, `docs:`, `refactor:`, `chore:`), un cambio atómico por commit.
- **Nomenclatura:** `camelCase` en JavaScript, `kebab-case` en clases CSS, archivos en minúsculas.
- **Indentación:** 4 espacios en HTML, CSS y JS.

## Autora

**Ariana Beltrán** — Estudiante de Ingeniería de Sistemas, La Paz, Bolivia.
