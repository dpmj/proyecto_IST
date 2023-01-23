
/* Esperamos a que cargar el DOM -> Añadimos las categorias, listas de planes y planes que tocan */
var categorias_html;
document.addEventListener('DOMContentLoaded',
	function(){
		categorias_html = document.querySelector('#lista_categorias');
		categorias_html.addEventListener("dragover", allowDrop);
		categorias_html.addEventListener("dragend", drop);
		categorias_html.addEventListener("dragend", dragCanceled);
		addCategory("Tareas del hogar");
		addCategory("Lista de la compra");
	}
);

var tareas_hogar=["Poner lavavajillas", "Limpiar baño", "Doblar ropa"];
var compra = ["Huevos", "Pan"];

var listas =[tareas_hogar, compra];
//Soporte para editar cosas
function edit(event){
	if(event.target.nodeName== "P"){
		textBox(event.target);
	}
	else if(event.target.classList.contains("plan")){
		console.log(event.target);
		textBox(event.target.getElementsByTagName("P")[0]);
	}
}

//Lo siento, Juan :^)
var editing = null;
var input = document.createElement("input");
input.id="input_id"
input.addEventListener("keydown", (event)=>{
	if(event.key=="Enter" && editing != null){
		replaceText();
	}
	else if(event.key == "Escape"){
		restoreText();
	}
});
input.addEventListener("blur", replaceText);
function restoreText(){
	if(editing != null){
		input.hidden = true;
		editing.style.display = "";
		editing.parentNode.style.display = "";
		getCategoria(editing).setAttribute("draggable", true);
	}
	//editing=null;
}

function replaceText(){
	if(editing != null){
		//caso especial para plan
		if(editing.classList.contains("plan")){
			editing.getElementsByTagName("P")[0].innerHTML =input.value;
			editing.parentNode.style.display = "";
		}
		else{
			editing.innerHTML = input.value;
		}
		input.hidden = true;
		editing.style.display = "";
		getCategoria(editing).setAttribute("draggable", true);
	}
	//editing=null;
}

function textBox(element){
	//El elemento será reemplazado por un input temporalmente
	//Comprobar si es un p de plan - funciona diferente
	input.value = element.innerHTML;
	if(element.parentElement.classList.contains("plan")){
		editing = element.parentElement;
	 	editing.parentNode.insertBefore(input, editing);
	 	editing.style.display = "none";
	}
	else{
	 	editing = element; 
	 	element.parentNode.insertBefore(input, element);
	 	editing.style.display = "none";
	}
	 input.value = element.innerHTML;
	 input.hidden = false;
	 //Para poder seleccionar texto arrastrando
	 getCategoria(editing).setAttribute("draggable", false);
	
	document.getElementById("input_id").focus();
}
//Fin del soporte para editar cosas

var cat_counter = 0;
function addCategory(nombre, planes){
	let categoria = document.createElement("div");
	categoria.classList.add("categoria");

	//Permitir drop y drag
	categoria.setAttribute("draggable", true);
	categoria.addEventListener("dragstart", drag);
	categoria.addEventListener("dragover", allowDrop);
	categoria.addEventListener("drop", drop);
	categoria.addEventListener("dragend", dragCanceled);
	
	//editar texto de elementos
	categoria.addEventListener("click", edit);

	let p = document.createElement("p");
	if(typeof nombre !== 'undefined'){
		p.innerHTML = nombre;
	}
	else{
		p.innerHTML = "Category " + cat_counter;
		cat_counter++;
	}

	
	//Añadir boton de borrado
	let div_header = document.createElement("div");
	let del_btn = document.createElement("button");
	del_btn.innerHTML = "<i class=\"far fa-trash-alt\"></i>";
	del_btn.addEventListener("mouseup", 
	(event)=>{
		getCategoria(event.target).remove();
	});
	div_header.appendChild(del_btn);
	categoria.appendChild(p);
	categoria.appendChild(div_header);

	//Crear y añadir boton de Añadir plan
	let btn = document.createElement("button");
	btn.innerHTML = "+ Add plan"
	btn.addEventListener("click", addPlan); 
	categoria.appendChild(btn);

	categorias_html.insertBefore(categoria, categorias_html.lastElementChild);

	//Crear y añadir lista de planes (si existe)
	if(typeof listas[cat_counter] !== 'undefined' && listas.length > 0){
		//Recorremos la lista e insertamos planes
		for(var j = 0; j < listas[cat_counter].length; j++){
			addPlan(listas[cat_counter][j], categoria);
		}
	}
			
	cat_counter++;
}

var plan_counter = 1;
function addPlan(texto, categoria){
	let plan = document.createElement("div");
	plan.classList.add("plan");

	//Permitir drag
	plan.addEventListener("dragstart", drag);
	plan.setAttribute("draggable", true);
	
	//Temporal --Recoger user input
	let p = document.createElement("p");
	if(typeof texto !== 'undefined'){
		p.innerHTML = texto;
		plan_counter++;
	}
	else{
		p.innerHTML = "Plan "+plan_counter;
		plan_counter++;
	}
	plan.appendChild(p);

	let del_btn = document.createElement("button");
	del_btn.innerHTML = "<i class=\"far fa-trash-alt\"></i>";
	del_btn.addEventListener("mouseup", 
	(event)=>{
		event.target.parentElement.parentElement.remove();
	});
	plan.appendChild(del_btn);

	if(typeof categoria !== 'undefined'){
		categoria.insertBefore(plan, categoria.lastElementChild);
	}
	else{
		this.parentElement.insertBefore(plan, this);
	}
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

