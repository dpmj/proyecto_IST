/* IFRAME */

iframe_calendar = document.getElementById('calendar_iframe_id');


/* BOTONES */

button_all = document.getElementById("user_all");
button_user1 = document.getElementById("user1");
button_user2 = document.getElementById("user2");
button_user3 = document.getElementById("user3");
button_user4 = document.getElementById("user4");
button_user5 = document.getElementById("user5");



/* PASO DE MENSAJES AL IFRAME */
// Esto debe hacerse por las restricciones del iframe, que no puede acceder al documento
// padre y viceversa. Esto no es necesario en páginas en las que no se usa iframe
// Código de:
// https://stackoverflow.com/questions/61548354/how-to-postmessage-into-iframe


(function() {
    "use strict";
    function pageProcessing() 
    {
        button_all.addEventListener("click", () => {
            iframe_calendar.contentWindow.postMessage(
                {
                    sender: "user_filter",
                    message: "all"
                },
                "*"
            );
        });
        button_user1.addEventListener("click", () => {
            iframe_calendar.contentWindow.postMessage(
                {
                    sender: "user_filter",
                    message: "user1"
                },
                "*"
            );
        });
        button_user2.addEventListener("click", () => {
            iframe_calendar.contentWindow.postMessage(
                {
                    sender: "user_filter",
                    message: "user2"
                },
                "*"
            );
        });
        button_user3.addEventListener("click", () => {
            iframe_calendar.contentWindow.postMessage(
                {
                    sender: "user_filter",
                    message: "user3"
                },
                "*"
            );
        });
        button_user4.addEventListener("click", () => {
            iframe_calendar.contentWindow.postMessage(
                {
                    sender: "user_filter",
                    message: "user4"
                },
                "*"
            );
        });
        button_user5.addEventListener("click", () => {
            iframe_calendar.contentWindow.postMessage(
                {
                    sender: "user_filter",
                    message: "user5"
                },
                "*"
            );
        });
    }
    window.document.addEventListener('readystatechange', () => {
            if (window.document.readyState == 'complete') {
                pageProcessing();
            }
        }
    );
})();


//.contentWindow.postMessage()