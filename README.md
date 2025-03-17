# Generador de Académicas/os

Generador de HTML para sección de cuerpo académico del Departamento de Ingeniería Civil https://ingcivil.uchile.cl/academicas-y-academicos/cuerpo-academico

Funciona como un módulo de Magnolia, donde solamente hay que copiar el código HTML de `generador-academicos.html` en la página deseada.

## Cómo funciona

El proyecto utiliza la librería [XLSX](https://www.npmjs.com/package/xlsx) para leer la planilla de 'Equipo DIC.xlsx'. Luego genera el código HTML usando Javascript, dejando este en un cuadro de texto y además una previsualización de la página. 

Para distribuir los scripts desde GitHub, se utiliza [jsdelvr](https://www.jsdelivr.com/), un servicio que permite distrbuir librerías de Javascript desde respositorios.

Nota: Actualmente no funcionan las pestañas de académicos según jornada en la previsualización, pero sí al copiar el código en una página de Magnolia.

## Estructura del respositorio

- `generador-academicos.html`: Archivo principal que debe ser copiado en Magnolia 
- `generador-academicos-script.js`: Código Javascript para la generación del HTML
- `academicos-script.js`: Código Javascript para el funcionamiento de la página, como el buscador de Académicos.

## Cómo actualizar este proyecto

Cuando se realice un cambio, se debe relaizar lo siguiente:
- Actualizar la versión de los scripts en `generador-academicos.html` y en `generador-academicos-script.js`
  - Por ejemplo:
```html
<script src="https://cdn.jsdelivr.net/gh/Rediseno-Web-Ingenieria-Civil/Generador-de-Academicos@1.0.0/generador-academicos-script.js"></script>
```
Cambiar a
```html
<script src="https://cdn.jsdelivr.net/gh/Rediseno-Web-Ingenieria-Civil/Generador-de-Academicos@1.1.0/generador-academicos-script.js"></script>
```
- Publicar la nueva versión en GitHub desde Releases
- Copiar el código de `generador-academicos.html` en Magnolia
