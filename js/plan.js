
/* Esperamos a que cargar el DOM -> Añadimos las categorias, listas de planes y planes que tocan */
var categorias_html;
document.addEventListener('DOMContentLoaded',
	function(){
		categorias_html = document.querySelector('#lista_categorias');
		categorias_html.addEventListener("dragover", allowDrop);
		categorias_html.addEventListener("dragend", drop);
		categorias_html.addEventListener("dragend", dragCanceled);
		addCategory("Category A");
		addCategory("Category B");
	}
);

var cat_counter = 1;
function addCategory(nombre, planes){
	let categoria = document.createElement("div");
	categoria.classList.add("categoria");

	//Permitir drop y drag
	categoria.setAttribute("draggable", true);
	categoria.addEventListener("dragstart", drag);
	categoria.addEventListener("dragover", allowDrop);
	categoria.addEventListener("drop", drop);
	categoria.addEventListener("dragend", dragCanceled);
	
	let p = document.createElement("p");
	if(typeof nombre !== 'undefined'){
		p.innerHTML = nombre;
	}
	else{
		p.innerHTML = "Category " + cat_counter;
		cat_counter++;
	}
	categoria.appendChild(p);

	//Crear y añadir lista de planes (si existe)
	if(typeof planes !== 'undefined' && planes.length > 0){
		//Crear lista y añadir planes
	}

	//Crear y añadir boton de Añadir plan
	let btn = document.createElement("button");
	btn.innerHTML = "+ Add plan"
	btn.addEventListener("click", addPlan); 
	categoria.appendChild(btn);

	categorias_html.insertBefore(categoria, categorias_html.lastElementChild);
}

var plan_counter = 1;
function addPlan(){
	let plan = document.createElement("div");
	plan.classList.add("plan");

	//Permitir drag
	plan.addEventListener("dragstart", drag);
	plan.setAttribute("draggable", true);
	
	//Temporal --Recoger user input
	plan.innerHTML = "Plan "+plan_counter;
	plan_counter++;

	this.parentElement.insertBefore(plan, this);
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

// Objeto de pista visual de dónde se va a soltar el plan
var plan_cue = document.createElement('div');
plan_cue.setAttribute("class", "plan_cue");
plan_cue.innerHTML = "<p>Drop Here</p>";

var category_cue = document.createElement('div');
category_cue.setAttribute("class", "category_cue");

function allowDrop(event){
	event.preventDefault();
	//Para planes
	if(lastDragged.classList.contains("plan")){
		let categoria = getCategoria(event.target);
		if(categoria.classList.contains("categoria")){
		//Comprobar si la lista es horizontal o vertical
		//Horizontal -> comparar X, vertical -> comparar Y
			let listElements = categoria.getElementsByClassName("plan");
		//Insertamos el plan_cue preventivamente al final, nos sirve para calcular si es horizontal la lista
			categoria.insertBefore(plan_cue, categoria.lastElementChild);
			var orientacion = listOrientation_horizontal(listElements[0], plan_cue);
			let next = calculateNext(event, listElements, orientacion);
		//Si no le toca al final corregimos
			if(next != null) categoria.insertBefore(plan_cue, next);
			plan_cue.hidden = false;
		}
	}
	//Para categorias
	else if(lastDragged.classList.contains("categoria")){//Si arrastramos una categoria
		categorias_html.insertBefore(category_cue, categorias_html.lastElementChild);
		let listElements = categorias_html.getElementsByClassName("categoria");
		var orientacion = listOrientation_horizontal(listElements[0], category_cue);
		let next = calculateNext(event, listElements, orientacion);

		//Si no le toca al final corregimos
		if(next != null){
			//Comprobamos si lastDragged ya es el ultimo elemento

			categorias_html.insertBefore(category_cue, next);
		}
		else{
			//Comprobamos si el next es lastDragged
			console.log("El ultimo");
		}
		category_cue.hidden = false;
	}
}


var lastDragged;
function drag(ev){
	lastDragged = ev.target;
	lastDragged.classList.add("active_plan");
}

function dragCanceled(ev){
	if(lastDragged==0) return;
	plan_cue.hidden = true;
	category_cue.hidden = true;
	
	lastDragged.classList.remove("active_plan");
	lastDragged=0;
}

function drop(ev){//Filtrar segun que se ha movido y donde se quiere soltar
	//Tambien hay que insertar según la posición relativa donde se suelte
	if(lastDragged==0) return;
	if(lastDragged.classList.contains("plan")){//Si arrastramos un plan
		let categoria = getCategoria(ev.target);
		if(categoria != null){//Sobre una categoria
			let listElements = categoria.getElementsByClassName("plan");
			categoria.insertBefore(plan_cue, categoria.lastElementChild);
			var orientacion = listOrientation_horizontal(listElements[0], plan_cue);
			let next = calculateNext(ev, listElements, orientacion);
			if(next != null) categoria.insertBefore(lastDragged, next);
			else categoria.insertBefore(lastDragged, categoria.lastElementChild);
		}
	}
	else if(lastDragged.classList.contains("categoria")){//Si arrastramos una categoria
		let listElements = categorias_html.getElementsByClassName("categoria");
		categorias_html.insertBefore(category_cue, categorias_html.lastElementChild);
		var orientacion = listOrientation_horizontal(listElements[0], category_cue);
		let next = calculateNext(ev, listElements, orientacion);
		//Si no le toca al final corregimos
		if(next != null){
			categorias_html.insertBefore(lastDragged, next);
		}
		else{
			categorias_html.insertBefore(lastDragged, categorias_html.lastElementChild);
		}
	}
}

function getCategoria(objeto){
	let tmp = objeto;
	while(tmp.parentElement != null && !tmp.classList.contains("categoria")){
		tmp = tmp.parentElement;
	}
	return tmp;
}

function centroid(element){
	let rect = element.getBoundingClientRect();
	return {
		x: window.scrollX + (rect.left + rect.right)/2,
		y: window.scrollY + (rect.top + rect.bottom)/2
	
	};
}

//Predecir si la lista está en horizontal o vertical con dos elementos
function listOrientation_horizontal(a, b){
 if(!a || !b) return true;
 const dx = Math.abs(centroid(a).x - centroid(b).x);
 const dy = Math.abs(centroid(a).y - centroid(b).y);
 return dx > dy;
}

//Distancia entre cursor y elemento tras evento
function dist(evt, centroid){
	
}
