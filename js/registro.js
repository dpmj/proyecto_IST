// Obtener el formulario y el botón de envío
const form = document.getElementById('formulario');
const titulo_form = document.getElementById("titulo_formulario");  
const submitButton = form.querySelector('input[type="submit"]');

// Variables globales
var count_gender = 0;
var count_interests = 0;
var count_news = 0;
var elements = form.elements;

// Adición del prefijo del país correspondiente
const select = document.querySelector('#country');
const input = document.querySelector('#prefix');
select.addEventListener('change', () => {
	const prefijo = select.value;
	input.placeholder = prefijo;
});

// iframe donde mostrar la respuesta del servidor
const iframe_respuesta = document.getElementById("form_response");  


//Añadir un manejador de evento para el evento de envío del formulario
submitButton.addEventListener('click', (event) => {
	
	// Creación del vector de objetos JS
	let formElements = form.elements; //recoger los elementos del formulario
	let formDataArray = []; //crear un vector vacío

	for(let i = 0; i < formElements.length; i++) {
		let obj = {};
		obj[formElements[i].name] = formElements[i].value;
		// agregar el vector al objeto
		formDataArray.push(obj);
	}
	console.log(formDataArray);

	// Mensaje mostrado diciendo que las contrasenyas no son correctas
	const message = document.querySelector('#igualdad'); //seleccionamos div con id igualdad
	contrasenyas(formDataArray,message); // Primera funcion donde se trabaja con un vector de tipo Javascript

	//Comparacion para ver si hay algún campo del formulario vacío
	verificar(event,formDataArray);
	
});

// Funcion de comparación de las contraseñas
function contrasenyas(obj,message){

	let val = Object.values(obj); 

	let pass1 = Object.values(val[4]);
	let pass2 = Object.values(val[5]);

	if(pass1[0] === pass2[0]){
		message.textContent = '';
	}else{
		message.textContent = 'Passwords are not the same';
		message.setAttribute('style', 'color:red');
	}
}

// Funcion de verificación de los elementos del registro
function verificar(event,obj) {

	let valores = Object.values(obj); 
	var longitud = valores.length;
	var errorMensaje = "";
	//console.log(Object.values(valores[13]))
	
	for(let i=0; i<= (longitud-2); i++){

		let casilla = Object.values(valores[i]);

		if(i<=5){
			if(casilla == ""){
				alert('There is an empty field in the form');
				//prevenir el envío del formulario
				event.preventDefault();
				return
			}
		}else{
			if(i<=8){
				if(casilla != "" ){
					count_gender = count_gender + 1;
				}
			}else{
				if(i<=11){
					if(casilla != "" ){
						count_interests = count_interests + 1;
					}
				}else{
						if(casilla != "" ){
							count_news = count_news + 1;
						}
				}
			}
		}
	}

	if((count_gender == 0) || (count_interests == 0) || (count_news == 0)){
		alert('There is an empty field in the form');
		//prevenir el envío del formulario
		event.preventDefault();
		return
	}

	// Si está todo completo, se envía el formulario
	alert('Form succesfully submitted');
	//prevenir el envío del formulario
	enviarFormularioServidor();  // Una vez comprobados los campos, se envía el formulario al servidor flask
	event.preventDefault();
	return
}
	

/**
 * Envía los datos al servidor Flask e interpreta la respuesta
 */
function enviarFormularioServidor()
{
	var url = "http://127.0.0.1:5000/form_response"  // URL de nuestro servidor flask
	var return_data;  // Datos de vuelta desde el servidor

	var formData = new FormData(form);  // Convertir el FormData en un objeto JSON
	var send_data = JSON.stringify(Object.fromEntries(formData));  // Datos del formulario a enviar

	var xhr = new XMLHttpRequest();  // Objeto XML HTTP del navegador para realizar peticiones HTTP

	xhr.responseType = 'document';  // De vuelta viene un documento HTML

	// Cuando se reciba la respuesta, esta sección de código se ejecutará
	xhr.onreadystatechange = () => 
	{
		if (xhr.status == 200 && xhr.readyState == 4)
		{
			return_data = xhr.responseXML;  // Datos de respuesta
			mostrarRespuesta(return_data);  // Muestra la respuesta en iframe objetivo
		}
	};

	xhr.open("POST", url, true);  // POST a la URL necesaria 
	xhr.setRequestHeader("Content-Type", "application/json");  // Tipo de datos que se envían al servidor
	xhr.send(send_data);  // Enviar petición

}


function mostrarRespuesta(return_data)
{
	// console.log(return_data);
	var html_iframe = new XMLSerializer().serializeToString(return_data);  // datos que mostrar
	// Interpretar la respuesta
	
	form.style.display = "none";  // Escondemos el formulario y su título
	titulo_form.style.display = "none"; 

	// Mostramos la respuesta del servidor dentro del iframe
	iframe_respuesta.contentWindow.document.documentElement.innerHTML = html_iframe;

	iframe_respuesta.style.height = "200px";
}


