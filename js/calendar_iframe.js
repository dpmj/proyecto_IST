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
                        ${date.date}
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

    document.getElementById("prev-month").onclick = function(){prevMonth()};
    document.getElementById("next-month").onclick = function(){nextMonth()};
    document.getElementById("current-month").onclick = function(){currentMonth()};
}



// Generar y mostrar el mes actual en el calendario
showCalendar(0);



// FUNCIONES PARA LOS BOTONES

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



