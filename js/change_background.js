/* Este archivo elige un fondo aleatorio del servicio "Pexels"
 * 
 * Para ello realiza una petición GET al servidor correspondiente con un header de 
 * autorización y el URL necesario.
 */


/* CONSTANTES Y CONFIGURACIÓN DEL SCRIPT */

/* Autorización del servicio de Pexels */
const PEXELS_API_KEY = "563492ad6f91700001000001eef076d2187f492499ae82dc5aa87992";

/* Parámetros de la API de Pexels */
const PEXELS_API_URL = "https://api.pexels.com/v1/search";
const PEXELS_PHOTO_TOPIC = "mountain";

/* Elemento HTML del que sustituir el fondo */
var HTML_BODY = document.getElementsByTagName("body")[0];


/* FUNCIONES */

/* Genera la URL de petición al servicio pexels */
function get_pexels_request_url() 
{
    return PEXELS_API_URL
        + "?query=" + PEXELS_PHOTO_TOPIC
        + "&orientation=" + "landscape"
        + "&size=" + "large"
        + "&per_page=" + "80";
}


/* Realiza la petición al servicio */
function get_images_from_pexels() 
{
    /* URL generada por la función anterior */
    var url = get_pexels_request_url();
    var data;

    /* Objeto XML HTTP del navegador para realizar peticiones HTTP */
    var xhr = new XMLHttpRequest();

    xhr.responseType='';
    xhr.onreadystatechange=()=>{
        if(xhr.status==200 && xhr.readyState==4){
            data = JSON.parse(xhr.responseText);
        }
    };

    xhr.open("GET", url, false);  // GET a la URL necesaria 
    xhr.setRequestHeader("Authorization", PEXELS_API_KEY);  // Autorización
    xhr.send();  // Enviar petición

    return data;  // Devuelve los datos de la API, están en JSON
}


/* Elige una imagen nueva para el fondo, llamando a todas las funciones necesarias */
function change_background_image() 
{
    /* Datos devueltos por la API, en formato JSON */
    var data = get_images_from_pexels();

    var N;  // número de fotografías en la respuesta

    // Evitar seleccionar una foto que no existe en la lista
    if (data.per_page < data.total_results) {
        N = data.per_page;
    } else {
        N = data.total_results;
    }

    if (N > 0)   // Siempre que haya algún contenido en la respuesta
    {
        /* Elegir una imagen aleatoriamente de las posibles */
        const i = Math.floor(Math.random() * N);
        const photo_url = data.photos[i].src.original;

        /* Insertar URL en el estilo */
        HTML_BODY.style.backgroundImage = `url(${photo_url})`;
        
        // Guardar fecha de expiración de la cookie
        var days = 7;  // días en los que expira la cookie
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));  // fecha de caducidad

        // Guardar cookie del fondo de pantalla con caducidad
        document.cookie = `background_image=${photo_url}; expires=${date.toGMTString()}`;
        
        // NOTA: los navegadores basados en chromium parecen ignorar las cookies
        // de las páginas locales. En firefox esto no ocurre.
    }
}


/* Busca la cookie correspondiente al fondo de la página web.
 * La cookie puede no existir. En ese caso es creada.
*/
function read_background_cookie()
{
    const name = "background_image" + "=";  // nombre de la cookie
    const cDecoded = decodeURIComponent(document.cookie);  // Conseguir cookies
    const cArr = cDecoded.split(';');  //Separar en vector por ';'
    var res;
    cArr.forEach(val => {  // buscar el valor deseado
        if (val.indexOf(name) === 0) res = val.substring(name.length);
    })
    return res;
}


/* Usa el fondo de pantalla del usuario si existe */
function check_user_background()
{
    var cookie_url = read_background_cookie();
    if (cookie_url) {
        HTML_BODY.style.backgroundImage = `url(${cookie_url})`;
    }
}

check_user_background();

// document.cookie = `background_image=https://images.pexels.com/photos/1687530/pexels-photo-1687530.jpeg`;
// document.cookie = "";
