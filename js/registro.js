// Obtener el formulario y el botón de envío
const form = document.getElementById('formulario');
const submitButton = form.querySelector('input[type="submit"]');
let campos = ["name", "email", "password", "confirm-password", "country"];
var count=0;

// Adición del prefijo del país correspondiente
const select = document.querySelector('#country');
const input = document.querySelector('#prefix');
select.addEventListener('change', () => {
	const prefijo = select.value;
	input.placeholder = prefijo;
});

//Añadir un manejador de evento para el evento de envío del formulario
submitButton.addEventListener('click', (event) => {
	const fields = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="radio"], input[type="country"], input[type="checkbox"]');
	const botones = form.querySelectorAll('input[type="radio"]');
	const check1 = form.querySelectorAll('input[type="checkbox"].inter');
	const check2 = form.querySelectorAll('input[type="checkbox"].otro');

	//Mensaje mostrado diciendo que las contraseñas no son correctas
	const pass = form.querySelectorAll('input[type="password"]');
	const message = document.querySelector('#igualdad'); //seleccionamos div con id igualdad
	if(pass[0].value!==pass[1].value){
		message.textContent = 'Passwords are not the same';
		message.setAttribute('style', 'color:red');
	}else{
		message.textContent = '';
	}

	//obtener todos los campos de texto del formulario
	verificar(event, campos, botones, check1, check2);

/////////////////////////////////////////////////////////////////JSON///////////////////////////////////////////////////////
	// Crear un objeto FormData a partir del formulario
	var formData = new FormData(form);
	// Convertir el FormData en un objeto JSON
	var json = JSON.stringify(Object.fromEntries(formData));
	// Hacer algo con el objeto JSON
    console.log(json);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	
});


function verificar(event, campos, botones, check1, check2) {
	//Iterar a través de los campos de texto
	for (var i = 0; i < campos.length; i++) {
		elem = campos[i];
		var field = document.getElementById(elem);
		//Si el campo está vacío, muestra mensaje de error
		if (field.value === "") {
			alert('There is an empty field in the form');
			//prevenir el envío del formulario
			event.preventDefault();
			return
		}
	}

	radio_check(event,botones,check1,check2);
}

function radio_check(event,botones,check1,check2){
	const noneChecked_boton = Array.prototype.every.call(botones, botones => !botones.checked); // devuelve true si ningún elemento de entrada de tipo radio ha sido marcado
	const noneChecked_check1 = Array.prototype.every.call(check1, check1 => !check1.checked); // devuelve true si ningún elemento de entrada de tipo checkbox ha sido marcado
	const noneChecked_check2 = Array.prototype.every.call(check2, check2 => !check2.checked); // devuelve true si ningún elemento de entrada de tipo checkbox ha sido marcado

	if (noneChecked_boton == true) {
		alert('There is an empty field in the form');
		event.preventDefault();
		return
	}
	if (noneChecked_check1 == true) {
		alert('There is an empty field in the form');
		event.preventDefault();
		return
	}
	if (noneChecked_check2 == true) {
		alert('There is an empty field in the form');
		event.preventDefault();
		return
	}

	//Si están todos los campos rellenados, se envía el formulario
	alert('Form successfully submitted')
	count=1;
	abrirnuevapagina();
	event.preventDefault();
	return
}
	

function abrirnuevapagina(){
	window.location.assign('index.html');
}
