
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

function addPlan(){
	console.log(this.innerHTML);
}