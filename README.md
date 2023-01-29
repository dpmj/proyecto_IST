# Taskify | Proyecto IST 2022/2023

## Pantallas 

- **Plan:** Planificador de tareas por listas. Crea planes (tareas) y categorías, reordena planes y categorías con arrastrar y soltar. Edita el contenido de los planes y los títulos de las categorías haciendo click en ellas. Filtra la vista por las tareas asignadas a cada usuario en la barra lateral.
- **Calendar:** Planificador de tareas mensual. Crea planes haciendo click en el botón de crear tarea que aparece al pasar el ratón por encima de los días del mes actual. Puedes editar su contenido una vez creado. Reordena planes en el mes arrastrando y soltando. Puedes navegar al mes siguiente / mes anterior y volver al mes actual con los botones designados para ello en la barra de navegación del calendario. Filtra la vista por las tareas asignadas a cada usuario en la barra lateral.
- **Multimedia:** Colección de vídeos de historias de éxito. Navega verticalmente por la página haciendo click en los botones de la barra lateral. 
- **New card:** Crea nuevas tarjetas de forma avanzada por medio de un formulario.
- **Register:** Regístrate en la página web por medio de este formulario. *Nota: el resultado se envía como JSON a un servidor Flask el cual devuelve una confirmación. Dicho servidor se ejecuta en `localhost`, ver apartado más abajo*.
- **Log In:** Inicia sesión en nuestro servicio indicando nombre de usuario y contraseña.

## Otras características

- Cambia el fondo de pantalla a otro aleatorio con el botón situado en el footer.
- Si tienes dudas, puedes consultar la ayuda en el botón situado en el aside, aparecerá un *popup* con información sobre la página que estás viendo.

## Cómo ejecutar el servidor de Flask

1. Instalar python versión >= 3.6
2. Instalar flask
3. En la carpeta `flask/`, ejecutar el comando `python app.py`
4. Listo

**Nota: el servidor flask no funciona en el entorno de github-pages, sólo en local.**
