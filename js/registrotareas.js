// Obtener el formulario y el botón de envío
const form = document.getElementById('nueva_tarea');
const submitButton = form.querySelector('input[type="submit"]');
let campos = ["name","descripcion"];

//Añadir un manejador de evento para el evento de envío del formulario
submitButton.addEventListener('click', (event) => {
	const botones = form.querySelectorAll('input[type="radio"]');

	//obtener todos los campos de texto del formulario
	verificar(event, campos, botones);

	//Si se han rellenado todos los campos, se visualiza la pagina index.html
	abrirnuevapagina(); 
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
	event.preventDefault();
}

function abrirnuevapagina(){
	window.location.assign('index.html');
}
