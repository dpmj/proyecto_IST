
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

function allowDrop(event){
	event.preventDefault();
}

var lastDragged;
function drag(ev){
	lastDragged = ev.target;
}

function drop(ev){//Filtrar segun que se ha movido y donde se quiere soltar
	//Tambien hay que insertar según la posición relativa donde se suelte
	if(lastDragged.classList.contains("plan")){//Si arrastramos un plan
		let categoria = getCategoria(ev.target);
		if(categoria != null){//Sobre una categoria
			categoria.insertBefore(lastDragged, categoria.lastElementChild);		
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
