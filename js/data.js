/**
 * data.js
 * Datos ORIGINALES del CV. Se congelan con Object.freeze para garantizar
 * la inmutabilidad: ningún módulo puede modificarlos, solo derivar copias
 * con .filter() / .map().
 *
 * Para agregar una habilidad nueva, añade un objeto al arreglo
 * (nivel = porcentaje 0-100).
 */

export const categorias = Object.freeze([
    Object.freeze({ id: 'todas', nombre: 'Todas' }),
    Object.freeze({ id: 'frontend', nombre: 'Frontend' }),
    Object.freeze({ id: 'backend', nombre: 'Backend' }),
    Object.freeze({ id: 'datos', nombre: 'Datos' }),
    Object.freeze({ id: 'herramientas', nombre: 'Herramientas' })
]);

const crearHabilidad = (habilidad) => Object.freeze(habilidad);

export const habilidades = Object.freeze([
    crearHabilidad({
        id: 'html5',
        nombre: 'HTML5',
        categoria: 'frontend',
        descripcion: 'Estructuración semántica y accesible de sitios web.',
        nivel: 90,
        etiquetaNivel: 'Avanzado'
    }),
    crearHabilidad({
        id: 'css3',
        nombre: 'CSS3',
        categoria: 'frontend',
        descripcion: 'Diseño responsive, Flexbox, Grid y animaciones.',
        nivel: 85,
        etiquetaNivel: 'Intermedio - Avanzado'
    }),
    crearHabilidad({
        id: 'javascript',
        nombre: 'JavaScript',
        categoria: 'frontend',
        descripcion: 'Manipulación del DOM, eventos y consumo de APIs.',
        nivel: 80,
        etiquetaNivel: 'Intermedio'
    }),
    crearHabilidad({
        id: 'canvas',
        nombre: 'Canvas API',
        categoria: 'frontend',
        descripcion: 'Gráficos interactivos en el navegador, como el editor de grafos.',
        nivel: 65,
        etiquetaNivel: 'Intermedio'
    }),
    crearHabilidad({
        id: 'java',
        nombre: 'Java',
        categoria: 'backend',
        descripcion: 'Programación orientada a objetos y estructuras de datos.',
        nivel: 75,
        etiquetaNivel: 'Intermedio'
    }),
    crearHabilidad({
        id: 'sql',
        nombre: 'SQL',
        categoria: 'datos',
        descripcion: 'Diseño de bases de datos, consultas y funciones.',
        nivel: 80,
        etiquetaNivel: 'Intermedio'
    }),
    crearHabilidad({
        id: 'modelado',
        nombre: 'Modelado de datos',
        categoria: 'datos',
        descripcion: 'Diagramas de flujo de datos y diccionarios de datos.',
        nivel: 70,
        etiquetaNivel: 'Intermedio'
    }),
    crearHabilidad({
        id: 'git',
        nombre: 'Git',
        categoria: 'herramientas',
        descripcion: 'Control de versiones y trabajo con repositorios.',
        nivel: 75,
        etiquetaNivel: 'Intermedio'
    })
]);
