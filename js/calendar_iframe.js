/* 
 * Este script genera el calendario. Como cada mes empieza en un día de la semana 
 * diferente, hay que generarlo acorde.
 */


// ///////////////////////////////////////////////////////////////////////////////////////
// Variables globales


// Meses del año
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
              'September', 'October', 'November', 'December'];

// Días de la semana
var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Número total de posiciones en la rejilla: 
// 7 días/semana * 6 semanas (caso en el que un mes comience y termine a mitad de semana)
var grid_size = 42;

// Fecha actual mostrada en el calendario
var current_shown_date = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
}

// Para la funcionalidad de drag and drop
var task_containers;
var create_buttons;



// ///////////////////////////////////////////////////////////////////////////////////////
// FUNCIONES

// Función que construye un array de objetos fecha que serán expuestos en la rejilla
function datesForGrid(year, month)
{
    // vector de días a incluir en la rejilla
    var dates = [];

    // Día de la semana en el que comienza el mes actual
    var first_day = new Date(year, month).getDay() - 1; 
    // .getDay Lo da en formato inglés: 0: domingo ... 6: sábado. Realizamos un
    // desplazamiento de una posición. En caso de que sea domingo, corregimos:
    if (first_day < 0) {
        first_day = 6;
    }

    // nº total de días en el mes actual
    var total_days_in_month = new Date(year, month + 1, 0).getDate();
    // nº total de días en el mes anterior
    var total_days_in_prev_month = new Date(year, month, 0).getDate();


    // ///////////////////////////////////////////////////////////////////////////////////
    // Añadir días del mes anterior que deben mostrarse en el calendario en gris
    // Estos días tienen clase 'prev', aparecen en grisáceo
    
    for (var i = 1; i <= first_day; i++)  // Siempre que el mes no empiece un lunes
    {
        // nº de día de la fecha del mes anterior a incluir, se genera en orden ascendente
        var prev_month_date = total_days_in_prev_month - first_day + i;

        // identificador del día en formato UTC (NO ES IGUAL AL HORARIO PENINSULAR) 
        var key = new Date(current_shown_date.year, 
                           current_shown_date.month -1, prev_month_date).toUTCString();

        dates.push({key: key, 
                    date: prev_month_date, 
                    monthClass:'prev'});
    }


    // ///////////////////////////////////////////////////////////////////////////////////
    // Días del mes actual que mostrar en el calendario
    // Estos días tienen clase 'current', que se destacan con color de texto negro

    // Fecha de hoy
    var today = new Date();

    // Generar días del mes actual
    for (var i = 1; i <= total_days_in_month; i++)
    {
        var key = new Date(current_shown_date.year, 
                           current_shown_date.month, i).toUTCString();

        // Si el día es hoy, destacar con una clase
        if (i === today.getDate()  // igual día
            && current_shown_date.month === today.getMonth()  // igual mes
            && current_shown_date.year === today.getFullYear())  // igual año
        {
            dates.push({key: key, 
                        date: i, 
                        monthClass: 'current', 
                        todayClass: 'today'})
        }
        else  // Si el día no es hoy incorporar normalmente
        {
            dates.push({key: key, 
                        date: i, 
                        monthClass: 'current'});
        }
    }


    // ///////////////////////////////////////////////////////////////////////////////////
    // Si queda espacio disponible en la cuadrícula, añadir días del mes siguiente
    // Tiene clase 'next'

    if (dates.length < grid_size) 
    {
        var count = grid_size - dates.length;  // número de días a incorporar

        for (var i = 1; i <= count; i++)
        {
            var key = new Date(current_shown_date.year, 
                               current_shown_date.month + 1, i).toUTCString();

            dates.push({key: key, 
                        date: i, 
                        monthClass:'next'});
        }
    }

    return dates;
}



// Función que genera la estructura interna del HTML del calendario
function render()
{  
    var calendar = document.querySelector('[data-app=calendar-app]');

    // Construimos la estructura interna del HTML del calendario.

    // Está compuesta por un div clase 'calendar-nav' de la barra de navegación:
    // Este contiene dos botones para avanzar/retroceder el mes que se visualiza y 
    // el título del mes actual

    // El segundo div es 'calendar-grid', que incluye la rejilla del calendario en sí
    // misma. Los nombres de los días se insertan antes, en divs con clase específica.
    // Le siguen los divs de los días, con clase según si son del mes anterior, actual y
    // siguiente. Además se marca el día actual.

    calendar.innerHTML = `
        <div class="calendar-nav">
            <button id="prev-month"><i class="fa-solid fa-arrow-left"></i></button>
            <button id="current-month"><i class="fa-regular fa-calendar"></i></button>
            <button id="next-month"><i class="fa-solid fa-arrow-right"></i></button>
            <h2>${months[current_shown_date.month]} ${current_shown_date.year}</h2>
        </div>
        <div class="calendar-grid">
            ${days.map(day => `<div class="days-of-week">${day}</div>`).join('')}
            ${datesForGrid(current_shown_date.year, current_shown_date.month)
                .map(date => `<div id="${date.key}" 
                    class="${date.monthClass} ${date.todayClass ? date.todayClass : ''}">
                        <div class="day_header_wrapper">
                            <p>${date.date}</p>
                            <button class="create_task">+ task</button>
                        </div>
                        <div class="day_task_container"></div>
            </div>`).join('')}
        </div>
    `;
}



// Ejecuta todo lo necesario para generar el calendario
function showCalendar(prevNextIndicator) 
{
    // Fecha actual 
    var date = new Date(current_shown_date.year, 
                        current_shown_date.month + prevNextIndicator);

    // Actualizar la current_shown date con la fecha actual
    current_shown_date.year = date.getFullYear();
    current_shown_date.month = date.getMonth();
    
    // Generar el calendario
    render();
    
    // botones
    document.getElementById("prev-month").onclick = function(){prevMonth()};
    document.getElementById("next-month").onclick = function(){nextMonth()};
    document.getElementById("current-month").onclick = function(){currentMonth()};
    
    // drag & drop
    task_containers = document.getElementsByClassName("day_task_container");  // contenedores del día del mes actual
    create_buttons = document.getElementsByClassName("create_task");  // botones de creación de tareas

    makeGridDroppable();  // Hacer que se puedan arrastrar y soltar tareas
}



// FUNCIONES PARA LOS BOTONES DE NAVEGACIÓN DEL CALENDARIO

// Ejecutado cuando se pulsa el botón de mes siguiente
function prevMonth()
{
    showCalendar(-1);
}

// Ejecutado cuando se pulsa el botón de mes anterior
function nextMonth()
{
    showCalendar(1);
}

// Ejecutada cuando se pulsa el botón de mes actual
function currentMonth()
{
    // Vuelve a la fecha actual
    current_shown_date = {
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    }
    showCalendar(0);
}


// Generar y mostrar el mes actual en el calendario
showCalendar(0);



// ///////////////////////////////////////////////////////////////////////////////////////
/* FUNCIONALIDAD DE ARRASTRAR Y SOLTAR DEL CALENDARIO */


/* Eliminar un plan al pulsar en el botón de borrar plan */
function deletePlan(clicked_element)
{
    // this: botón detele_task
    // parentElement: plan
    clicked_element.parentElement.remove();
}



// Handler del evento de arrastrar un plan, almacena el último elemento arrastrado
var lastDragged;
function dragHandler(ev)
{
	lastDragged = ev.target;
}


// Añade un plan al contenedor correspondiente
var plan_counter = 1;
function addPlan()
{
	let plan = document.createElement("div");
	plan.classList.add("plan");

	//Permitir drag
	plan.addEventListener("dragstart", dragHandler);
	plan.setAttribute("draggable", true);
	
	//Temporal --Recoger user input
	plan.innerHTML = `<p>Plan ${plan_counter}</p>
                      <button title="Delete this plan" onclick="deletePlan(this)">
                          <i class="far fa-trash-alt"></i>
                      </button>`;
	plan_counter++;

    // Sube dos niveles hasta el día actual. Entonces, baja al contenedor "task containers" e inserta la tarea en ella.
	this.parentElement.parentElement.lastElementChild.appendChild(plan);
    // this: botón create_task
    // parentElement: div day_header_wrapper
    // parentElement: div current
    // lastElementChild: div day_task_container
}


// calcula el día objetivo del drop
function getTargetDay(obj){
	let tmp = obj;
	while(tmp.parentElement != null && !tmp.classList.contains("day_task_container")){
		tmp = tmp.parentElement;
	}
	return tmp;
}


//Buscar elemento al que precederemos en la lista por posicion dentro de una lista
function calculateNext(event, listElements, horizontal){
	//Buscar la X más cercana al evento
	let i = 0;
	if(horizontal){
		while(i < listElements.length && (centroid(listElements[i]).x-event.pageX) < 0){
			i++;
		}
	}
	else{
		//Devolver el primer positivo
		while(i < listElements.length && (centroid(listElements[i]).y-event.pageY) < 0){
			i++;
		}
	}
	if(i < listElements.length) return listElements[i];
	else return null;
}


// Calcula el centroide del div
function centroid(element){
	let rect = element.getBoundingClientRect();
	return {
		x: window.scrollX + (rect.left + rect.right)/2,
		y: window.scrollY + (rect.top + rect.bottom)/2
	
	};
}


// Predecir si la lista está en horizontal o vertical con dos elementos
function listOrientation_horizontal(a, b){
    if(!a || !b) return true;
    const dx = Math.abs(centroid(a).x - centroid(b).x);
    const dy = Math.abs(centroid(a).y - centroid(b).y);
    return dx > dy;
   }


// elemento de pista visual del drop de la tarea
var plan_cue = document.createElement('div');
plan_cue.setAttribute("class", "plan_cue");
plan_cue.innerHTML = "";  // Vacío en este caso, sólo pista visual (línea gris)


// Handler del evento dragover
function dragOverHandler(ev)
{
	ev.preventDefault();

	// Si arrastramos un plan
	if(lastDragged.classList.contains("plan"))
    {
		let destination_day = getTargetDay(ev.target);
		if(destination_day != null)
        {
            // Lista de elementos en el contenedor de destino
			let listElements = destination_day.getElementsByClassName("plan");

		    // Insertamos el plan_cue preventivamente al final, nos sirve para calcular si es horizontal la lista
            destination_day.insertBefore(plan_cue, destination_day.lastElementChild);
			var orientacion = listOrientation_horizontal(listElements[0], plan_cue);
			let next = calculateNext(ev, listElements, orientacion);
		    
            // Si no le toca al final corregimos la posición
			if(next != null) {
                destination_day.insertBefore(plan_cue, next);
            }
			plan_cue.hidden = false;  // esconder la pista visual
		}
	}
}


// Handler del evento drop
function dragLeaveHandler(ev)
{
	ev.preventDefault();
	plan_cue.hidden = true;
}


// Handler del evento drop
function dropHandler(ev)
{
	ev.preventDefault();

    // Si arrastramos un plan
	if(lastDragged.classList.contains("plan"))
    {
		let destination_day = getTargetDay(ev.target);
		if(destination_day != null)
        {
            // Lista de elementos en el contenedor de destino
			let listElements = destination_day.getElementsByClassName("plan");

            // Insertamos el plan_cue preventivamente al final, nos sirve para calcular si es horizontal la lista
            destination_day.insertBefore(plan_cue, destination_day.lastElementChild);
			var orientacion = listOrientation_horizontal(listElements[0], plan_cue);
			let next = calculateNext(ev, listElements, orientacion);

            // Si no le toca al final corregimos la posición			
			if(next != null) {
                destination_day.insertBefore(lastDragged, next);
            } else {
                destination_day.insertBefore(lastDragged, destination_day.lastElementChild);
            }
		}
	}
	plan_cue.hidden = true;
	lastDragged = 0;
}


// Se pueden soltar elementos en la rejilla
function makeGridDroppable() 
{
    // Handler de soltar elementos
    for (var i = 0; i < task_containers.length; i++)
    {
        task_containers[i].ondragenter = function(e) { e.preventDefault(); };
        task_containers[i].ondragover = dragOverHandler;
        task_containers[i].ondraleave = function(e) { e.preventDefault(); };
        task_containers[i].ondrop = dropHandler;  // al soltar sobre el contenedor
    }

    // Botones de crear tareas
    for (var i = 0; i < create_buttons.length; i++)
    {
        create_buttons[i].onclick = addPlan;
    }
}

