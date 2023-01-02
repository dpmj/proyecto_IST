// Gestiona la API de Flickr, realiza la petición y actualiza la imagen. También gestiona 
// los botones de actualizar imagen y fuente de la imagen.



// Parámetros de la solicitud a la API de Flickr
const FLICKR_API_URL = "https://api.flickr.com/services/rest/?method=flickr.photos.search";
const FLICKR_API_KEY = "9634ad0e07462c4a3ec07c5ebc97f0c1";
var FLICKR_LAT = "36.545945";
var FLICKR_LONG = "-5.235070";
var FLICKR_TAGS = "genalguacil";
const FLICKR_SORT = "relevance";
const FLICKR_EXTRAS = "url_l";
const FLICKR_FORMAT = "json";



// Solicitud completa
function get_flickr_request_url() {
	var f_url = FLICKR_API_URL 
			  + "&api_key=" + FLICKR_API_KEY 
			  + "&lat=" + FLICKR_LAT 
			  + "&long=" + FLICKR_LONG 
			  + "&tags=" + FLICKR_TAGS 
			  + "&sort=" + FLICKR_SORT
			  + "&extras=" + FLICKR_EXTRAS
			  + "&format=" + FLICKR_FORMAT;
	return f_url;
}



// Código del formulario de coordenadas y keywords
const LONG_ELEMENT_ID = "longitude";
const LAT_ELEMENT_ID = "latitude";
const KEYWORDS_ELEMENT_ID = "keywords";

// Mostrar como placeholder el valor del script por defecto
document.getElementById(LONG_ELEMENT_ID).value = FLICKR_LONG;
document.getElementById(LAT_ELEMENT_ID).value = FLICKR_LAT;
document.getElementById(KEYWORDS_ELEMENT_ID).value = FLICKR_TAGS;



// Envío de la solicitud, cargando en el script "flickr_photo_search" el js que nos 
// devuelve la peitición a la API de Flickr
const FLICKR_SCRIPT_ID = "flickr_photo_search";
var FLICKR_SCRIPT = document.getElementById(FLICKR_SCRIPT_ID);
FLICKR_SCRIPT.src = get_flickr_request_url(); 

const FLICKR_SCRIPT_PARENT_ID = "flickr_photo_parent";
var FLICKR_SCRIPT_PADRE = document.getElementById(FLICKR_SCRIPT_PARENT_ID);



// Declaración de variables globales necesarias para las funciones de abajo
const ELEMENTO_HTML_ID = "flickr_photo_placeholder";
var ELEMENTO_HTML = document.getElementById(ELEMENTO_HTML_ID);

var photo_flicker_fuente;  // Variable global para almacenar la URL de la foto elegida
var datos;  // Variable global para almacenar los datos de flickr



// Elige una foto de Flickr aleatoriamente de entre las descargadas en la variable datos
function eligeFotoFlickr() 
{
	var N;

	// Para evitar seleccionar una foto que no existe en la lista
	if (datos.photos.perpage < datos.photos.total) {
		N = datos.photos.perpage;
	} else {
		N = datos.photos.total;
	}

	const i = Math.floor(Math.random() * N);
	const photo_url = datos.photos.photo[i].url_l;
	const photo_owner = datos.photos.photo[i].owner;
	const photo_id = datos.photos.photo[i].id;

	photo_flicker_fuente = "http://www.flickr.com/photos/" + 
						   datos.photos.photo[i].owner + "/" + 
						   datos.photos.photo[i].id

	// selección del elemento HTML donde irá la foto 

	// Sustituir el valor del atributo src
	ELEMENTO_HTML.src = photo_url;

	// Añadir descripción al elemento
	ELEMENTO_HTML.alt = "Fotografía de " + photo_owner + 
						" Origen: Flickr [ID: " + photo_id + "]";
	ELEMENTO_HTML.title = ELEMENTO_HTML.alt;
}


// Será llamada automáticamente en la respuesta de la petición a Flickr
function jsonFlickrApi(datosAPIFlickr) 
{
	datos = datosAPIFlickr;
	eligeFotoFlickr();
}


// Llamada al pulsar el botón de refresco
function refrescarFlickr() 
{
	eligeFotoFlickr();
}


// Llamada al pulsar el botón de fuente - lleva a la pag correspondiente de FLickr en una 
// nueva pestaña del navegador
function fuenteFlickr()
{
	window.open(photo_flicker_fuente);
}


// Vuelve a hacer una petición al servidor de Flickr para conseguir nuevas fotos
function nuevasFlickr()
{	
	// Actualiza los valores de longitud, latitud y keywords de la búsqueda
	FLICKR_LONG = document.getElementById(LONG_ELEMENT_ID).value;
	FLICKR_LAT = document.getElementById(LAT_ELEMENT_ID).value;
	FLICKR_TAGS = document.getElementById(KEYWORDS_ELEMENT_ID).value;

	// eliminamos el script de Flickr con ID "flickr_photo_placeholder", último hijo de FLICKR_SCRIPT_PADRE
	FLICKR_SCRIPT_PADRE.removeChild(FLICKR_SCRIPT_PADRE.lastChild);  
	
	let flickr_script_node = document.createElement("script");  // creamos el nuevo elemento

	// volvemos a insertar el script de Flickr con ID "flickr_photo_placeholder" como último hijo de FLICKR_SCRIPT_PADRE
	FLICKR_SCRIPT_PADRE.appendChild(flickr_script_node);

	// añadimos los parámetros necesarios, y se vuleve a ejecutar la función jsonFlickrApi automáticamente
	flickr_script_node.id = FLICKR_SCRIPT_ID;
	flickr_script_node.src = get_flickr_request_url();
}


