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


/* FUNCIÓN DE GENERACIÓN DEL CALENDARIO */


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
    loadDefaultTasks();  // Carga las tareas por defecto
}

// Ejecutado cuando se pulsa el botón de mes anterior
function nextMonth()
{
    showCalendar(1);
    loadDefaultTasks();  // Carga las tareas por defecto
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
    loadDefaultTasks();  // Carga las tareas por defecto
}


// Generar y mostrar el mes actual en el calendario
showCalendar(0);


// Fin funciones de generación del calendario
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

    // Atributos de usuario
	plan.setAttribute("data-user", "all");

    // Para editar el texto de los elementos
    plan.addEventListener("click", edit);
	
    // Contenido del html con texto placeholder
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


// Fin funciones de gestión del drag and drop 
// ///////////////////////////////////////////////////////////////////////////////////////


/* FUNCIONES ASOCIADAS A LOS BOTONES DEL NAV ASIDE: FILTRADO POR USUARIOS */

// Recepción de mensajes desde el padre
// Código de:
// https://stackoverflow.com/questions/61548354/how-to-postmessage-into-iframe

(function() 
{
    "use strict";
    window.addEventListener("message", (event) => {
        if (event.data && event.data.sender == "user_filter")
        {
            // Al recibir mensaje, filtrar por usuario
            filterByUser(event.data.message);
        }
    });
})();


/* Filtra la visibilidad de los elementos */
function filterByUser(user) 
{
    // Todos los planes mostrados en pantalla
    let plans = document.getElementsByClassName("plan");

    if (plans != null)
    {
        for (var i = 0; i < plans.length; i++) 
        {
            if (user == "all") {
                plans[i].style.visibility = "visible";
                plans[i].style.display = "block";  // para chrome
            }
            else 
            {
                if (plans[i].getAttribute("data-user") == user) {
                    plans[i].style.visibility = "visible";
                    plans[i].style.display = "block";  // para chrome
                }
                else {
                    plans[i].style.visibility = "collapse";
                    plans[i].style.display = "none";  // para chrome
                }
            }
        }
    }
}


// Fin funciones de gestión de los mensajes procedentes del documento padre
// ///////////////////////////////////////////////////////////////////////////////////////



/* PERMITIR EDITAR EL CONTENIDO DE LOS ELEMENTOS PLAN */
// NOTA: portado de plan.js y adaptado al calendario

var editing = null;
var input = document.createElement("input");

input.id = "input_id"
input.addEventListener("keydown", (event)=>
{
	if(event.key=="Enter" && editing != null) {
		replaceText();
	}
	else if(event.key == "Escape") {
		restoreText();
	}
});

input.addEventListener("blur", replaceText);

function textBox(element) 
{
	//El elemento será reemplazado por un input temporalmente
	//Comprobar si es un p de plan - funciona diferente

	input.value = element.innerHTML;

	if (element.parentElement.classList.contains("plan"))
    {
		editing = element.parentElement;
	 	editing.parentNode.insertBefore(input, editing);
	 	editing.style.display = "none";
	}

    input.value = element.innerHTML;
    input.hidden = false;
    //Para poder seleccionar texto arrastrando
	
	document.getElementById("input_id").focus();
}

function edit(event){
	if (event.target.nodeName== "P")
    {
		textBox(event.target);
	}
	else if (event.target.classList.contains("plan"))
    {
		textBox(event.target.getElementsByTagName("P")[0]);
	}
}


function restoreText()
{
	if (editing != null){
		input.hidden = true;
		editing.style.display = "";
		editing.parentNode.style.display = "";
	}
}

function replaceText(){
	if(editing != null)
    {
		if(editing.classList.contains("plan"))
        {
			editing.getElementsByTagName("P")[0].innerHTML =input.value;
			editing.parentNode.style.display = "";
		}
		input.hidden = true;
		editing.style.display = "";
	}
}


// Fin funciones de edición del contenido de los planes
// ///////////////////////////////////////////////////////////////////////////////////////



/* TAREAS POR DEFECTO */


/* Carga las tareas por defecto en el calendario */
function loadDefaultTasks() 
{

    // Recorre el vector de tareas por defecto
    for (var i = 0; i < default_tasks.length; i++)
    {
        // identificador de en qué día colocar el plan
        let key = new Date(default_tasks[i].date).toUTCString();
        // Elemento HTML del día
        let day_HTML = document.getElementById(key);  

        if (day_HTML != null)  // Si el día existe
        {
            // Crear plan
            let plan = document.createElement("div");
            plan.classList.add("plan");

            // Permitir drag
            plan.addEventListener("dragstart", dragHandler);
            plan.setAttribute("draggable", true);

            // Atributo de usuario
            plan.setAttribute("data-user", default_tasks[i].user)

            // Para editar el texto de los elementos
            plan.addEventListener("click", edit);

            // Contenido interno
            plan.innerHTML = `<p>${default_tasks[i].title}</p>
                            <button title="Delete this plan" onclick="deletePlan(this)">
                                <i class="far fa-trash-alt"></i>
                            </button>`;

            day_HTML.lastElementChild.appendChild(plan);  // Insertar plan
        }
    }
}


// Fin funciones de gestión de las tareas por defecto
// ///////////////////////////////////////////////////////////////////////////////////////


/* TAREAS POR DEFECTO */

/* Vector de objetos de javascript. Se muestran al cargar la página */

var default_tasks = [
    {
        title: "Poner lavavajillas",
        date: "2023/01/20",
        user: "user1"
    },
    {
        title: "Limpiar baño",
        date: "2023/01/20",
        user: "user1"
    },
    {
        title: "Doblar ropa",
        date: "2023/01/29",
        user: "user2"
    },
    {
        title: "Limpiar cocina",
        date: "2023/01/25",
        user: "user2"
    },
    {
        title: "Revisar proyecto",
        date: "2023/01/26",
        user: "user3"
    },
    {
        title: "Recuperaciones",
        date: "2023/02/06",
        user: "all"
    },
    {
        title: "Grabar vídeo",
        date: "2023/01/24",
        user: "all"
    },
    {
        title: "Examen CHS",
        date: "2023/01/24",
        user: "all"
    },
    {
        title: "Examen ESC",
        date: "2023/01/27",
        user: "all"
    },
    {
        title: "Examen TIE",
        date: "2023/02/01",
        user: "all"
    },
    {
        title: "Examen PSCA",
        date: "2023/01/31",
        user: "all"
    },
    {
        title: "Examen IST",
        date: "2023/01/30",
        user: "all"
    },
    {
        title: "Estudiar",
        date: "2023/01/09",
        user: "all"
    },
    {
        title: "Reyes magos",
        date: "2023/01/06",
        user: "all"
    },
    {
        title: "Pasar apuntes a limpio",
        date: "2023/01/11",
        user: "user1"
    },
    {
        title: "Llamar al banco",
        date: "2023/01/11",
        user: "user3"
    },
    {
        title: "Prácticas",
        date: "2023/01/13",
        user: "user2"
    },
    {
        title: "Proyecto CHS",
        date: "2023/01/16",
        user: "all"
    },
    {
        title: "Navidad",
        date: "2022/12/25",
        user: "all"
    },
    {
        title: "Nochebuena",
        date: "2022/12/24",
        user: "all"
    },
    {
        title: "Año nuevo",
        date: "2023/01/01",
        user: "all"
    },
    {
        title: "Cumpleaños Pepito",
        date: "2023/01/21",
        user: "user4"
    },
    {
        title: "Feliz jueves",
        date: "2023/02/02",
        user: "user4"
    },
    {
        title: "Proyecto IST",
        date: "2023/01/30",
        user: "all"
    },
    {
        title: "Reunión Tuna",
        date: "2023/02/15",
        user: "user1"
    },
    {
        title: "Día de andalucía",
        date: "2023/02/28",
        user: "all"
    },
    {
        title: "Poner lavavajillas",
        date: "2023/02/18",
        user: "user1"
    },
    {
        title: "Limpiar baño",
        date: "2023/02/07",
        user: "user1"
    },
    {
        title: "Doblar ropa",
        date: "2023/02/05",
        user: "user2"
    },
    {
        title: "Doblar ropa",
        date: "2023/02/05",
        user: "user5"
    },
    {
        title: "Felicitar al abuelo",
        date: "2023/01/03",
        user: "user5"
    },
    {
        title: "Limpiar cocina",
        date: "2023/02/22",
        user: "user2"
    },
];

loadDefaultTasks();



