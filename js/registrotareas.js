// Obtener el formulario y el botón de envío
const form = document.getElementById('nueva_tarea');
const submitButton = form.querySelector('input[type="submit"]');
let campos = ["name","descripcion"];

//Añadir un manejador de evento para el evento de envío del formulario
submitButton.addEventListener('click', (event) => {

	//Mensaje mostrado diciendo que las contraseñas no son correctas
	const fields = form.querySelectorAll('input[type="text"], input[type="date"], input[type="radio"]');
	var textarea = document.getElementById("descripcion");
	const message = document.querySelector('#igualdad'); //seleccionamos div con id igualdad
	if(fields[0].value == "" || fields[1].value == "" || fields[2].value == false){
		message.textContent = 'There is an empty field';
		message.setAttribute('style', 'color:red');
	}else{
		message.textContent = '';
	}
	if (textarea.value === "") {
		message.textContent = 'There is an empty field';
		message.setAttribute('style', 'color:red');
	}else{
		message.textContent = '';
	}

	const botones = form.querySelectorAll('input[type="radio"]');

	//obtener todos los campos de texto del formulario
	verificar(event, campos, botones); 
});


function verificar(event, campos, botones) {
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

	const noneChecked_boton = Array.prototype.every.call(botones, botones => !botones.checked); // devuelve true si ningún elemento de entrada de tipo radio ha sido marcado
	
	if (noneChecked_boton == true) {
		alert('There is an empty field in the form');
		event.preventDefault();
		return
	}

	var x = document.getElementById("delivery-date").value;
    var today = new Date();
    if (x == "") {
        alert("The delivery date is obligatory");
        return false;
    }
    else if(new Date(x) < today){
        alert("the delivery date must be equal to or greater than today's date.");
        return false;
    }

	//Si están todos los campos rellenados, se envía el formulario
	alert('Form successfully submitted');
	//Si se han rellenado todos los campos, se visualiza la pagina index.html
	abrirnuevapagina();
	event.preventDefault();
	return

}

function abrirnuevapagina(){
	window.location.assign('index.html');
}
