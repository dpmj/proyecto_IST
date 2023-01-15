
/* Esperamos a que cargar el DOM -> Añadimos las categorias, listas de planes y planes que tocan */
var categorias_html;
document.addEventListener('DOMContentLoaded',
	function(){
		categorias_html = document.querySelector('#lista_categorias');
		addCategory("Categoria A");
		addCategory("Categoria B");
	}
);

var cat_counter = 1;
function addCategory(nombre, planes){
	let categoria = document.createElement("div");
	categoria.classList.add("categoria");

	//Permitir drop y drag
	categoria.setAttribute("draggable", true);
	categoria.addEventListener("dragover", allowDrop);
	categoria.addEventListener("drop", drop);
	
	let p = document.createElement("p");
	if(typeof nombre !== 'undefined'){
		p.innerHTML = nombre;
	}
	else{
		p.innerHTML = "Categoria "+cat_counter;
		cat_counter++;
	}
	categoria.appendChild(p);

	//Crear y añadir lista de planes (si existe)
	if(typeof planes !== 'undefined' && planes.length > 0){
		//Crear lista y añadir planes
	}

	//Crear y añadir boton de Añadir plan
	let btn = document.createElement("button");
	btn.innerHTML = "+ Añadir plan"
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
function calculateNext(event, listElements){
	if(listElements.length < 2) return listElements[0];
	//Buscar la X más cercana al evento
	let i = 0;
	if(listOrientation_horizontal(listElements[0], listElements[1])){
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
plan_cue.innerHTML = "<p>Drop Here<p>";

function allowDrop(event){
	event.preventDefault();
	plan_cue.hidden = false;
	//Para planes
	let categoria = getCategoria(event.target);
	if(categoria != null){
		//Comprobar si la lista es horizontal o vertical
		//Horizontal -> comparar X, vertical -> comparar Y
		let listElements = categoria.getElementsByClassName("plan");
		let next = calculateNext(event, listElements);
		if(next == null) categoria.insertBefore(plan_cue, categoria.lastElementChild);
		else categoria.insertBefore(plan_cue, next);
		//listOrientation_horizontal(a, b);
		
	}
	//console.log(event);
	//console.log(event.x + event.y);

	//Para categorias
}

var lastDragged;
function drag(ev){
	lastDragged = ev.target;
	
}

function drop(ev){//Filtrar segun que se ha movido y donde se quiere soltar
	//Tambien hay que insertar según la posición relativa donde se suelte
	
	if(lastDragged.classList.contains("plan")){//Si arrastramos un plan
	plan_cue.hidden = true;
		let categoria = getCategoria(ev.target);
		if(categoria != null){//Sobre una categoria
			let listElements = categoria.getElementsByClassName("plan");
			let next = calculateNext(ev, listElements);
			if(next == null) categoria.insertBefore(lastDragged, categoria.lastElementChild);
			else categoria.insertBefore(lastDragged, next);		
		}
	}
	else if(lastDragged.classList.contains("categoria")){//Si arrastramos una categoria
		
	}
	lastDragged=0;
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
