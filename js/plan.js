
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
		if(ev.target.classList.contains("plan")){//Sobre otro plan
			ev.target.parentElement.insertBefore(lastDragged, ev.target.nextSibling);		
		}
		if(ev.target.classList.contains("categoria")){//Sobre una categoria
			ev.target.insertBefore(lastDragged, ev.target.lastElementChild);		
		}
	}
	else if(lastDragged.classList.contains("categoria")){//Si arrastramos una categoria
		
	}
	lastDragged=0;
}


